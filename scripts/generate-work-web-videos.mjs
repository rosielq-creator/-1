import { createHash } from 'node:crypto'
import { execFile } from 'node:child_process'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const root = process.cwd()
const workRoot = path.join(root, 'public/assets/work')
const manifestPath = path.join(root, 'src/data/work-video-sources.json')
const concurrency = Math.max(1, Math.min(3, Number(process.env.WORK_VIDEO_JOBS) || 2))

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) return walk(target)
    return entry.isFile() && /\.mp4$/i.test(entry.name) && !/\.web-[a-f0-9]+\.mp4$/i.test(entry.name) ? [target] : []
  }))
  return files.flat()
}

async function sourceHash(file) {
  const buffer = await fs.readFile(file)
  return createHash('sha256').update(buffer).digest('hex').slice(0, 10)
}

async function probe(file) {
  const { stdout } = await execFileAsync('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height', '-of', 'json', file,
  ])
  const stream = JSON.parse(stdout).streams?.[0]
  if (!stream) throw new Error(`No video stream: ${file}`)
  return stream
}

async function convert(file) {
  const hash = await sourceHash(file)
  const parsed = path.parse(file)
  const output = path.join(parsed.dir, `${parsed.name}.web-${hash}.mp4`)
  const relativeSource = path.relative(path.join(root, 'public/assets'), file).split(path.sep).join('/')
  const relativeOutput = path.relative(path.join(root, 'public/assets'), output).split(path.sep).join('/')
  const { width, height } = await probe(file)
  const portrait = height > width
  const targetWidth = portrait ? 540 : 960
  const targetHeight = portrait ? 960 : 540
  const filter = `scale=${targetWidth}:${targetHeight}:force_original_aspect_ratio=decrease,pad=${targetWidth}:${targetHeight}:(ow-iw)/2:(oh-ih)/2:black`

  try {
    await fs.access(output)
    process.stdout.write(`reuse ${relativeOutput}\n`)
  } catch {
    process.stdout.write(`make  ${relativeOutput}\n`)
    await execFileAsync('ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-y', '-i', file,
      '-map', '0:v:0', '-map', '0:a:0?', '-vf', filter,
      '-c:v', 'libx264', '-profile:v', 'main', '-level', '3.1', '-pix_fmt', 'yuv420p',
      '-preset', 'medium', '-crf', '25', '-maxrate', '900k', '-bufsize', '1800k',
      '-force_key_frames', 'expr:gte(t,n_forced*2)', '-sc_threshold', '0',
      '-c:a', 'aac', '-b:a', '128k', '-ar', '48000',
      '-movflags', '+faststart', output,
    ], { maxBuffer: 1024 * 1024 })
  }
  return [relativeSource, relativeOutput]
}

const files = (await walk(workRoot)).sort()
const results = new Array(files.length)
let cursor = 0

async function worker() {
  while (cursor < files.length) {
    const index = cursor++
    results[index] = await convert(files[index])
  }
}

await Promise.all(Array.from({ length: concurrency }, worker))
const manifest = Object.fromEntries(results)
await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
process.stdout.write(`wrote ${path.relative(root, manifestPath)} (${results.length} videos)\n`)

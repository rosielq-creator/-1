import { mkdirSync, writeFileSync } from 'node:fs'

const outPath = new URL('../public/assets/3d/flower.glb', import.meta.url)
const position = []
const normal = []
const indices = []
const meshes = []

function addVertex(x, y, z, nx = 0, ny = 0, nz = 1) {
  position.push(x, y, z)
  normal.push(nx, ny, nz)
  return position.length / 3 - 1
}

function addPetal(rotation, layer, phase) {
  const start = position.length / 3
  const length = layer === 0 ? 2.55 : 1.8
  const base = layer === 0 ? 0.18 : 0.35
  const long = 20
  const wide = 8
  for (let iy = 0; iy <= long; iy += 1) {
    const t = iy / long
    const r = base + length * t
    const span = (0.12 + 0.72 * Math.pow(Math.sin(Math.PI * t), 0.62)) * (layer === 0 ? 1 : 0.8)
    for (let ix = 0; ix <= wide; ix += 1) {
      const u = ix / wide * 2 - 1
      const wave = 0.16 * Math.sin(t * Math.PI * 2.6 + phase) * (1 - Math.abs(u))
      const curl = 0.28 * Math.sin(t * Math.PI) * u * u
      const x = r * Math.cos(rotation) - u * span * Math.sin(rotation)
      const y = r * Math.sin(rotation) + u * span * Math.cos(rotation)
      const z = 0.14 * Math.sin(Math.PI * t) + wave + curl
      addVertex(x, y, z)
    }
  }
  for (let iy = 0; iy < long; iy += 1) {
    for (let ix = 0; ix < wide; ix += 1) {
      const a = start + iy * (wide + 1) + ix
      const b = a + 1
      const c = a + wide + 1
      indices.push(a, c, b, b, c, c + 1)
    }
  }
}

function addSphere(radius, rings, segments) {
  const start = position.length / 3
  for (let iy = 0; iy <= rings; iy += 1) {
    const v = iy / rings
    const theta = v * Math.PI
    for (let ix = 0; ix <= segments; ix += 1) {
      const u = ix / segments
      const phi = u * Math.PI * 2
      const nx = Math.sin(theta) * Math.cos(phi)
      const ny = Math.cos(theta)
      const nz = Math.sin(theta) * Math.sin(phi)
      addVertex(radius * nx, radius * ny, radius * nz + 0.16, nx, ny, nz)
    }
  }
  for (let iy = 0; iy < rings; iy += 1) {
    for (let ix = 0; ix < segments; ix += 1) {
      const a = start + iy * (segments + 1) + ix
      const b = a + segments + 1
      indices.push(a, b, a + 1, a + 1, b, b + 1)
    }
  }
}

function addStem() {
  const start = position.length / 3
  const rings = 18
  const radius = 0.07
  for (const y of [-0.05, -3.1]) {
    for (let i = 0; i <= rings; i += 1) {
      const a = i / rings * Math.PI * 2
      const x = radius * Math.cos(a)
      const z = radius * Math.sin(a) - 0.1
      addVertex(x, y, z, Math.cos(a), 0, Math.sin(a))
    }
  }
  for (let i = 0; i < rings; i += 1) {
    const a = start + i
    const b = start + rings + 1 + i
    indices.push(a, b, a + 1, a + 1, b, b + 1)
  }
}

for (let i = 0; i < 10; i += 1) addPetal(i / 10 * Math.PI * 2, 0, i * 0.73)
for (let i = 0; i < 7; i += 1) addPetal(i / 7 * Math.PI * 2 + 0.35, 1, i * 0.91)
addSphere(0.38, 12, 18)
addStem()

for (let i = 0; i < normal.length; i += 3) {
  const length = Math.hypot(normal[i], normal[i + 1], normal[i + 2]) || 1
  normal[i] /= length
  normal[i + 1] /= length
  normal[i + 2] /= length
}

const positionBuffer = Buffer.from(new Float32Array(position).buffer)
const normalBuffer = Buffer.from(new Float32Array(normal).buffer)
const indexBuffer = Buffer.from(new Uint16Array(indices).buffer)
const pad = (buffer) => Buffer.concat([buffer, Buffer.alloc((4 - buffer.length % 4) % 4)])
const positionOffset = 0
const normalOffset = pad(positionBuffer).length
const indexOffset = normalOffset + pad(normalBuffer).length
const binary = Buffer.concat([pad(positionBuffer), pad(normalBuffer), pad(indexBuffer)])
const bounds = position.reduce((acc, value, index) => {
  const axis = index % 3
  acc.min[axis] = Math.min(acc.min[axis], value)
  acc.max[axis] = Math.max(acc.max[axis], value)
  return acc
}, { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] })
const gltf = {
  asset: { version: '2.0', generator: 'procedural-flower-glb' },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ mesh: 0, name: 'Silver flower' }],
  meshes: [{ name: 'Silver flower', primitives: [{ attributes: { POSITION: 0, NORMAL: 1 }, indices: 2, material: 0, mode: 4 }] }],
  materials: [{
    name: 'Polished silver',
    pbrMetallicRoughness: { baseColorFactor: [0.7, 0.7, 0.72, 1], metallicFactor: 0.93, roughnessFactor: 0.18 },
    doubleSided: true
  }],
  buffers: [{ byteLength: binary.length }],
  bufferViews: [
    { buffer: 0, byteOffset: positionOffset, byteLength: positionBuffer.length, target: 34962 },
    { buffer: 0, byteOffset: normalOffset, byteLength: normalBuffer.length, target: 34962 },
    { buffer: 0, byteOffset: indexOffset, byteLength: indexBuffer.length, target: 34963 }
  ],
  accessors: [
    { bufferView: 0, componentType: 5126, count: position.length / 3, type: 'VEC3', min: bounds.min, max: bounds.max },
    { bufferView: 1, componentType: 5126, count: normal.length / 3, type: 'VEC3' },
    { bufferView: 2, componentType: 5123, count: indices.length, type: 'SCALAR' }
  ]
}
const json = pad(Buffer.from(JSON.stringify(gltf)))
const header = Buffer.alloc(12)
header.writeUInt32LE(0x46546c67, 0)
header.writeUInt32LE(2, 4)
header.writeUInt32LE(12 + 8 + json.length + 8 + binary.length, 8)
const jsonHeader = Buffer.alloc(8)
jsonHeader.writeUInt32LE(json.length, 0)
jsonHeader.writeUInt32LE(0x4e4f534a, 4)
const binaryHeader = Buffer.alloc(8)
binaryHeader.writeUInt32LE(binary.length, 0)
binaryHeader.writeUInt32LE(0x004e4942, 4)
mkdirSync(new URL('../public/assets/3d/', import.meta.url), { recursive: true })
writeFileSync(outPath, Buffer.concat([header, jsonHeader, json, binaryHeader, binary]))
console.log(`Wrote ${outPath.pathname}: ${position.length / 3} vertices, ${indices.length / 3} triangles`)

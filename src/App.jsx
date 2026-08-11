import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Container, Eyebrow, MediaFrame, Section, TextLink } from './design-system'
import artistProfilesSource from './data/artist-profiles.json'

gsap.registerPlugin(ScrollTrigger)

// Vite supplies `/` locally and `/-1/` on GitHub Pages.
const assets = `${import.meta.env.BASE_URL}assets/`
const vineScaleY = 1.035

const artists = [
  { number: '01', name: 'Amber', slug: 'amber', src: `${assets}artists/thumbs/amber.jpg`, position: '50% 26%', role: 'Digital Muse & Beauty Creator', tags: ['Beauty', 'Fashion', 'Lifestyle'] },
  { number: '02', name: 'Ooona', slug: 'ooona', src: `${assets}artists/thumbs/ooona.jpg`, position: '50% 34%', role: 'Experimental Digital Artist KOL', tags: ['Beauty', 'Art', 'Sport'] },
  { number: '03', name: 'Maya', slug: 'maya', src: `${assets}artists/thumbs/maya.jpg`, position: '50% 34%', role: 'Digital Artist & Cultural Muse', tags: ['Fashion', 'Art', 'Lifestyle'] },
  { number: '04', name: 'Noah', slug: 'noah', src: `${assets}artists/thumbs/noah.jpg`, position: '54% 20%', role: 'Virtual Artist & Visual Storyteller', tags: ['Film', 'Music', 'Lifestyle'] },
  { number: '05', name: 'Mario', slug: 'mario', src: `${assets}artists/thumbs/mario.jpg`, position: '45% 24%', role: 'Virtual Creator & Urban Storyteller', tags: ['Streetwear', 'Travel', 'Culture'] },
]
const featuredArtists = artists.slice(0, 5)

// The portable profile package is the source of truth for the Artist directory.
// Home keeps its existing featured-story copy and composition intentionally.
const directoryArtists = artistProfilesSource.artists.map((artist, index) => ({
  ...artist,
  number: String(index + 1).padStart(2, '0'),
  src: `${assets}artists/thumbs/${artist.id}.jpg`,
  position: '50% 35%',
}))

const directoryLabels = {
  en: {
    eyebrow: 'Artist archive', title: 'Meet all artists', intro: 'New realities, growing now.',
    growing: 'Growing soon', archive: 'Artist archive', all: 'All', reset: 'Reset filters',
    gender: 'Gender', language: 'Language', type: 'Type', city: 'City', results: 'artists found',
    profile: 'View profile', comingSoon: 'Profile is growing', confirmed: 'Confirmed profile fields',
    location: 'Locations', languages: 'Languages', talents: 'Creative talents', back: 'Back to artists',
  },
  zh: {
    eyebrow: '艺术家档案', title: '遇见所有艺术家', intro: '正在生长的全新现实。',
    growing: '即将生长', archive: '艺术家档案', all: '全部', reset: '重置筛选',
    gender: '性别', language: '语言', type: '类型', city: '城市', results: '位艺术家',
    profile: '查看档案', comingSoon: '档案正在生长', confirmed: '已确认资料',
    location: '城市', languages: '语言', talents: '创作类型', back: '返回艺术家列表',
  },
}

const works = [
  { name: 'The Peninsula', slug: 'the-peninsula', category: 'Brand film', video: `${assets}work/the-peninsula.mp4`, poster: `${assets}work/the-peninsula-cover.jpg`, position: '50% 38%', portrait: true },
  { name: 'Childgood', slug: 'childgood', category: 'Campaign film', video: `${assets}work/chillgood-takoyaki.mp4`, poster: `${assets}work/chillgood-cover.jpg`, position: '50% 50%' },
  { name: 'Octopus', slug: 'octopus', category: 'Culture film', video: `${assets}work/octopus.mp4`, poster: `${assets}work/octopus-cover.jpg`, position: '50% 50%' },
  { name: 'MGM', slug: 'mgm', category: 'Brand world', video: `${assets}work/mgm-macau.mp4`, poster: `${assets}work/mgm-cover.jpg`, position: '50% 50%' },
]

const copy = {
  en: {
    nav: ['About', 'Artists', 'Work', 'Brands', 'Services', 'Contact'],
    heroKicker: 'A home for new realities',
    heroBody: 'We build identities, images and worlds for culture-shaping brands.',
    aboutTitle: <>Human taste.<br />Machine possibility.</>,
    aboutBody: 'We represent next-generation artists, fusing art and code, imagination with human point of view.',
    artistsTitle: <>Artists shaping<br />new realities.</>,
    artistsBody: 'Directors, designers and technologists who turn ambitious ideas into work that moves culture.',
    workTitle: <>Selected work,<br />made to move.</>,
    workBody: 'From short films to brand worlds, we create stories that resonate and endure.',
    brandsTitle: <>Built with brands.<br />Made for culture.</>,
    brands: ['Paragon', 'Octopus', 'Chilled TV', 'Chow Sang Sang', 'MCM Macau', 'The Peninsula', 'Asia Allied'],
    worldTitle: <>We build the<br />whole world.</>,
    worldItems: ['AI talent casting', 'Character consulting', 'Content production', 'Campaign collaboration'],
    contactTitle: <>Tell us<br />your story</>,
    form: ['Name', 'Email', 'Project / budget', 'Tell us more'],
    send: 'Send message',
    menu: 'Menu',
  },
  zh: {
    nav: ['关于', '艺术家', '作品', '品牌', '服务', '联系'],
    heroKicker: '新现实的创作之家',
    heroBody: '我们为塑造文化的品牌，构筑身份、影像与世界。',
    aboutTitle: <>人的感知。<br />机器的可能。</>,
    aboutBody: '我们代表新一代创作者，将艺术与代码、想象与人的视角融合在一起。',
    artistsTitle: <>塑造全新现实的<br />创作者。</>,
    artistsBody: '导演、设计师与技术创作者，将大胆想法化为推动文化的作品。',
    workTitle: <>精选作品，<br />为触动而生。</>,
    workBody: '从短片到品牌世界，我们创作能被感受并留下余韵的故事。',
    brandsTitle: <>与品牌同行。<br />为文化而作。</>,
    brands: ['Paragon', 'Octopus', 'Chilled TV', '周生生', 'MCM Macau', '半岛酒店', 'Asia Allied'],
    worldTitle: <>我们构筑<br />完整的世界。</>,
    worldItems: ['AI 人才选角', '角色创意顾问', '内容制作', '活动共创'],
    contactTitle: <>告诉我们<br />你的故事</>,
    form: ['姓名', '邮箱', '项目 / 预算', '还有什么想说'],
    send: '发送消息',
    menu: '菜单',
  },
}

const navTargets = ['about', 'artists', 'work', 'brands', 'services', 'contact']
const navHrefs = ['#about', '#/artists', '#/work', '#brands', '#services', '#contact']

function getRoute() {
  const value = window.location.hash.replace(/^#/, '')
  const parts = value.split('/').filter(Boolean)
  if (parts[0] === 'artists') return { type: parts[1] ? 'artist-detail' : 'artists', slug: parts[1] }
  if (parts[0] === 'work') return { type: parts[1] ? 'work-detail' : 'work', slug: parts[1] }
  return { type: 'home', anchor: value.replace(/^\//, '') }
}

function useRoute() {
  const [route, setRoute] = useState(getRoute)
  useEffect(() => {
    const onHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  return route
}

const artistProfileMedia = {
  amber: {
    hero: 'night-portrait.jpg', gallery: ['denim-editorial.jpg', 'festival-stage.jpg', 'festival-wheel.jpg'],
    poses: { walk: 'walk.webp', lean: 'lean.webp', seat: 'seat.webp' },
    bio: 'Amber is a Korean-American music producer whose identity brings together genre-defying sound, fashion-forward restraint and the rhythm of city culture.',
    dossier: [['Height', '175 cm'], ['Weight', '50 kg'], ['Measurements', '85 / 63 / 89'], ['Shoe size', '38'], ['Based in', 'Los Angeles / Seoul'], ['Languages', 'English / Korean'], ['Followers', '13,094']],
  },
  mario: {
    hero: 'mario-hero.jpg', gallery: ['mario-editorial.jpg', 'mario-campaign.jpg', 'mario-portrait.jpg'],
    poses: { walk: 'walk.webp', lean: 'lean.webp', seat: 'seat.webp' },
    bio: 'Mario is a Chinese lifestyle creator and independent photographer. His world moves between city streets, sport, travel and the quiet details of everyday life.',
    dossier: [['Height', '185 cm'], ['Weight', '80 kg'], ['Measurements', '100 / 80 / 96'], ['Shoe size', '44'], ['Based in', 'Guangdong'], ['Languages', 'Mandarin / Cantonese / English'], ['Followers', '13.5K']],
  },
  ooona: {
    hero: 'hero.jpg', gallery: ['mirror.jpg', 'stairs.jpg', 'sport.jpg'],
    poses: { walk: 'walk.webp', lean: 'lean.webp', seat: 'seat.webp' },
    bio: 'Ooona is a beauty, wellness and lifestyle talent. Her world combines yoga, clean beauty and a gentle Seoul sensibility that feels light and approachable.',
    dossier: [['Height', '165 cm'], ['Weight', '45 kg'], ['Measurements', '82 / 60 / 86'], ['Shoe size', '38'], ['Based in', 'Seoul'], ['Languages', 'Korean / English'], ['Followers', '15.1K']],
  },
  noah: {
    hero: 'hero.png', gallery: ['black-portrait.png', 'cafe-portrait.png', 'apple-portrait.jpg'],
    poses: { walk: 'walk.webp', lean: 'lean.webp', seat: 'seat.webp' },
    bio: 'Noah Jae is a visual storyteller whose work moves between fashion, film and travel, balancing a precise point of view with an understated urban energy.',
    dossier: [['Height', '180 cm'], ['Weight', '70 kg'], ['Measurements', '88 / 77 / 91'], ['Shoe size', '43'], ['Based in', 'Hong Kong / Seoul / Tokyo'], ['Languages', 'Cantonese / Mandarin / English'], ['Followers', '8,254']],
  },
}

function useHomeNarrative(active) {
  const rootRef = useRef(null)
  useEffect(() => {
    if (!active || !rootRef.current) return undefined
    const root = rootRef.current
    root.classList.remove('is-loaded')
    const sections = [...root.querySelectorAll('.section')]
    const cycles = new WeakMap()
    const replaySection = (section) => {
      if (section.dataset.motionInReadingZone !== 'true' || section.classList.contains('is-inview')) return
      const cycle = (cycles.get(section) || 0) + 1
      cycles.set(section, cycle)
      section.dataset.motionCycle = String(cycle)
      section.classList.remove('is-inview')
      // Two frames with the inactive state applied make every CSS keyframe restart,
      // rather than relying on the browser to replay a reused class name.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (cycles.get(section) === cycle && section.dataset.motionInReadingZone === 'true') {
          section.classList.add('is-inview')
        }
      }))
    }
    const resetSection = (section) => {
      cycles.set(section, (cycles.get(section) || 0) + 1)
      section.dataset.motionInReadingZone = 'false'
      section.classList.remove('is-inview')
    }
    sections.forEach((section) => {
      section.dataset.motionInReadingZone = 'false'
      section.classList.remove('is-inview')
    })
    let introTimer
    const introFrame = requestAnimationFrame(() => {
      introTimer = window.setTimeout(() => root.classList.add('is-loaded'), 140)
    })
    const readingObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.dataset.motionInReadingZone = entry.isIntersecting ? 'true' : 'false'
        if (entry.isIntersecting) replaySection(entry.target)
      })
    }, { threshold: 0.01, rootMargin: '-22% 0px -22% 0px' })
    sections.forEach((section) => readingObserver.observe(section))
    let frame
    const setProgress = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
        root.style.setProperty('--page-progress', `${Math.min(1, window.scrollY / max)}`)
        // Do not reset while a section is nearby. It has to leave an entire
        // buffered viewport before it can be armed for the next pass.
        const viewport = window.innerHeight
        sections.forEach((section) => {
          const rect = section.getBoundingClientRect()
          if (rect.bottom < -viewport * 0.18 || rect.top > viewport * 1.18) resetSection(section)
        })
      })
    }
    setProgress()
    window.addEventListener('scroll', setProgress, { passive: true })
    return () => {
      readingObserver.disconnect()
      window.removeEventListener('scroll', setProgress)
      cancelAnimationFrame(frame)
      cancelAnimationFrame(introFrame)
      window.clearTimeout(introTimer)
    }
  }, [active])
  return rootRef
}

function BotanicalStory() {
  const storyRef = useRef(null)
  const sproutRef = useRef(null)
  const vineRef = useRef(null)
  const flowerRef = useRef(null)
  const continuationRef = useRef(null)
  const [anchors, setAnchors] = useState({ vineX: 0, vineY: 0, vineClip: 0, continuationX: 0, continuationY: 0 })

  const measureContent = useCallback((node) => {
    const image = node?.querySelector('img')
    if (!storyRef.current || !node || !image?.naturalWidth) return null
    const scale = Math.min(node.offsetWidth / image.naturalWidth, node.offsetHeight / image.naturalHeight)
    const width = image.naturalWidth * scale
    const height = image.naturalHeight * scale
    return { left: node.offsetLeft + (node.offsetWidth - width) / 2, top: node.offsetTop + (node.offsetHeight - height) / 2, width, height }
  }, [])

  const updateAnchors = useCallback(() => {
    if (window.innerWidth <= 760) return
    const sprout = measureContent(sproutRef.current)
    const vine = measureContent(vineRef.current)
    const flower = measureContent(flowerRef.current)
    const continuation = measureContent(continuationRef.current)
    if (!sprout || !vine || !flower || !continuation) return
    const sproutAnchor = { x: sprout.left + sprout.width * 0.6, y: sprout.top + sprout.height }
    const vineAnchor = { x: vine.left + vine.width * 0.5, y: vine.top }
    const flowerAnchor = { x: flower.left + flower.width * 0.52, y: flower.top + flower.height }
    const continuationAnchor = { x: continuation.left + continuation.width * 0.5, y: continuation.top }
    const siteScale = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--site-scale')) || 1
    const overlap = Math.round(112 * siteScale)
    const workTop = document.getElementById('work')?.offsetTop
    const vineX = Math.round(sproutAnchor.x - vineAnchor.x)
    const vineY = Math.round(sproutAnchor.y - vineAnchor.y - overlap)
    const next = {
      vineX, vineY,
      vineClip: workTop == null ? 0 : Math.max(0, Math.ceil(vineRef.current.offsetHeight - (workTop - vineRef.current.offsetTop - vineY) / vineScaleY)),
      continuationX: Math.round(flowerAnchor.x - continuationAnchor.x),
      continuationY: Math.round(flowerAnchor.y - continuationAnchor.y - overlap),
    }
    setAnchors((current) => Object.keys(next).every((key) => current[key] === next[key]) ? current : next)
  }, [measureContent])

  useLayoutEffect(() => {
    const observer = new ResizeObserver(() => requestAnimationFrame(updateAnchors))
    const nodes = [storyRef, sproutRef, vineRef, flowerRef, continuationRef].map(({ current }) => current).filter(Boolean)
    const images = nodes.map((node) => node.querySelector('img')).filter(Boolean)
    nodes.forEach((node) => observer.observe(node))
    images.forEach((image) => image.addEventListener('load', updateAnchors))
    window.addEventListener('resize', updateAnchors)
    document.fonts?.ready?.then(updateAnchors)
    requestAnimationFrame(updateAnchors)
    return () => { observer.disconnect(); images.forEach((image) => image.removeEventListener('load', updateAnchors)); window.removeEventListener('resize', updateAnchors) }
  }, [updateAnchors])

  return <div ref={storyRef} className="botanical-story" aria-hidden="true">
    <MediaFrame priority decorative fit="contain" className="story-plant story-seed" src={`${assets}transparent/seed.png`} />
    <MediaFrame decorative fit="contain" ref={sproutRef} className="story-plant story-sprout" src={`${assets}transparent/sprout.png`} />
    <MediaFrame decorative fit="contain" ref={vineRef} className="story-plant story-vine" src={`${assets}transparent/vine-v2.png`} style={{ '--vine-x': `${anchors.vineX}px`, '--vine-y': `${anchors.vineY}px`, '--vine-clip': `${anchors.vineClip}px`, '--vine-scale-y': vineScaleY }} />
    <MediaFrame decorative fit="contain" ref={flowerRef} className="story-plant story-flower" src={`${assets}transparent/flower-v2.png`} />
    <MediaFrame decorative fit="contain" ref={continuationRef} className="story-plant story-continuation" src={`${assets}transparent/continuation-v2.png`} style={{ '--continuation-x': `${anchors.continuationX}px`, '--continuation-y': `${anchors.continuationY}px` }} />
  </div>
}

function Header({ language, setLanguage, menuOpen, setMenuOpen }) {
  const t = copy[language]
  return <header className="site-header">
    <Container className="header-inner">
      <a className="brand-signature" href="#/" aria-label="Green Tomato home"><span aria-hidden="true" />GreenTomato</a>
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
        {t.nav.map((item, index) => <a key={navTargets[index]} href={navHrefs[index]} onClick={() => setMenuOpen(false)}>{item}</a>)}
      </nav>
      <div className="header-actions">
        <button className="language-toggle" type="button" onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')} aria-label="Switch language">{language === 'en' ? '中文' : 'EN'}</button>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} aria-label={t.menu}><span /><span /></button>
      </div>
    </Container>
  </header>
}

function ArtistCard({ artist, onOpen, total }) {
  return <button className={`artist-tile artist-tile--${artist.slug}`} type="button" onClick={() => onOpen(`#/artists/${artist.slug}`)} aria-label={`View ${artist.name} profile`}>
    <img src={artist.src} alt={`Portrait of ${artist.name}`} style={{ objectPosition: artist.position }} loading="lazy" decoding="async" />
    <span className="artist-scrim" aria-hidden="true" />
    <span className="artist-number" aria-hidden="true">{artist.number} / {String(total).padStart(2, '0')}</span>
    <span className="artist-info"><strong>{artist.name}</strong><span className="artist-role">{artist.role}</span><span className="artist-tags">{artist.tags.join(' · ')}</span></span>
    <span className="artist-profile">View profile <b aria-hidden="true">→</b></span>
  </button>
}

function WorkCard({ work, onPlay }) {
  const [muted, setMuted] = useState(true)

  const toggleMuted = (event) => {
    event.stopPropagation()
    setMuted((current) => !current)
  }

  return <article className={`work-card work-card--${work.slug}`}>
    <img className="work-video" src={work.poster} alt="" style={{ objectPosition: work.position }} loading="lazy" decoding="async" />
    <span className="work-name">{work.name}</span><span className="work-category">{work.category}</span><span className="work-case">Play case →</span>
    <div className="work-controls" aria-label={`${work.name} video controls`}>
      <button className="work-control work-control--play" type="button" onClick={() => onPlay(work, muted)} aria-label={`Play ${work.name}`}>▶</button>
      <span className="work-progress" aria-hidden="true" />
      <button className="work-control" type="button" onClick={toggleMuted} aria-label={muted ? 'Play video with sound' : 'Play video muted'}>{muted ? '🔇' : '🔊'}</button>
    </div>
  </article>
}

function WorkPlayerModal({ work, initialMuted, onClose }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(initialMuted)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    video?.play().catch(() => setPlaying(false))
    return () => { window.removeEventListener('keydown', onKeyDown); video?.pause() }
  }, [onClose])

  const togglePlayback = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) video.play().catch(() => setPlaying(false))
    else video.pause()
  }
  const toggleMuted = () => {
    const nextMuted = !muted
    setMuted(nextMuted)
    if (videoRef.current) videoRef.current.muted = nextMuted
  }
  const seek = (event) => {
    const video = videoRef.current
    if (!video?.duration) return
    video.currentTime = Number(event.target.value) * video.duration
  }
  const closeFromBackdrop = (event) => { if (event.target === event.currentTarget) onClose() }

  return <div className={`work-player-modal ${work.portrait ? 'work-player-modal--portrait' : ''}`} role="dialog" aria-modal="true" aria-label={`${work.name} video player`} onMouseDown={closeFromBackdrop}>
    <div className="work-player-dialog" onMouseDown={(event) => event.stopPropagation()}>
      <video ref={videoRef} className="work-player-video" src={work.video} poster={work.poster} playsInline muted={muted} style={{ objectPosition: work.position }} onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => { setPlaying(false); setProgress(0) }} onTimeUpdate={(event) => setProgress(event.currentTarget.duration ? event.currentTarget.currentTime / event.currentTarget.duration : 0)} />
      <div className="work-player-meta"><strong>{work.name}</strong><span>{work.category}</span></div>
      <div className="work-player-controls">
        <button className="work-control work-control--play" type="button" onClick={togglePlayback} aria-label={playing ? 'Pause video' : 'Play video'}>{playing ? 'Ⅱ' : '▶'}</button>
        <input className="work-progress" type="range" min="0" max="1" step="0.001" value={progress} onChange={seek} aria-label="Video progress" />
        <button className="work-control" type="button" onClick={toggleMuted} aria-label={muted ? 'Unmute video' : 'Mute video'}>{muted ? '🔇' : '🔊'}</button>
      </div>
      <button className="work-player-close" type="button" onClick={onClose} aria-label="Close video">×</button>
    </div>
  </div>
}

function HomePage({ t, onNavigate }) {
  const homeRef = useHomeNarrative(true)
  const [submitted, setSubmitted] = useState(false)
  const [activeWork, setActiveWork] = useState(null)
  const [workStartsMuted, setWorkStartsMuted] = useState(true)
  const onSubmit = (event) => { event.preventDefault(); if (event.currentTarget.checkValidity()) setSubmitted(true) }
  const openWork = (work, muted) => { setWorkStartsMuted(muted); setActiveWork(work) }
  const closeWork = useCallback(() => setActiveWork(null), [])
  return <>
  <main id="main" className="home-main" ref={homeRef}>
    <BotanicalStory />
    <Section id="top" tone="dark" className="hero">
      <Container className="hero-grid">
        <Eyebrow number="01">{t.heroKicker}</Eyebrow><h1><span>Green</span><span className="outline">Tomato</span></h1><p className="hero-copy">{t.heroBody}</p><p className="hero-credit">Est. Hong Kong</p><p className="scroll-note">Scroll to grow</p>
      </Container>
    </Section>
    <Section id="about" tone="light" className="about-section"><Container className="split-layout"><div className="section-copy"><Eyebrow number="02">About us</Eyebrow><h2>{t.aboutTitle}</h2><p>{t.aboutBody}</p></div></Container></Section>
    <Section id="artists" tone="dark" className="artists-section"><Container className="artists-layout"><div className="section-copy"><Eyebrow number="03">Artists</Eyebrow><h2>{t.artistsTitle}</h2><p>{t.artistsBody}</p><TextLink className="directory-link" href="#/artists">View all artists</TextLink></div><div className="artist-tiles" aria-label="Featured artist portraits">{featuredArtists.map((artist) => <ArtistCard key={artist.slug} artist={artist} onOpen={onNavigate} total={artists.length} />)}</div></Container></Section>
    <Section id="work" tone="light" className="work-section"><Container className="work-layout"><div className="section-copy"><Eyebrow number="04">Work</Eyebrow><h2>{t.workTitle}</h2><p>{t.workBody}</p><TextLink href="#/work">View all work</TextLink></div><div className="work-grid" aria-label="Selected work">{works.map((work) => <WorkCard key={work.slug} work={work} onPlay={openWork} />)}</div></Container></Section>
    <Section id="brands" tone="dark" className="brands-section"><Container className="brands-layout"><div className="section-copy"><Eyebrow number="05">Brands & services</Eyebrow><h2>{t.brandsTitle}</h2><ul className="brand-list">{t.brands.map((brand) => <li key={brand}>{brand}</li>)}</ul></div><div id="services" className="world-copy"><h2>{t.worldTitle}</h2><ul>{t.worldItems.map((item) => <li key={item}>{item}</li>)}</ul></div></Container></Section>
    <Section id="contact" tone="light" className="contact-section"><Container className="contact-layout"><div><Eyebrow number="06">Contact</Eyebrow><h2>{t.contactTitle}</h2><form className="contact-form" onSubmit={onSubmit} noValidate><input aria-label={t.form[0]} placeholder={t.form[0]} required /><input aria-label={t.form[1]} placeholder={t.form[1]} type="email" required /><input aria-label={t.form[2]} placeholder={t.form[2]} /><textarea aria-label={t.form[3]} placeholder={t.form[3]} rows="2" required /><button type="submit">{t.send}</button>{submitted && <p className="form-message" role="status">Thank you — we will be in touch.</p>}</form></div></Container></Section>
  </main>
  {activeWork && <WorkPlayerModal work={activeWork} initialMuted={workStartsMuted} onClose={closeWork} />}
  </>
}

function PageHeader({ eyebrow, title, back, backLabel = 'Back' }) {
  return <div className="page-heading"><a className="back-link" href={back}>← {backLabel}</a><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1></div>
}

function useArtistDirectoryNarrative() {
  const rootRef = useRef(null)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    let frame = requestAnimationFrame(() => root.classList.add('is-ready'))
    const archive = root.querySelector('.artist-archive-section')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-inview', entry.isIntersecting))
    }, { threshold: 0.16, rootMargin: '0px 0px -12% 0px' })
    if (archive) observer.observe(archive)
    return () => { cancelAnimationFrame(frame); observer.disconnect() }
  }, [])
  return rootRef
}

function DirectoryArtistCard({ artist, language, className = '', style }) {
  const labels = directoryLabels[language]
  const role = language === 'zh' ? artist.role_zh : artist.role_en
  const profileHash = `#/artists/${artist.profile_slug}`
  const openProfile = (event) => { event.preventDefault(); window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); window.location.hash = profileHash }
  return <a className={`directory-artist-card ${className}`} href={profileHash} onClick={openProfile} aria-label={`${labels.profile}: ${artist.display_name}`} style={style}>
    <img src={artist.src} alt={`Portrait of ${artist.display_name}`} style={{ objectPosition: artist.position }} loading="lazy" decoding="async" />
    <span className="directory-card-scrim" aria-hidden="true" />
    <span className="directory-card-number">{artist.number} / 05</span>
    <span className="directory-card-info"><strong>{artist.display_name}</strong><small>{role}</small><em>{artist.creative_talents.slice(0, 3).join(' · ')}</em></span>
    <span className="directory-card-link">{labels.profile} <b aria-hidden="true">→</b></span>
  </a>
}

function ArtistFilters({ filters, setFilters, language }) {
  const labels = directoryLabels[language]
  const options = useMemo(() => ({
    gender: [...new Set(directoryArtists.map((artist) => artist.gender))],
    language: [...new Set(directoryArtists.flatMap((artist) => artist.languages))],
    type: [...new Set(directoryArtists.flatMap((artist) => artist.creative_talents))],
    city: [...new Set(directoryArtists.flatMap((artist) => artist.locations))],
  }), [])
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  return <div className="artist-filters" aria-label={labels.archive}>
    {Object.entries(options).map(([key, values]) => <label key={key}><span>{labels[key]}</span><select value={filters[key]} onChange={(event) => setFilter(key, event.target.value)}><option value="all">{labels.all}</option>{values.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>)}
    <button type="button" onClick={() => setFilters({ gender: 'all', language: 'all', type: 'all', city: 'all' })}>{labels.reset}</button>
  </div>
}

function ArtistArchive({ language }) {
  const labels = directoryLabels[language]
  const [filters, setFilters] = useState({ gender: 'all', language: 'all', type: 'all', city: 'all' })
  const dragRef = useRef({ active: false, moved: false, startX: 0, startScrollLeft: 0 })
  const filteredArtists = useMemo(() => directoryArtists.filter((artist) => (
    (filters.gender === 'all' || artist.gender === filters.gender)
    && (filters.language === 'all' || artist.languages.includes(filters.language))
    && (filters.type === 'all' || artist.creative_talents.includes(filters.type))
    && (filters.city === 'all' || artist.locations.includes(filters.city))
  )), [filters])
  const startDrag = (event) => {
    if (event.pointerType === 'touch') return
    const rail = event.currentTarget
    dragRef.current = { active: true, moved: false, startX: event.clientX, startScrollLeft: rail.scrollLeft }
  }
  const drag = (event) => {
    const state = dragRef.current
    if (!state.active) return
    const delta = event.clientX - state.startX
    if (Math.abs(delta) > 5) state.moved = true
    event.currentTarget.scrollLeft = state.startScrollLeft - delta
  }
  const stopDrag = () => { dragRef.current.active = false }
  return <section className="artist-archive-section" aria-labelledby="artist-archive-title">
    <Container>
      <div className="artist-archive-heading"><Eyebrow number="02">{labels.archive}</Eyebrow><p id="artist-archive-title">{filteredArtists.length} {labels.results}</p></div>
      <ArtistFilters filters={filters} setFilters={setFilters} language={language} />
    </Container>
    <div className="artist-archive-rail" tabIndex="0" aria-label={labels.archive} onPointerDown={startDrag} onPointerMove={drag} onPointerUp={stopDrag} onPointerCancel={stopDrag}>
      <div className="artist-archive-track">
        {filteredArtists.map((artist, index) => <DirectoryArtistCard key={artist.id} artist={artist} language={language} className="artist-archive-card" style={{ '--archive-offset': `${(2 - index) * 30}vw`, '--archive-delay': `${index * 85}ms` }} />)}
        {!filteredArtists.length && <p className="artist-empty">No artists match these filters.</p>}
      </div>
    </div>
  </section>
}

function ArtistsOverview({ language }) {
  const labels = directoryLabels[language]
  const rootRef = useArtistDirectoryNarrative()
  const titleLetters = [...labels.title.toUpperCase()]
  return <main id="main" ref={rootRef} className="artist-directory subpage--dark">
    <section className="artist-directory-stage" aria-labelledby="meet-artists-title">
      <Container className="artist-directory-stage-inner">
        <Eyebrow number="01">{labels.eyebrow}</Eyebrow>
        <h1 id="meet-artists-title" className="artist-directory-title" aria-label={labels.title}>{titleLetters.map((letter, index) => <span key={`${letter}-${index}`} aria-hidden="true" style={{ '--title-index': index }}>{letter === ' ' ? '\u00a0' : letter}</span>)}</h1>
        <span className="artist-directory-intro">{labels.intro}</span>
      </Container>
    </section>
    <ArtistArchive language={language} />
  </main>
}

function ArtistDetail({ artist, language }) {
  if (!artist) return <NotFound />
  if (artist.id === 'maya') return <MayaProfile artist={artist} language={language} />
  if (storyProfiles[artist.id]) return <ArtistStoryProfile artist={artist} language={language} story={storyProfiles[artist.id]} />
  if (artistProfileMedia[artist.id]) return <ArtistProfile artist={artist} language={language} media={artistProfileMedia[artist.id]} />
  const labels = directoryLabels[language]
  const role = language === 'zh' ? artist.role_zh : artist.role_en
  return <main id="main" className="subpage subpage--dark"><Container><div className="detail-grid detail-grid--artist"><div><PageHeader eyebrow={`${artist.number} / Artist`} title={artist.display_name} back="#/artists" backLabel={labels.back} /><p className="detail-role">{role}</p><dl className="artist-confirmed-fields"><div><dt>{labels.location}</dt><dd>{artist.locations.join(' · ')}</dd></div><div><dt>{labels.languages}</dt><dd>{artist.languages.join(' · ')}</dd></div><div><dt>{labels.talents}</dt><dd>{artist.creative_talents.join(' · ')}</dd></div></dl><p className="artist-coming-soon">{labels.comingSoon}</p></div><figure className="detail-media"><img src={artist.src} alt={`Portrait of ${artist.display_name}`} style={{ objectPosition: artist.position }} /></figure></div></Container></main>
}

const storyProfiles = {
  amber: {
    palette: { base: '#d9e1e5', atmosphere: '#b9c5cd', deep: '#151b20', glow: 'rgba(74, 99, 114, .28)', ink: '#101519' },
    poses: { hero: 'walk.webp', identity: 'lean.webp', detail: 'seat.webp' },
    role: 'Music Producer / Fashion', hello: 'I’m Amber.', slogan: 'A music producer and fashion artist shaped by city culture.',
    intro: ['I build sound, image and atmosphere as one language.', 'My world moves at the edge of the city — precise, nocturnal and unapologetic.'],
    personalityTitle: ['Sound with', 'a sharp edge.'],
    personality: [
      ['Precise', 'Every beat and silhouette begins with deliberate restraint.'],
      ['Nocturnal', 'I am drawn to the charged stillness of the city after dark.'],
      ['Genre-free', 'Music, fashion and image meet without needing a category.'],
      ['Self-possessed', 'I keep the point of view clear, even when the room gets loud.'],
    ],
    worldLead: 'Frames from the sound, style and rhythm around me.',
    world: [
      ['night-portrait.jpg', 'After dark', 'A precise kind of quiet'],
      ['denim-editorial.jpg', 'Style', 'Structure in motion'],
      ['festival-stage.jpg', 'Sound', 'Where the energy lands'],
      ['festival-wheel.jpg', 'City light', 'A moving horizon'],
    ],
    socialLabel: 'Instagram snapshot · historical', socialHandle: 'Instagram', followers: '13,094',
    factsLabel: 'Profile signal', facts: [['Based in', 'Los Angeles / Seoul'], ['Languages', 'English / Korean'], ['Focus', 'Music / Fashion / City Culture']],
    cta: 'Want to create something together?', next: 'Next artist · Ooona', nextSlug: 'ooona',
  },
  ooona: {
    palette: { base: '#e6e5d9', atmosphere: '#d2d7ca', deep: '#202824', glow: 'rgba(92, 116, 101, .24)', ink: '#19211d' },
    poses: { hero: 'walk.webp', identity: 'lean.webp', detail: 'seat.webp' },
    role: 'Beauty / Wellness Artist', hello: 'I’m Ooona.', slogan: 'A beauty and wellness artist who brings softness to everyday rituals.',
    intro: ['I make room for small rituals, clear energy and lightness.', 'Beauty feels most alive when it moves with the body and the day.'],
    personalityTitle: ['Softness with', 'a pulse.'],
    personality: [
      ['Grounded', 'I return to simple routines that make space for feeling.'],
      ['Luminous', 'I look for light, skin and movement that feel unforced.'],
      ['Curious', 'Wellness is a living practice, never a fixed answer.'],
      ['Open', 'The best images leave room to breathe and become your own.'],
    ],
    worldLead: 'Beauty, motion and everyday rituals in my own rhythm.',
    world: [['hero.jpg', 'Beauty', 'A bright beginning'], ['mirror.jpg', 'Reflection', 'Looking closer'], ['stairs.jpg', 'City life', 'A gentle ascent'], ['sport.jpg', 'Motion', 'Energy in practice']],
    socialLabel: 'Instagram snapshot · historical', socialHandle: 'Instagram', followers: '15.1K',
    factsLabel: 'Profile signal', facts: [['Based in', 'Seoul'], ['Languages', 'Korean / English'], ['Focus', 'Beauty / Wellness / Lifestyle']],
    cta: 'Want to create something together?', next: 'Next artist · Mario', nextSlug: 'mario',
  },
  mario: {
    palette: { base: '#dfd3c2', atmosphere: '#c8b6a0', deep: '#24201d', glow: 'rgba(116, 84, 55, .25)', ink: '#211b16' },
    poses: { hero: 'walk.webp', identity: 'lean.webp', detail: 'seat.webp' },
    role: 'Lifestyle Creator / Photographer', hello: 'I’m Mario.', slogan: 'A lifestyle creator and photographer focused on street, sport and travel.',
    intro: ['I photograph the pace, texture and humour of everyday city life.', 'Streetwear, sport and travel are the ways I keep the frame moving.'],
    personalityTitle: ['The city,', 'up close.'],
    personality: [
      ['Observant', 'The smallest detail can carry the whole story.'],
      ['Restless', 'I follow the next street, train and game without overplanning it.'],
      ['Direct', 'A good image says enough before it explains itself.'],
      ['Playful', 'The work stays serious only as long as it needs to be.'],
    ],
    worldLead: 'Streets, journeys and small scenes worth keeping.',
    world: [['mario-hero.jpg', 'City life', 'The everyday frame'], ['mario-editorial.jpg', 'Style', 'A sharper line'], ['mario-campaign.jpg', 'Campaign', 'Built for motion'], ['yotree-cover.jpg', 'Travel', 'A different pace']],
    socialLabel: 'Instagram snapshot · historical', socialHandle: 'Instagram', followers: '13.5K',
    factsLabel: 'Profile signal', facts: [['Based in', 'Guangdong'], ['Languages', 'Mandarin / Cantonese / English'], ['Focus', 'Lifestyle / Sport / Travel']],
    cta: 'Want to create something together?', next: 'Next artist · Noah', nextSlug: 'noah',
  },
  noah: {
    palette: { base: '#d7dce0', atmosphere: '#b8c1c8', deep: '#182127', glow: 'rgba(53, 78, 93, .28)', ink: '#11191f' },
    poses: { hero: 'walk.webp', identity: 'lean.webp', detail: 'seat.webp' },
    role: 'Film / Fashion Artist', hello: 'I’m Noah.', slogan: 'A fashion and film artist with a visual storyteller’s eye.',
    intro: ['I tell visual stories through movement, distance and a clean silhouette.', 'Fashion, film and travel meet somewhere between restraint and velocity.'],
    personalityTitle: ['Move with', 'intention.'],
    personality: [
      ['Cinematic', 'I see each frame as part of a longer sequence.'],
      ['Measured', 'The strongest gesture is often the most controlled one.'],
      ['Restless', 'New cities reset the way I look at the familiar.'],
      ['Focused', 'I keep the line clean and the energy moving forward.'],
    ],
    worldLead: 'Visual notes from fashion, film and life in transit.',
    world: [['hero.png', 'Portrait', 'A clear point of view'], ['black-portrait.png', 'Fashion', 'Built in contrast'], ['cafe-portrait.png', 'City life', 'Between takes'], ['apple-portrait.jpg', 'Travel', 'A passing frame']],
    socialLabel: 'Instagram snapshot · historical', socialHandle: 'Instagram', followers: '8,254',
    factsLabel: 'Profile signal', facts: [['Based in', 'Hong Kong / Seoul / Tokyo'], ['Languages', 'Cantonese / Mandarin / English'], ['Focus', 'Film / Fashion / Photography']],
    cta: 'Want to create something together?', next: 'Next artist · Maya', nextSlug: 'maya',
  },
}

function ArtistProfile({ artist, language, media }) {
  const labels = directoryLabels[language]
  const role = language === 'zh' ? artist.role_zh : artist.role_en
  const pose = (name) => `${assets}artists/profile-poses/${artist.id}/${media.poses[name]}`
  return <main id="main" className="artist-profile-page subpage--dark">
    <Container>
      <a className="back-link" href="#/artists">← {labels.back}</a>
      <section className="artist-profile-hero">
        <div><Eyebrow number={artist.number}>Artist profile</Eyebrow><h1>{artist.display_name}</h1><p className="artist-profile-role">{role}</p><p className="artist-profile-bio">{media.bio}</p><a className="artist-contact-link" href="#contact">Work with {artist.display_name} →</a></div>
        <figure className="artist-profile-hero-pose"><img src={pose('walk')} alt={`${artist.display_name} in motion`} fetchPriority="high" /></figure>
      </section>
      <section className="artist-profile-section"><Eyebrow number="02">Personal dossier</Eyebrow><dl className="artist-profile-dossier">{media.dossier.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
      <section className="artist-profile-section artist-profile-motion"><div><Eyebrow number="03">In motion</Eyebrow><h2>Built to move.</h2><p>Each profile holds the same visual identity through a quieter, more editorial series of poses.</p></div><div className="artist-profile-motion-figures"><figure><img src={pose('lean')} alt={`${artist.display_name} leaning pose`} loading="lazy" /></figure><figure><img src={pose('seat')} alt={`${artist.display_name} seated pose`} loading="lazy" /></figure></div></section>
      <section className="artist-profile-section artist-profile-gallery"><Eyebrow number="04">Selected frames</Eyebrow><div>{media.gallery.map((file) => <figure key={file}><img src={`${assets}artists/profile-media/${artist.id}/${file}`} alt={`${artist.display_name} visual diary`} loading="lazy" /></figure>)}</div></section>
    </Container>
  </main>
}

const mayaStanding = { src: `${assets}artists/maya-guide/standing.png`, alt: 'Maya standing in a pink luxury fashion look' }
const mayaWalking = { src: `${assets}artists/maya-guide/walk.png`, alt: 'Maya in a side-profile pink luxury fashion look' }

const mayaWorldImages = [
  ['pink-editorial.jpg', 'Fashion', 'Soft structure'], ['pink-closeup.jpg', 'Beauty', 'A quiet close-up'],
  ['black-tailoring.jpg', 'Art', 'A tailored pause'], ['street-grey.jpg', 'City life', 'Between places'],
].map(([file, category, caption]) => ({ src: `${assets}artists/maya-world/mockup/${file}`, category, caption }))

const mayaStoryCopy = {
  en: {
    back: 'Back to artists', role: 'Luxury Fashion / Art', hello: 'I’m Maya.', slogan: 'A high-fashion artist working between luxury, art and culture.',
    dossier: 'Personal dossier', personality: 'Personality', height: 'Height', weight: 'Weight', measurements: 'Measurements', shoe: 'Shoe size', base: 'Based in', languages: 'Languages', type: 'Artist type',
    world: 'My World', worldLead: 'References that keep my world in motion.', about: 'About Me', social: 'Social + Contact', followers: 'Followers', audience: 'Audience snapshot · 30 days',
    cta: 'Want to create something together?', work: 'Work with Maya', next: 'Next artist · Amber',
    personalityItems: [
      ['Restrained', 'I believe restraint leaves room for imagination.'],
      ['Intelligent', 'Every look begins with a considered point of view.'],
      ['Artistic', 'I am drawn to images with texture, rhythm and emotion.'],
      ['Independent', 'I move between cities while keeping my own tempo.'],
    ],
    aboutLines: ['I collect references before I make a statement.', 'My work lives between soft structure and a clear point of view.', 'Fashion becomes personal when it makes space for feeling.'],
    worldMoments: [['Fashion', 'Soft structure'], ['Art', 'Looking closely'], ['City life', 'Between places'], ['Beauty', 'Quiet ritual']],
    age1824: '18–24', age2534: '25–34', male: 'Male audience', female: 'Female audience', countries: 'Top countries', swipe: 'Swipe to explore',
  },
  zh: {
    back: '返回艺术家列表', role: '奢华时尚 / 艺术', hello: '我是 Maya。', slogan: '一位游走于奢华、艺术与文化之间的高级时尚艺术家。',
    dossier: '个人档案', personality: '人物气质', height: '身高', weight: '体重', measurements: '三围', shoe: '鞋码', base: '常驻地', languages: '语言', type: '人物类型',
    world: '我的世界', worldLead: '让我的世界持续流动的灵感。', about: '关于我', social: '社交与合作', followers: '粉丝数', audience: '受众快照 · 近 30 天',
    cta: '想一起创作些什么吗？', work: '与 Maya 合作', next: '下一位艺术家 · Amber',
    personalityItems: [
      ['克制', '我相信克制会为想象留下空间。'],
      ['理性', '每一个造型，都从经过思考的观点开始。'],
      ['艺术感', '我会被有纹理、节奏与情绪的画面吸引。'],
      ['独立', '我穿行于不同城市，也保持自己的节奏。'],
    ],
    aboutLines: ['在表达之前，我会先收集参考与感受。', '我的作品在柔和结构与清晰观点之间生长。', '当时尚为感受留出空间，它就会变得很私人。'],
    worldMoments: [['时尚', '柔和结构'], ['艺术', '凝视细节'], ['城市生活', '城市之间'], ['美妆', '安静仪式']],
    age1824: '18–24 岁', age2534: '25–34 岁', male: '男性受众', female: '女性受众', countries: '热门国家／地区', swipe: '滑动浏览',
  },
}

function useMayaProfileMotion() {
  const rootRef = useRef(null)
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || window.innerWidth <= 820) { root.dataset.mayaMotion = 'static'; return undefined }
    root.dataset.mayaMotion = 'pinned'
    const ctx = gsap.context(() => {
      const stage = root.querySelector('.maya-stage')
      const scenes = gsap.utils.toArray('.maya-scene')
      const camera = root.querySelector('.maya-camera')
      const atmosphere = root.querySelector('.maya-atmosphere')
      const personality = gsap.utils.toArray('.maya-personality-item')
      gsap.set(scenes, { autoAlpha: 0, y: 22, pointerEvents: 'none' })
      gsap.set(scenes[0], { autoAlpha: 1, y: 0, pointerEvents: 'auto' })
      gsap.set(personality, { opacity: 1, x: 0 })
      gsap.set(camera, { xPercent: 0, yPercent: 0, scale: 1, transformOrigin: '50% 50%' })

      const revealScene = (timeline, from, to, at) => {
        timeline.to(from, { autoAlpha: 0, y: -20, pointerEvents: 'none', duration: .32 }, at)
          .fromTo(to, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, pointerEvents: 'auto', duration: .42 }, at + .18)
      }
      const timeline = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
        trigger: root, start: 'top top', end: () => `+=${window.innerHeight * 6.2}`, pin: stage,
        scrub: .75, anticipatePin: 1, invalidateOnRefresh: true,
      } })
      // Keep the Maya camera inside the left subject lane while the dossier owns the right reading lane.
      timeline.to(camera, { xPercent: -208, yPercent: 12, scale: 1.9, transformOrigin: '50% 17%', duration: 1.3 }, .45)
        .to(atmosphere, { xPercent: -5, yPercent: 3, scale: 1.08, backgroundColor: '#191718', duration: 1.3 }, .45)
        .to(camera, { autoAlpha: 0, duration: .16 }, .75)
      revealScene(timeline, scenes[0], scenes[1], .78)
      // The close garment frame stays entirely to the left of the Personality column.
      timeline.to(camera, { autoAlpha: 1, xPercent: -198, yPercent: -14, scale: 1.9, transformOrigin: '50% 52%', duration: 1.25 }, 1.75)
        .to(atmosphere, { xPercent: 6, yPercent: -4, scale: 1.14, backgroundColor: '#191718', duration: 1.25 }, 1.75)
      revealScene(timeline, scenes[1], scenes[2], 1.92)
      personality.forEach((item, index) => {
        timeline.to(item, { x: 12, duration: .18 }, 2.15 + index * .22)
      })
      // Scene 04 is image-free: the subject holds its final 03 framing, then fades away before the phone appears.
      timeline.to(camera, { autoAlpha: 0, duration: .34 }, 2.82)
        .to(atmosphere, { xPercent: -3, yPercent: 2, scale: 1.02, backgroundColor: '#e7ded9', duration: 1.15 }, 3.05)
      revealScene(timeline, scenes[2], scenes[3], 3.18)
      timeline.to(atmosphere, { backgroundColor: '#efa7b1', duration: .72 }, 4.42)
      revealScene(timeline, scenes[3], scenes[4], 4.48)
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }, root)
    return () => ctx.revert()
  }, [])
  return rootRef
}

function useProfileStart(profileId) {
  useLayoutEffect(() => {
    // Hash navigation must always enter a pinned story at scene 01, never at the
    // scroll position carried over from the artist directory rail.
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      ScrollTrigger.refresh()
    })
    return () => cancelAnimationFrame(frame)
  }, [profileId])
}

function MayaWorldPhone({ copy }) {
  const railRef = useRef(null)
  const dragRef = useRef({ active: false, x: 0, scroll: 0 })
  const [page, setPage] = useState(1)
  const onPointerDown = (event) => {
    const rail = railRef.current
    if (!rail) return
    dragRef.current = { active: true, x: event.clientX, scroll: rail.scrollLeft }
    rail.setPointerCapture?.(event.pointerId)
  }
  const onPointerMove = (event) => {
    if (!dragRef.current.active || !railRef.current) return
    railRef.current.scrollLeft = dragRef.current.scroll - (event.clientX - dragRef.current.x)
  }
  const onPointerUp = () => { dragRef.current.active = false }
  const onScroll = () => {
    const rail = railRef.current
    if (!rail) return
    setPage(Math.min(mayaWorldImages.length, Math.max(1, Math.round(rail.scrollLeft / Math.max(1, rail.clientWidth)) + 1)))
  }
  return <div className="maya-phone" aria-label="Maya Instagram-style visual diary">
    <div className="maya-phone-top"><span>10:24</span><b>@mayakim02</b><span>•••</span></div>
    <div ref={railRef} className="maya-phone-rail" tabIndex="0" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onScroll={onScroll}>
      {mayaWorldImages.map((image, index) => <figure key={image.src}><img src={image.src} alt={`Maya — ${image.category}: ${image.caption}`} loading={index < 2 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} /><figcaption><strong>{image.category}</strong><span>{image.caption}</span></figcaption></figure>)}
    </div>
    <div className="maya-phone-bottom"><span>{page} / {mayaWorldImages.length}</span><span>{copy.swipe} ↔</span></div>
  </div>
}

function MayaProfile({ artist, language }) {
  const rootRef = useMayaProfileMotion()
  useProfileStart(artist.id)
  const dossier = artist.personal_dossier
  const social = artist.social_snapshot
  const copy = mayaStoryCopy[language]
  const audience = artist.audience_snapshot || { age_18_24: '28.4%', age_25_34: '33.4%', male_audience: '81.6%', female_audience: '18.4%', countries: 'Korea 32.9% / India 11.5% / Taiwan 8.0%' }
  // Keep the guide and diary images ready before their pinned scene becomes visible.
  // Lazy-loading hidden scenes made Maya appear only after the visitor had already scrolled through them.
  useEffect(() => {
    ;[mayaStanding.src, mayaWalking.src, ...mayaWorldImages.slice(0, 2).map(({ src }) => src)].forEach((src) => {
      const image = new Image()
      image.src = src
    })
  }, [])
  return <main id="main" ref={rootRef} className="maya-profile">
    <div className="maya-stage">
      <div className="maya-atmosphere" aria-hidden="true" />
      <figure className="maya-camera" aria-hidden="true"><img src={mayaStanding.src} alt="" fetchPriority="high" /></figure>
      <section className="maya-scene maya-scene--hero"><Container><div className="maya-safe maya-safe--hero"><a className="back-link" href="#/artists">← {copy.back}</a><Eyebrow number="01">Artist / 05</Eyebrow><h1>Maya</h1><p className="maya-role">{copy.role}</p><p className="maya-hello">{copy.hello}</p><div className="maya-about-intro"><p>{copy.slogan}</p></div></div><img className="maya-mobile-crop maya-mobile-crop--hero" src={mayaStanding.src} alt={mayaStanding.alt} /></Container></section>
      <section className="maya-scene maya-scene--identity"><Container><figure className="maya-identity-portrait" aria-hidden="true"><img src={mayaWalking.src} alt="" fetchPriority="high" /></figure><div className="maya-safe maya-safe--identity"><Eyebrow number="02">{copy.dossier}</Eyebrow><h2>Identity</h2><dl className="maya-dossier"><div><dt>{copy.height}</dt><dd>{dossier.height}</dd></div><div><dt>{copy.weight}</dt><dd>{dossier.weight}</dd></div><div><dt>{copy.measurements}</dt><dd>{dossier.measurements}</dd></div><div><dt>{copy.shoe}</dt><dd>{dossier.shoe_size}</dd></div><div><dt>{copy.base}</dt><dd>{artist.locations.join(' / ')}</dd></div><div><dt>{copy.languages}</dt><dd>{artist.languages.join(' / ')}</dd></div><div className="maya-dossier-wide"><dt>{copy.type}</dt><dd>{artist.creative_talents.join(' / ')}</dd></div></dl></div><img className="maya-mobile-crop" src={mayaWalking.src} alt={mayaWalking.alt} /></Container></section>
      <section className="maya-scene maya-scene--detail"><Container><div className="maya-safe maya-safe--detail"><Eyebrow number="03">{copy.personality}</Eyebrow><h2 className="maya-detail-title"><span>Details of</span><span>character.</span></h2><div className="maya-personality-list">{copy.personalityItems.map(([title, text], index) => <article className="maya-personality-item" key={title}><b>{String(index + 1).padStart(2, '0')}</b><div className="maya-personality-copy"><h3>{title}</h3><p>{text}</p></div></article>)}</div></div><img className="maya-mobile-crop" src={mayaStanding.src} alt={mayaStanding.alt} /></Container></section>
      <section className="maya-scene maya-scene--world"><Container><div className="maya-safe maya-safe--world"><div className="maya-world-copy"><Eyebrow number="04">{copy.world}</Eyebrow><h2>{copy.world}</h2><p>{copy.worldLead}</p><p>{copy.aboutLines[2]}</p></div><MayaWorldPhone copy={copy} /></div></Container></section>
      <section className="maya-scene maya-scene--social"><Container><div className="maya-safe maya-safe--social"><Eyebrow number="05">{copy.social}</Eyebrow><div className="maya-social-layout"><div className="maya-social-metric"><a className="maya-social-handle" href={social.url} target="_blank" rel="noreferrer">{social.platform} · {social.handle} ↗</a><strong className="maya-followers">{dossier.followers_snapshot}<small>{copy.followers}</small></strong></div><div className="maya-audience"><p>{copy.audience}</p><dl><div><dt>{copy.age2534}</dt><dd>{audience.age_25_34}</dd></div><div><dt>{copy.age1824}</dt><dd>{audience.age_18_24}</dd></div><div><dt>{copy.male}</dt><dd>{audience.male_audience}</dd></div><div><dt>{copy.female}</dt><dd>{audience.female_audience}</dd></div><div className="maya-audience-countries"><dt>{copy.countries}</dt><dd>{audience.countries}</dd></div></dl></div><div className="maya-cta"><h2>{language === 'zh' ? <><span>想一起</span><span>创作</span><span>些什么</span><span>吗？</span></> : <><span>Want to</span><span>create</span><span>something</span><span>together?</span></>}</h2><a className="maya-primary-link" href="#contact">{copy.work} →</a><a className="maya-secondary-link" href="#/artists/amber">{copy.next} →</a></div></div></div></Container></section>
    </div>
  </main>
}

function useArtistStoryMotion() {
  const rootRef = useRef(null)
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || window.innerWidth <= 820) { root.dataset.mayaMotion = 'static'; return undefined }
    root.dataset.mayaMotion = 'pinned'
    const ctx = gsap.context(() => {
      const stage = root.querySelector('.maya-stage')
      const scenes = gsap.utils.toArray('.maya-scene')
      const camera = root.querySelector('.maya-camera')
      const poses = gsap.utils.toArray('.story-camera-pose')
      const atmosphere = root.querySelector('.maya-atmosphere')
      const personality = gsap.utils.toArray('.maya-personality-item')
      gsap.set(scenes, { autoAlpha: 0, y: 22, pointerEvents: 'none' })
      gsap.set(scenes[0], { autoAlpha: 1, y: 0, pointerEvents: 'auto' })
      gsap.set(poses, { autoAlpha: 0 })
      gsap.set(poses[0], { autoAlpha: 1 })
      gsap.set(personality, { opacity: 1, x: 0 })
      gsap.set(camera, { xPercent: 0, yPercent: 0, scale: 1, transformOrigin: '50% 50%' })
      const revealScene = (timeline, from, to, at) => timeline.to(from, { autoAlpha: 0, y: -20, pointerEvents: 'none', duration: .32 }, at).fromTo(to, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, pointerEvents: 'auto', duration: .42 }, at + .18)
      const timeline = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: root, start: 'top top', end: () => `+=${window.innerHeight * 6.2}`, pin: stage, scrub: .75, anticipatePin: 1, invalidateOnRefresh: true } })
      timeline.to(camera, { xPercent: -188, yPercent: 12, scale: 1.78, transformOrigin: '50% 16%', duration: 1.3 }, .45)
        .to(atmosphere, { xPercent: -5, yPercent: 3, scale: 1.08, backgroundColor: 'var(--story-deep)', duration: 1.3 }, .45)
        .to(camera, { autoAlpha: 0, duration: .16 }, .75)
      revealScene(timeline, scenes[0], scenes[1], .78)
      timeline.set(poses[0], { autoAlpha: 0 }, 1.75).set(poses[2], { autoAlpha: 1 }, 1.75)
        .to(camera, { autoAlpha: 1, xPercent: -198, yPercent: -14, scale: 1.9, transformOrigin: '50% 52%', duration: 1.25 }, 1.75)
        .to(atmosphere, { xPercent: 6, yPercent: -4, scale: 1.14, backgroundColor: 'var(--story-deep)', duration: 1.25 }, 1.75)
      revealScene(timeline, scenes[1], scenes[2], 1.92)
      personality.forEach((item, index) => timeline.to(item, { x: 12, duration: .18 }, 2.15 + index * .22))
      // Keep every artist in place as scene 03 resolves, then remove the figure before the image-only My World scene.
      timeline.to(camera, { autoAlpha: 0, duration: .34 }, 2.82)
        .to(atmosphere, { xPercent: -3, yPercent: 2, scale: 1.02, backgroundColor: 'var(--story-base)', duration: 1.15 }, 3.05)
      revealScene(timeline, scenes[2], scenes[3], 3.18)
      timeline.to(atmosphere, { backgroundColor: 'var(--story-base)', duration: .72 }, 4.42)
      revealScene(timeline, scenes[3], scenes[4], 4.48)
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }, root)
    return () => ctx.revert()
  }, [])
  return rootRef
}

function ArtistWorldPhone({ artist, story, copy }) {
  const railRef = useRef(null)
  const dragRef = useRef({ active: false, x: 0, scroll: 0 })
  const [page, setPage] = useState(1)
  const onPointerDown = (event) => { const rail = railRef.current; if (!rail) return; dragRef.current = { active: true, x: event.clientX, scroll: rail.scrollLeft }; rail.setPointerCapture?.(event.pointerId) }
  const onPointerMove = (event) => { if (dragRef.current.active && railRef.current) railRef.current.scrollLeft = dragRef.current.scroll - (event.clientX - dragRef.current.x) }
  const onPointerUp = () => { dragRef.current.active = false }
  const onScroll = () => { const rail = railRef.current; if (rail) setPage(Math.min(story.world.length, Math.max(1, Math.round(rail.scrollLeft / Math.max(1, rail.clientWidth)) + 1))) }
  return <div className="maya-phone" aria-label={`${artist.display_name} Instagram-style visual diary`}>
    <div className="maya-phone-top"><span>10:24</span><b>{artist.display_name.toLowerCase()}</b><span>•••</span></div>
    <div ref={railRef} className="maya-phone-rail" tabIndex="0" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onScroll={onScroll}>
      {story.world.map(([file, category, caption], index) => <figure key={file}><img src={`${assets}artists/profile-media/${artist.id}/${file}`} alt={`${artist.display_name} — ${category}: ${caption}`} loading={index < 2 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} /><figcaption><strong>{category}</strong><span>{caption}</span></figcaption></figure>)}
    </div>
    <div className="maya-phone-bottom"><span>{page} / {story.world.length}</span><span>{copy.swipe} ↔</span></div>
  </div>
}

function ArtistStoryProfile({ artist, language, story }) {
  const rootRef = useArtistStoryMotion()
  useProfileStart(artist.id)
  const media = artistProfileMedia[artist.id]
  const copy = mayaStoryCopy[language]
  const pose = (name) => `${assets}artists/profile-poses/${artist.id}/${story.poses[name]}`
  const cssVars = { '--story-base': story.palette.base, '--story-atmosphere': story.palette.atmosphere, '--story-deep': story.palette.deep, '--story-glow': story.palette.glow, '--story-ink': story.palette.ink }
  useLayoutEffect(() => {
    // Decode the three pose frames together. The camera is ready before the visitor reaches either cross-fade.
    const sources = [pose('hero'), pose('identity'), pose('detail'), ...story.world.slice(0, 2).map(([file]) => `${assets}artists/profile-media/${artist.id}/${file}`)]
    sources.forEach((src) => { const image = new Image(); image.src = src; image.decode?.().catch(() => {}) })
  }, [artist.id])
  return <main id="main" ref={rootRef} className="maya-profile artist-story-profile" style={cssVars}>
    <div className="maya-stage">
      <div className="maya-atmosphere" aria-hidden="true" />
      <figure className="maya-camera story-camera" aria-hidden="true"><img className="story-camera-pose" src={pose('hero')} alt="" fetchPriority="high" decoding="async" /><img className="story-camera-pose" src={pose('identity')} alt="" decoding="async" /><img className="story-camera-pose" src={pose('detail')} alt="" fetchPriority="high" decoding="async" /></figure>
      <section className="maya-scene maya-scene--hero"><Container><div className="maya-safe maya-safe--hero"><a className="back-link" href="#/artists">← {copy.back}</a><Eyebrow number="01">Artist / 05</Eyebrow><h1>{artist.display_name}</h1><p className="maya-role">{story.role}</p><p className="maya-hello">{story.hello}</p><div className="maya-about-intro"><p>{story.slogan}</p></div></div><img className="maya-mobile-crop maya-mobile-crop--hero" src={pose('hero')} alt={`${artist.display_name} standing pose`} /></Container></section>
      <section className="maya-scene maya-scene--identity"><Container><figure className="maya-identity-portrait" aria-hidden="true"><img src={pose('identity')} alt="" fetchPriority="high" decoding="async" /></figure><div className="maya-safe maya-safe--identity"><Eyebrow number="02">{copy.dossier}</Eyebrow><h2>Identity</h2><dl className="maya-dossier">{media.dossier.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}<div className="maya-dossier-wide"><dt>{copy.type}</dt><dd>{artist.creative_talents.join(' / ')}</dd></div></dl></div><img className="maya-mobile-crop" src={pose('identity')} alt={`${artist.display_name} editorial pose`} /></Container></section>
      <section className="maya-scene maya-scene--detail"><Container><div className="maya-safe maya-safe--detail"><Eyebrow number="03">{copy.personality}</Eyebrow><h2 className="maya-detail-title">{story.personalityTitle.map((line) => <span key={line}>{line}</span>)}</h2><div className="maya-personality-list">{story.personality.map(([title, text], index) => <article className="maya-personality-item" key={title}><b>{String(index + 1).padStart(2, '0')}</b><div className="maya-personality-copy"><h3>{title}</h3><p>{text}</p></div></article>)}</div></div><img className="maya-mobile-crop" src={pose('detail')} alt={`${artist.display_name} seated pose`} /></Container></section>
      <section className="maya-scene maya-scene--world"><Container><div className="maya-safe maya-safe--world"><div className="maya-world-copy"><Eyebrow number="04">{copy.world}</Eyebrow><h2>{copy.world}</h2><p>{story.worldLead}</p><p>{story.intro[1]}</p></div><ArtistWorldPhone artist={artist} story={story} copy={copy} /></div></Container></section>
      <section className="maya-scene maya-scene--social"><Container><div className="maya-safe maya-safe--social"><Eyebrow number="05">{copy.social}</Eyebrow><div className="maya-social-layout"><div className="maya-social-metric"><span className="maya-social-handle">{story.socialHandle} · {story.socialLabel}</span><strong className="maya-followers">{story.followers}<small>{copy.followers}</small></strong></div><div className="maya-audience"><p>{story.factsLabel}</p><dl>{story.facts.map(([label, value]) => <div key={label} className={label === 'Focus' ? 'maya-audience-countries' : ''}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div><div className="maya-cta"><h2>{story.cta.split(' ').map((word, index) => <span key={`${word}-${index}`}>{word}</span>)}</h2><a className="maya-primary-link" href="#contact">Work with {artist.display_name} →</a><a className="maya-secondary-link" href={`#/artists/${story.nextSlug}`}>{story.next} →</a></div></div></div></Container></section>
    </div>
  </main>
}

function WorkOverview() {
  return <main id="main" className="subpage subpage--light"><Container><PageHeader eyebrow="Selected work / 04" title={<>Made<br />to move.</>} back="#/" /><div className="work-index">{works.map((work, index) => <a className="work-index-card" href={`#/work/${work.slug}`} key={work.slug}><span>{String(index + 1).padStart(2, '0')}</span><strong>{work.name}</strong><i>▶</i><small>View case →</small></a>)}</div></Container></main>
}

function WorkDetail({ work }) {
  if (!work) return <NotFound />
  return <main id="main" className="subpage subpage--light"><Container><div className="detail-grid detail-grid--work"><div><PageHeader eyebrow="Selected work" title={work.name} back="#/work" /><p className="detail-role">Video case study</p><p className="detail-tags">Media placeholder · 16:9</p></div><div className="detail-work-media" aria-label={`${work.name} media placeholder`}><span>▶</span><strong>{work.name}</strong><small>Video media coming soon</small></div></div></Container></main>
}

function NotFound() { return <main id="main" className="subpage subpage--dark"><Container><PageHeader eyebrow="404" title="Not found." back="#/" /></Container></main> }

function Footer() { return <footer className="site-footer"><Container><a className="wordmark" href="#/">GreenTomato</a><span>© {new Date().getFullYear()} Green Tomato</span></Container></footer> }

export default function App() {
  const [language, setLanguage] = useState('en')
  const [menuOpen, setMenuOpen] = useState(false)
  const route = useRoute()
  const t = copy[language]

  useLayoutEffect(() => {
    if (route.type === 'home') return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [route.type, route.slug])

  useEffect(() => {
    if (route.type !== 'home' || !route.anchor) return
    requestAnimationFrame(() => {
      document.getElementById(route.anchor)?.scrollIntoView({ block: 'start' })
      if (route.anchor === 'contact') document.querySelector('.contact-form input')?.focus({ preventScroll: true })
    })
  }, [route])

  const navigate = useCallback((hash) => { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); window.location.hash = hash }, [])
  const content = route.type === 'home' ? <HomePage t={t} onNavigate={navigate} />
    : route.type === 'artists' ? <ArtistsOverview language={language} />
      : route.type === 'artist-detail' ? <ArtistDetail artist={directoryArtists.find((artist) => artist.profile_slug === route.slug)} language={language} />
        : route.type === 'work' ? <WorkOverview />
          : route.type === 'work-detail' ? <WorkDetail work={works.find((work) => work.slug === route.slug)} />
            : <NotFound />
  return <><a className="skip-link" href="#main">Skip to content</a><Header language={language} setLanguage={setLanguage} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />{content}<Footer /></>
}

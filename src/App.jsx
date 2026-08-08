import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Container, Eyebrow, MediaFrame, Section, TextLink } from './design-system'

const assets = '/assets/'
const vineScaleY = 1.035

const artists = [
  { number: '01', name: 'Amber', slug: 'amber', src: `${assets}artists/amber.png`, position: '50% 26%', role: 'Digital Muse & Beauty Creator', tags: ['Beauty', 'Fashion', 'Lifestyle'] },
  { number: '02', name: 'Ooona', slug: 'ooona', src: `${assets}artists/ooona.png`, position: '50% 34%', role: 'Experimental Digital Artist KOL', tags: ['Beauty', 'Art', 'Sport'] },
  { number: '03', name: 'Maya', slug: 'maya', src: `${assets}artists/maya.png`, position: '50% 34%', role: 'Digital Artist & Cultural Muse', tags: ['Fashion', 'Art', 'Lifestyle'] },
  { number: '04', name: 'Noah', slug: 'noah', src: `${assets}artists/noah.png`, position: '54% 20%', role: 'Virtual Artist & Visual Storyteller', tags: ['Film', 'Music', 'Lifestyle'] },
  { number: '05', name: 'Mario', slug: 'mario', src: `${assets}artists/mario.jpg`, position: '45% 24%', role: 'Virtual Creator & Urban Storyteller', tags: ['Streetwear', 'Travel', 'Culture'] },
]
const featuredArtists = artists.slice(0, 5)

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
    <MediaFrame priority decorative fit="contain" ref={sproutRef} className="story-plant story-sprout" src={`${assets}transparent/sprout.png`} />
    <MediaFrame priority decorative fit="contain" ref={vineRef} className="story-plant story-vine" src={`${assets}transparent/vine-v2.png`} style={{ '--vine-x': `${anchors.vineX}px`, '--vine-y': `${anchors.vineY}px`, '--vine-clip': `${anchors.vineClip}px`, '--vine-scale-y': vineScaleY }} />
    <MediaFrame priority decorative fit="contain" ref={flowerRef} className="story-plant story-flower" src={`${assets}transparent/flower-v2.png`} />
    <MediaFrame priority decorative fit="contain" ref={continuationRef} className="story-plant story-continuation" src={`${assets}transparent/continuation-v2.png`} style={{ '--continuation-x': `${anchors.continuationX}px`, '--continuation-y': `${anchors.continuationY}px` }} />
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

function PageHeader({ eyebrow, title, back }) {
  return <div className="page-heading"><a className="back-link" href={back}>← Back</a><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1></div>
}

function ArtistsOverview() {
  return <main id="main" className="subpage subpage--dark"><Container><PageHeader eyebrow="Artist index" title={<>New<br />realities.</>} back="#/" /><div className="artist-index">{artists.map((artist) => <a href={`#/artists/${artist.slug}`} className="artist-index-card" key={artist.slug}><img src={artist.src} alt={`Portrait of ${artist.name}`} style={{ objectPosition: artist.position }} /><span>{artist.number}</span><strong>{artist.name}</strong><small>{artist.role}</small></a>)}</div></Container></main>
}

function ArtistDetail({ artist }) {
  if (!artist) return <NotFound />
  return <main id="main" className="subpage subpage--dark"><Container><div className="detail-grid detail-grid--artist"><div><PageHeader eyebrow={`${artist.number} / Artist`} title={artist.name} back="#/artists" /><p className="detail-role">{artist.role}</p><p className="detail-tags">{artist.tags.join(' · ')}</p></div><figure className="detail-media"><img src={artist.src} alt={`Portrait of ${artist.name}`} style={{ objectPosition: artist.position }} /></figure></div></Container></main>
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

  useEffect(() => {
    if (route.type !== 'home' || !route.anchor) return
    requestAnimationFrame(() => document.getElementById(route.anchor)?.scrollIntoView({ block: 'start' }))
  }, [route])

  const navigate = useCallback((hash) => { window.location.hash = hash }, [])
  const content = route.type === 'home' ? <HomePage t={t} onNavigate={navigate} />
    : route.type === 'artists' ? <ArtistsOverview />
      : route.type === 'artist-detail' ? <ArtistDetail artist={artists.find((artist) => artist.slug === route.slug)} />
        : route.type === 'work' ? <WorkOverview />
          : route.type === 'work-detail' ? <WorkDetail work={works.find((work) => work.slug === route.slug)} />
            : <NotFound />
  return <><a className="skip-link" href="#main">Skip to content</a><Header language={language} setLanguage={setLanguage} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />{content}<Footer /></>
}

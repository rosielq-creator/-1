import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Container, Eyebrow, MediaFrame, Section, TextLink } from './design-system'

const assets = '/assets/'
const vineScaleY = 1.035

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

function BotanicalStory() {
  const storyRef = useRef(null)
  const sproutRef = useRef(null)
  const vineRef = useRef(null)
  const flowerRef = useRef(null)
  const continuationRef = useRef(null)
  const [anchors, setAnchors] = useState({ vineX: 0, vineY: 0, vineClip: 0, continuationX: 0, continuationY: 0 })

  const measureContent = useCallback((node) => {
    const story = storyRef.current
    const image = node?.querySelector('img')
    if (!story || !node || !image?.naturalWidth) return null
    const scale = Math.min(node.offsetWidth / image.naturalWidth, node.offsetHeight / image.naturalHeight)
    const width = image.naturalWidth * scale
    const height = image.naturalHeight * scale
    return {
      left: node.offsetLeft + (node.offsetWidth - width) / 2,
      top: node.offsetTop + (node.offsetHeight - height) / 2,
      width,
      height,
    }
  }, [])

  const updateAnchors = useCallback(() => {
    if (window.innerWidth <= 760) return
    const sprout = measureContent(sproutRef.current)
    const vine = measureContent(vineRef.current)
    const flower = measureContent(flowerRef.current)
    const continuation = measureContent(continuationRef.current)
    if (!sprout || !vine || !flower || !continuation) return

    // The cropped PNGs make these normalized points stable across desktop sizes.
    const sproutAnchor = { x: sprout.left + sprout.width * 0.6, y: sprout.top + sprout.height }
    const vineAnchor = { x: vine.left + vine.width * 0.5, y: vine.top }
    const flowerAnchor = { x: flower.left + flower.width * 0.52, y: flower.top + flower.height }
    const continuationAnchor = { x: continuation.left + continuation.width * 0.5, y: continuation.top }
    // Deep overlap hides the crystal stem beneath the flower's visible root.
    const overlap = 112
    const workTop = document.getElementById('work')?.offsetTop
    const vineX = Math.round(sproutAnchor.x - vineAnchor.x)
    const vineY = Math.round(sproutAnchor.y - vineAnchor.y - overlap)
    const next = {
      vineX,
      vineY,
      // The vine belongs to Artists: remove only the portion that would enter Work.
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
    return () => {
      observer.disconnect()
      images.forEach((image) => image.removeEventListener('load', updateAnchors))
      window.removeEventListener('resize', updateAnchors)
    }
  }, [updateAnchors])

  return <div ref={storyRef} className="botanical-story" aria-hidden="true">
    <MediaFrame priority decorative fit="contain" className="story-plant story-seed" src={`${assets}transparent/seed.png`} />
    <MediaFrame priority decorative fit="contain" ref={sproutRef} className="story-plant story-sprout" src={`${assets}transparent/sprout.png`} />
    <MediaFrame priority decorative fit="contain" ref={vineRef} className="story-plant story-vine" src={`${assets}transparent/vine-v2.png`} style={{ '--vine-x': `${anchors.vineX}px`, '--vine-y': `${anchors.vineY}px`, '--vine-clip': `${anchors.vineClip}px`, '--vine-scale-y': vineScaleY }} />
    <MediaFrame priority decorative fit="contain" ref={flowerRef} className="story-plant story-flower" src={`${assets}transparent/flower-v2.png`} />
    <MediaFrame priority decorative fit="contain" ref={continuationRef} className="story-plant story-continuation" src={`${assets}transparent/continuation-v2.png`} style={{ '--continuation-x': `${anchors.continuationX}px`, '--continuation-y': `${anchors.continuationY}px` }} />
  </div>
}

export default function App() {
  const [language, setLanguage] = useState('en')
  const [menuOpen, setMenuOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const t = copy[language]

  const onSubmit = (event) => {
    event.preventDefault()
    if (event.currentTarget.checkValidity()) setSubmitted(true)
  }

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <Container className="header-inner">
        <a className="brand-signature" href="#top" aria-label="Green Tomato home"><span aria-hidden="true" />GreenTomato</a>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          {t.nav.map((item, index) => <a key={navTargets[index]} href={`#${navTargets[index]}`} onClick={() => setMenuOpen(false)}>{item}</a>)}
        </nav>
        <div className="header-actions">
          <button className="language-toggle" type="button" onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')} aria-label="Switch language">{language === 'en' ? '中文' : 'EN'}</button>
          <button className="menu-toggle" type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} aria-label={t.menu}><span /><span /></button>
        </div>
      </Container>
    </header>

    <main id="main">
      <BotanicalStory />
      <Section id="top" tone="dark" className="hero">
        <Container className="hero-grid">
          <Eyebrow number="01">{t.heroKicker}</Eyebrow>
          <h1><span>Green</span><span className="outline">Tomato</span></h1>
          <p className="hero-copy">{t.heroBody}</p>
          <p className="hero-credit">Est. Hong Kong</p>
          <p className="scroll-note">Scroll to grow</p>
        </Container>
      </Section>

      <Section id="about" tone="light" className="about-section">
        <Container className="split-layout">
          <div className="section-copy"><Eyebrow number="02">About us</Eyebrow><h2>{t.aboutTitle}</h2><p>{t.aboutBody}</p></div>
        </Container>
      </Section>

      <Section id="artists" tone="dark" className="artists-section">
        <Container className="artists-layout">
          <div className="section-copy"><Eyebrow number="03">Artists</Eyebrow><h2>{t.artistsTitle}</h2><p>{t.artistsBody}</p><TextLink href="#work">View all artists</TextLink></div>
          <div className="artist-tiles" aria-label="Artist placeholders">{[1, 2, 3, 4, 5].map((item) => <div key={item} className="artist-tile" />)}</div>
        </Container>
      </Section>

      <Section id="work" tone="light" className="work-section">
        <Container className="work-layout">
          <div className="section-copy"><Eyebrow number="04">Work</Eyebrow><h2>{t.workTitle}</h2><p>{t.workBody}</p><TextLink href="#contact">View all work</TextLink></div>
          <div className="work-grid" aria-label="Selected work placeholders">{[1, 2, 3, 4].map((item) => <button key={item} className="work-card" type="button" aria-label={`Open selected work ${item}`}><span>▶</span></button>)}</div>
        </Container>
      </Section>

      <Section id="brands" tone="dark" className="brands-section">
        <Container className="brands-layout">
          <div className="section-copy"><Eyebrow number="05">Brands & services</Eyebrow><h2>{t.brandsTitle}</h2><ul className="brand-list">{t.brands.map((brand) => <li key={brand}>{brand}</li>)}</ul></div>
          <div id="services" className="world-copy"><h2>{t.worldTitle}</h2><ul>{t.worldItems.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </Container>
      </Section>

      <Section id="contact" tone="light" className="contact-section">
        <Container className="contact-layout">
          <div><Eyebrow number="06">Contact</Eyebrow><h2>{t.contactTitle}</h2>
            <form className="contact-form" onSubmit={onSubmit} noValidate>
              <input aria-label={t.form[0]} placeholder={t.form[0]} required />
              <input aria-label={t.form[1]} placeholder={t.form[1]} type="email" required />
              <input aria-label={t.form[2]} placeholder={t.form[2]} />
              <textarea aria-label={t.form[3]} placeholder={t.form[3]} rows="2" required />
              <button type="submit">{t.send}</button>
              {submitted && <p className="form-message" role="status">Thank you — we will be in touch.</p>}
            </form>
          </div>
        </Container>
      </Section>
    </main>
    <footer className="site-footer"><Container><a className="wordmark" href="#top">GreenTomato</a><span>© {new Date().getFullYear()} Green Tomato</span></Container></footer>
  </>
}

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Container, Eyebrow, MediaFrame, Section, TextLink } from './design-system'
import artistProfilesSource from './data/artist-profiles.json'
import workVideoSources from './data/work-video-sources.json'

gsap.registerPlugin(ScrollTrigger)

// Vite supplies `/` locally and `/-1/` on GitHub Pages.
const assets = `${import.meta.env.BASE_URL}assets/`
// Work films are replaced in-place during production. Version their requests so
// GitHub Pages and the browser never combine stale byte ranges with a new MP4.
const workVideoRevision = '20260820b'
const vineScaleY = 1.035

function withWorkVideoSources(work) {
  if (!work.video) return work
  const assetMarker = 'assets/'
  const assetIndex = work.video.indexOf(assetMarker)
  const relativeSource = assetIndex >= 0 ? work.video.slice(assetIndex + assetMarker.length) : ''
  const relativeWeb = workVideoSources[relativeSource]
  return {
    ...work,
    videoHd: work.video,
    videoWeb: relativeWeb ? `${assets}${relativeWeb}` : work.video,
  }
}

const artists = [
  { number: '01', name: 'Amber', slug: 'amber', src: `${assets}artists/thumbs/amber.jpg`, position: '50% 26%', role: 'Digital Muse & Beauty Creator', roleZh: '音乐制作人／时尚艺术家', tags: ['Beauty', 'Fashion', 'Lifestyle'], tagsZh: ['音乐', '时尚', '生活方式'] },
  { number: '02', name: 'Ooona', slug: 'ooona', src: `${assets}artists/thumbs/ooona.jpg`, position: '50% 34%', role: 'Experimental Digital Artist KOL', roleZh: '美妆／身心健康艺术家', tags: ['Beauty', 'Art', 'Sport'], tagsZh: ['美妆', '健康', '运动'] },
  { number: '03', name: 'Maya', slug: 'maya', src: `${assets}artists/thumbs/maya.jpg`, position: '50% 34%', role: 'Digital Artist & Cultural Muse', roleZh: '奢华时尚艺术家', tags: ['Fashion', 'Art', 'Lifestyle'], tagsZh: ['时尚', '艺术', '生活方式'] },
  { number: '04', name: 'Noah', slug: 'noah', src: `${assets}artists/thumbs/noah.jpg`, position: '54% 20%', role: 'Virtual Artist & Visual Storyteller', roleZh: '影像／时尚艺术家', tags: ['Film', 'Music', 'Lifestyle'], tagsZh: ['影像', '时尚', '旅行'] },
  { number: '05', name: 'Mario', slug: 'mario', src: `${assets}artists/thumbs/mario.jpg`, position: '45% 24%', role: 'Virtual Creator & Urban Storyteller', roleZh: '生活方式创作者／摄影师', tags: ['Streetwear', 'Travel', 'Culture'], tagsZh: ['街头文化', '旅行', '摄影'] },
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
    eyebrow: '数字艺人档案', title: '认识全部数字艺人', intro: '面向品牌、内容与文化领域的数字人才阵容。',
    growing: '即将上线', archive: '数字艺人档案', all: '全部', reset: '重置筛选',
    gender: '性别', language: '语言', type: '类型', city: '城市', results: '位艺术家',
    profile: '查看人物档案', comingSoon: '人物档案即将上线', featuredIn: '出演 · MGM', confirmed: '已确认资料',
    location: '常驻地区', languages: '使用语言', talents: '创作能力', back: '返回数字艺人列表',
  },
}
directoryLabels['zh-Hant'] = { ...directoryLabels.zh, eyebrow: '藝術家檔案', title: '遇見所有藝術家', intro: '正在成長的全新現實。', archive: '藝術家檔案', reset: '重設篩選', gender: '性別', language: '語言', city: '城市', profile: '查看檔案', comingSoon: '檔案正在成長', featuredIn: '出演 · MGM', confirmed: '已確認資料', location: '城市', languages: '語言', talents: '創作類型', back: '返回藝術家列表' }

const works = [
  { name: 'The Peninsula', slug: 'the-peninsula', category: 'Brand film', categoryZh: '品牌影片', video: `${assets}work/the-peninsula.mp4`, poster: `${assets}work/the-peninsula-cover.jpg`, position: '50% 38%', portrait: true },
  { name: 'ChillGOOD_TV', slug: 'childgood', category: 'Campaign film', categoryZh: 'Campaign 影片', video: `${assets}work/chillgood-takoyaki.mp4`, poster: `${assets}work/chillgood-cover.jpg`, position: '50% 50%' },
  { name: 'Octopus', slug: 'octopus', category: 'Culture film', categoryZh: '文化内容影片', video: `${assets}work/octopus.mp4`, poster: `${assets}work/octopus-cover.jpg`, position: '50% 50%' },
  { name: 'MGM', slug: 'mgm', category: 'Brand world', categoryZh: '品牌视觉世界', video: `${assets}work/mgm-macau.mp4`, poster: `${assets}work/mgm-cover.jpg`, position: '50% 50%' },
].map(withWorkVideoSources)

// Work pages use the approved current-project delivery package. Homepage media stays separate.
const workProjects = [
  { brand: 'airwallex', name: 'airwallex', slug: 'airwallex', category: 'Brand World', video: `${assets}work/projects/airwallex.mp4`, poster: `${assets}work/projects/airwallex.jpg` },
  { brand: 'Cathy', name: 'HKmovie', slug: 'cathy-hkmovie', category: 'Brand World', video: `${assets}work/projects/cathy-hkmovie.mp4`, poster: `${assets}work/projects/cathy-hkmovie.jpg` },
  { brand: 'AIVP', name: 'Crew', slug: 'aivp-crew', category: 'Crew', format: 'crew', video: `${assets}work/projects/aivp-crew.mp4`, poster: `${assets}work/projects/aivp-crew.jpg` },
  { brand: 'ChunWo-Dreamgirl', name: 'Dreamgirl 01', slug: 'chunwo-dreamgirl-01', category: 'Photography', poster: `${assets}work/projects/dream-girl-01.jpg`, photo: true },
  { brand: 'ChunWo-Dreamgirl', name: 'Dreamgirl 02', slug: 'chunwo-dreamgirl-02', category: 'Photography', poster: `${assets}work/projects/dream-girl-02.jpg`, photo: true },
  { brand: 'ChunWo-Dreamgirl', name: 'Dreamgirl 03', slug: 'chunwo-dreamgirl-03', category: 'Brand World', video: `${assets}work/projects/chunwo-dreamgirl-03.mp4`, poster: `${assets}work/projects/chunwo-dreamgirl-03.jpg`, portrait: true },
  { brand: 'Macau MGM', name: 'Grill58', slug: 'mgm-grill58', category: 'Brand World', video: `${assets}work/projects/mgm-grill58.mp4`, poster: `${assets}work/projects/mgm-grill58.jpg` },
  { brand: 'Chow Sang Sang', name: 'CSS Noir', slug: 'chow-sang-sang', category: 'Brand World', video: `${assets}work/projects/chow-sang-sang.mp4`, poster: `${assets}work/projects/chow-sang-sang.jpg`, portrait: true },
  { brand: 'Macau MGM', name: 'MGM Spa', slug: 'mgm-film-01', category: 'Hospitality', video: `${assets}work/projects/mgm-film-01.mp4`, poster: `${assets}work/projects/mgm-film-01.jpg`, artistIds: ['bailey'] },
  { brand: 'Macau MGM', name: 'MGM Film 02', slug: 'mgm-film-02', category: 'Hospitality', video: `${assets}work/projects/mgm-film-02.mp4`, poster: `${assets}work/projects/mgm-film-02.jpg`, artistIds: ['bailey'] },
  { brand: 'Macau MGM', name: 'MGM Pool', slug: 'mgm-film-03', category: 'Hospitality', video: `${assets}work/projects/mgm-film-03.mp4`, poster: `${assets}work/projects/mgm-film-03.jpg`, artistIds: ['connor', 'bailey'] },
  { brand: 'The Peninsula', name: 'The Peninsula Hong Kong', slug: 'peninsula-fathers-day', category: 'Hospitality', video: `${assets}work/projects/peninsula-fathers-day.mp4`, poster: `${assets}work/projects/peninsula-fathers-day.jpg`, portrait: true },
  { brand: 'PARKnSHOP', name: 'Weekly Offer', slug: 'parknshop-weekly-offer', category: 'Retail', video: `${assets}work/projects/parknshop-weekly-offer.mp4`, poster: `${assets}work/projects/parknshop-weekly-offer.jpg` },
  { brand: 'Octopus', name: 'Octopus Film', slug: 'octopus-film', category: 'Retail / Urban Lifestyle', video: `${assets}work/projects/octopus-film.mp4`, poster: `${assets}work/projects/octopus-film.jpg` },
  { brand: 'ChillGOOD_TV', name: '章魚燒 Takoyaki', slug: 'chillgood-takoyaki', category: 'Music Video', video: `${assets}work/projects/chillgood-takoyaki.mp4`, poster: `${assets}work/projects/chillgood-takoyaki.jpg` },
  { brand: 'ChillGOOD_TV', name: '波斯', slug: 'chillgood-animation', category: 'Music Video', video: `${assets}work/projects/chillgood-animation.mp4`, poster: `${assets}work/projects/chillgood-animation.jpg`, artistIds: ['amber'] },
  { brand: 'The Peninsula', name: 'The Peninsula Hong Kong', slug: 'peninsula-whisky-still', category: 'Photography', poster: `${assets}work/projects/peninsula-whisky-still.jpg`, photo: true },
  { brand: 'GRAMS', name: 'Color', slug: 'grams-color', category: 'Fashion & Lifestyle', video: `${assets}work/projects/grams-color.mp4`, poster: `${assets}work/projects/grams-color.jpg` },
  { brand: 'GRAMS', name: 'Black & White', slug: 'grams-bw', category: 'Fashion & Lifestyle', video: `${assets}work/projects/grams-bw.mp4`, poster: `${assets}work/projects/grams-bw.jpg` },
  { brand: 'KOISEA', name: 'Landscape Cut', slug: 'koisea-landscape', category: 'Fashion & Lifestyle', video: `${assets}work/projects/koisea-landscape.mp4`, poster: `${assets}work/projects/koisea-landscape.png` },
  { brand: 'KOISEA', name: 'Underground Cut', slug: 'koisea-underground', category: 'Fashion & Lifestyle', video: `${assets}work/projects/koisea-underground.mp4`, poster: `${assets}work/projects/koisea-underground.jpg` },
  { brand: 'Maya Kim', name: 'Vlog', slug: 'maya-kim-vlog', category: 'Narrative Frames', format: 'drama', video: `${assets}work/projects/maya-kim-vlog.mp4`, poster: `${assets}work/projects/maya-kim-vlog.jpg` },
].map(withWorkVideoSources)

const copy = {
  en: {
    nav: ['About', 'Artists', 'Work', 'Brands', 'Services', 'Contact'], price: 'Price',
    heroKicker: 'A home for new realities',
    heroBody: 'We build identities, images and worlds for culture-shaping brands.',
    aboutTitle: <>Human taste.<br />Machine possibility.</>,
    aboutBody: 'We represent next-generation artists, fusing art and code, imagination with human point of view.',
    artistsTitle: <>Artists shaping<br />new realities.</>,
    artistsBody: 'Directors, designers and technologists who turn ambitious ideas into work that moves culture.',
    workTitle: <>Selected work,<br />made to move.</>,
    workBody: 'From short films to brand worlds, we create stories that resonate and endure.',
    brandsTitle: <>Built with brands.<br />Made for culture.</>,
    brands: ['Macau MGM', 'The Peninsula Hong Kong', 'PARKnSHOP', 'Octopus', 'ChillGOOD_TV', 'GRAMS', 'KOISEA'],
    worldTitle: <>We build the<br />whole world.</>,
    worldItems: ['AI talent casting', 'Character consulting', 'Content production', 'Campaign collaboration'],
    contactTitle: <>Tell us<br />your story</>,
    form: ['Name', 'Email', 'Project / budget', 'Tell us more'],
    send: 'Send message',
    sending: 'Sending…',
    sent: 'Thank you — your message has been sent.',
    sendError: 'Something went wrong. Please try again or email us directly.',
    menu: 'Menu',
    est: 'Est. Hong Kong', scroll: 'Scroll to grow', aboutEyebrow: 'About us', artistsEyebrow: 'Artists', workEyebrow: 'Work', brandsEyebrow: 'Brands & services', contactEyebrow: 'Contact',
    allArtists: 'View all artists', allWork: 'View all work', profile: 'View profile', playCase: 'Play case', selectedWork: 'Selected work', madeToMove: <>Made<br />to move.</>,
    workFormats: 'Work formats', openWork: 'Open work', moreWork: 'More stories are in development.', skip: 'Skip to content', home: 'Green Tomato home', navigation: 'Main navigation', language: 'Language',
    workIntro: {
      title: <>Unleash Your<br /><b>Creativity.</b></>,
      lead: 'From a first instinct to a final frame, we help ideas find their wildest form.',
      context: 'AI filmmaking, shaped by human taste. New tools meet two decades of strategy and production experience—so every world feels unmistakably yours.',
      valuesTitle: 'Why it works.',
      valuesLead: 'The work opens up when the process does.',
      values: [
        ['Move from instinct to image—fast.', 'Get a tangible direction on screen while the energy of the first idea is still alive.'],
        ['Try more routes before choosing one.', 'Visual exploration lets us test mood, rhythm and possibility before committing the whole production.'],
        ['Keep the process open while the idea grows.', 'A flexible production rhythm makes room for the unexpected, without losing the thread.'],
      ],
      formatsTitle: 'What we make.',
      formats: ['AI films & photography', 'Commercials', 'TVCs', 'Social reels', 'Music videos', 'Narrative drama'],
      processTitle: 'How an idea takes shape.',
      processLead: 'A film finds its form in conversation, not in a straight line.',
      process: [
        ['We begin with the feeling behind the brief.', 'Together, we find the tension, audience and point of view that make the story worth telling.'],
        ['Then we turn it into a world you can already see.', 'Storyboards and visual studies make a shared instinct tangible before production begins.'],
        ['We build the picture around that feeling.', 'Image, performance and motion are created with the freedom to discover something better along the way.'],
        ['We make, test, cut and reshape.', 'Editing, sound and visual integration bring every element into the same emotional register.'],
        ['Nothing is finished until it feels unmistakably yours.', 'We refine with focused feedback, prepare every final format and sign off together.'],
      ],
      scopeTitle: 'How we work together.',
      scopeLead: 'A shared rhythm from the first conversation to the final sign-off—clear enough to keep moving, open enough for the idea to get better along the way.',
      scope: [
        ['Pre-production meetings & research', 'We align the brief, audience, ambition and references before a frame is made.'],
        ['Storyboards, feedback & revisions', 'Early visual thinking gives everyone something real to react to and refine.'],
        ['Video production, feedback & revisions', 'We build the world, share progress and shape the work while it is still alive.'],
        ['Post-production, feedback & revisions', 'Edit, sound, motion and finishing bring the full story into focus.'],
        ['Final review & sign-off', 'We lock the master, prepare every required format and hand over with confidence.'],
      ],
    },
  },
  zh: {
    nav: ['关于我们', '数字艺人', '案例作品', '合作品牌', '服务能力', '联系我们'], price: '价格',
    heroKicker: '数字艺人与 AI 品牌内容创意工作室',
    heroBody: '我们为品牌打造数字艺人、内容作品与 AI 创意企划，建立面向新一代受众的品牌表达。',
    aboutTitle: <>人的创意，<br />AI 驱动的制作能力。</>,
    aboutBody: '我们整合创意策划、数字艺人与 AI 制作能力，为品牌打造具有辨识度的内容、企划与视觉世界。',
    artistsTitle: <>面向新一代的<br />数字艺人。</>,
    artistsBody: '我们持续打造具备鲜明人设与内容能力的数字艺人，支持品牌内容、创意企划与长期合作。',
    workTitle: <>精选案例，<br />以结果为导向。</>,
    workBody: '从品牌影片、Campaign 视觉到数字人内容，我们以品牌目标为核心，打造能够吸引注意并推动传播的作品。',
    brandsTitle: <>与品牌共创，<br />让内容产生影响。</>,
    brands: ['Macau MGM', 'The Peninsula Hong Kong', 'PARKnSHOP', 'Octopus', 'ChillGOOD_TV', 'GRAMS', 'KOISEA'],
    worldTitle: <>从创意策略，<br />到完整交付。</>,
    worldItems: ['AI 影片制作', '数字人物打造', '品牌企划与社交内容', '定制 AI 体验'],
    contactTitle: <>一起打造<br />下一个品牌项目。</>,
    form: ['姓名', '电子邮箱', '项目类型 / 预算', '项目需求'],
    send: '提交合作需求',
    sending: '正在提交…',
    sent: '感谢联系，我们将尽快回复。',
    sendError: '提交失败，请重试或直接通过电子邮件联系我们。',
    menu: '菜单',
    est: '创立于香港', scroll: '向下探索', aboutEyebrow: '关于我们', artistsEyebrow: '数字艺人', workEyebrow: '案例作品', brandsEyebrow: '合作品牌与服务能力', contactEyebrow: '联系我们',
    allArtists: '认识全部数字艺人', allWork: '查看全部案例', profile: '查看人物档案', playCase: '播放影片', selectedWork: '精选案例', madeToMove: <>以结果<br />为导向。</>,
    workFormats: '案例分类', openWork: '查看项目', moreWork: '更多项目正在制作中。', skip: '跳至主要内容', home: 'Green Tomato 首页', navigation: '主导航', language: '语言',
    workIntro: {
      title: <>释放你的<br /><b>创意。</b></>,
      lead: '从最初的直觉到最后一帧，我们让想法长成它最有生命力的样子。',
      context: 'AI 影像制作，由人的审美判断掌舵。新工具结合逾 20 年的策略与制作经验，让每一个视觉世界都真正属于你的品牌。',
      valuesTitle: '为什么这样做。',
      valuesLead: '当流程保持开放，创意才有更多可能。',
      values: [
        ['更快把直觉变成画面。', '让最初的创意能量还未消退时，方向就已经具象地出现在眼前。'],
        ['在决定前，多走几条路。', '通过视觉探索测试情绪、节奏与可能性，再决定真正要投入的方向。'],
        ['让想法在过程中继续生长。', '灵活的制作节奏为意外和新发现留出空间，同时不丢失核心线索。'],
      ],
      formatsTitle: '我们制作什么。',
      formats: ['AI 影片与摄影', '商业广告', 'TVC', '社交短片', '音乐影像', '叙事作品'],
      processTitle: '一个想法如何成形。',
      processLead: '一支影片的成形，来自对话，而不是一条直线。',
      process: [
        ['我们从 brief 背后的感受开始。', '一起找到故事的张力、受众与观点，让创意拥有值得被讲述的理由。'],
        ['再把它变成看得见的世界。', '分镜和视觉实验让团队在制作开始前，就能对共同的直觉作出判断。'],
        ['围绕这个感受建立画面。', '影像、角色与动势在制作中被创造出来，也始终保留发现更好可能的自由。'],
        ['不断剪辑、测试与重塑。', '剪辑、声音与视觉整合让每一个元素都落在同一种情绪里。'],
        ['直到它真正属于你的品牌。', '集中反馈、完成最终版本、适配每种格式，然后一起签核。'],
      ],
      scopeTitle: '我们如何一起工作。',
      scopeLead: '从第一次对话到最后签核，我们保持同一节奏：足够清晰地持续推进，也为想法在过程中变得更好留出空间。',
      scope: [
        ['前期会议与资料研究', '在制作开始前，对齐 brief、受众、目标与视觉参考。'],
        ['分镜设计、反馈与修订', '尽早把视觉方向变成具体画面，让每个人都能参与判断与优化。'],
        ['视频制作、反馈与修订', '建立影像世界、分享制作进度，在作品仍在生长时及时调整。'],
        ['后期制作、反馈与修订', '通过剪辑、声音、动效与精修，让故事的每一部分回到同一焦点。'],
        ['最终审核与签核', '确认最终母版、准备所有交付格式，然后安心上线。'],
      ],
    },
  },
}

const navTargets = ['about', 'artists', 'work', 'brands', 'services', 'contact']
const navHrefs = ['#about', '#/artists', '#/work', '#brands', '#services', '#contact']
const languageOptions = [
  ['en', 'EN', 'English'],
  ['zh-Hant', '繁', '繁體中文'],
  ['zh', '简', '简体中文'],
]

copy['zh-Hant'] = { ...copy.zh,
  nav: ['關於', '藝術家', '作品', '品牌', '服務', '聯絡'], price: '價格', menu: '選單', heroKicker: '新現實的創作之家', heroBody: '我們為塑造文化的品牌，構築身份、影像與世界。',
  aboutTitle: <>人的感知。<br />機器的可能。</>, aboutBody: '我們代表新一代創作者，將藝術與程式、想像與人的視角融合在一起。', artistsTitle: <>塑造全新現實的<br />創作者。</>, artistsBody: '導演、設計師與技術創作者，將大膽想法化為推動文化的作品。',
  workTitle: <>精選作品，<br />為觸動而生。</>, workBody: '從短片到品牌世界，我們創作能被感受並留下餘韻的故事。', brandsTitle: <>與品牌同行。<br />為文化而作。</>, worldTitle: <>我們構築<br />完整的世界。</>, worldItems: ['AI 人才選角', '角色創意顧問', '內容製作', '活動共創'], contactTitle: <>告訴我們<br />你的故事</>, form: ['姓名', '電郵', '專案 / 預算', '還有什麼想說'], send: '傳送訊息', sending: '傳送中…', sent: '謝謝，你的訊息已經送出。', sendError: '傳送失敗，請重試或直接寄信給我們。',
  est: '創立於香港', scroll: '向下捲動，繼續成長', aboutEyebrow: '關於我們', artistsEyebrow: '藝術家', workEyebrow: '作品', brandsEyebrow: '品牌與服務', contactEyebrow: '聯絡', allArtists: '查看所有藝術家', allWork: '查看全部作品', profile: '查看檔案', playCase: '播放案例', selectedWork: '精選作品', madeToMove: <>為流動<br />而作。</>, workFormats: '作品分類', openWork: '打開作品', moreWork: '更多作品正在製作中。', skip: '跳至主要內容', home: 'Green Tomato 首頁', navigation: '主導覽', language: '語言',
  workIntro: {
    title: <>釋放你的<br /><b>創意。</b></>,
    lead: '從最初的直覺到最後一幀，我們讓想法長成它最有生命力的樣子。',
    context: 'AI 影像製作，由人的美感判斷掌舵。新工具結合逾 20 年的策略與製作經驗，讓每一個視覺世界都真正屬於你的品牌。',
    valuesTitle: '為什麼這樣做。',
    valuesLead: '當流程保持開放，創意才有更多可能。',
    values: [
      ['更快把直覺變成畫面。', '讓最初的創意能量還未消退時，方向就已經具象地出現在眼前。'],
      ['在決定前，多走幾條路。', '透過視覺探索測試情緒、節奏與可能性，再決定真正要投入的方向。'],
      ['讓想法在過程中繼續生長。', '靈活的製作節奏為意外和新發現留出空間，同時不丟失核心線索。'],
    ],
    formatsTitle: '我們製作什麼。',
    formats: ['AI 影片與攝影', '商業廣告', 'TVC', '社交短片', '音樂影像', '敘事作品'],
    processTitle: '一個想法如何成形。',
    processLead: '一支影片的成形，來自對話，而不是一條直線。',
    process: [
      ['我們從 brief 背後的感受開始。', '一起找到故事的張力、受眾與觀點，讓創意擁有值得被講述的理由。'],
      ['再把它變成看得見的世界。', '分鏡和視覺實驗讓團隊在製作開始前，就能對共同的直覺作出判斷。'],
      ['圍繞這個感受建立畫面。', '影像、角色與動勢在製作中被創造出來，也始終保留發現更好可能的自由。'],
      ['不斷剪輯、測試與重塑。', '剪輯、聲音與視覺整合讓每一個元素都落在同一種情緒裡。'],
      ['直到它真正屬於你的品牌。', '集中回饋、完成最終版本、適配每種格式，然後一起簽核。'],
    ],
    scopeTitle: '我們如何一起工作。',
    scopeLead: '從第一次對話到最後簽核，我們保持同一節奏：足夠清晰地持續推進，也為想法在過程中變得更好留出空間。',
    scope: [
      ['前期會議與資料研究', '在製作開始前，對齊 brief、受眾、目標與視覺參考。'],
      ['分鏡設計、回饋與修訂', '盡早把視覺方向變成具體畫面，讓每個人都能參與判斷與優化。'],
      ['影片製作、回饋與修訂', '建立影像世界、分享製作進度，在作品仍在生長時及時調整。'],
      ['後期製作、回饋與修訂', '透過剪輯、聲音、動效與精修，讓故事的每一部分回到同一焦點。'],
      ['最終審核與簽核', '確認最終母版、準備所有交付格式，然後安心上線。'],
    ],
  },
}

function getRoute() {
  const value = window.location.hash.replace(/^#/, '')
  const [path, query = ''] = value.split('?')
  const parts = path.split('/').filter(Boolean)
  const params = new URLSearchParams(query)
  if (parts[0] === 'artists') return { type: parts[1] ? 'artist-detail' : 'artists', slug: parts[1], focus: params.get('focus') }
  if (parts[0] === 'work') return { type: parts[1] ? 'work-detail' : 'work', slug: parts[1], open: params.get('open'), format: params.get('format') }
  if (parts[0] === 'price') return { type: 'price' }
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
  const [anchorsReady, setAnchorsReady] = useState(false)
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
    if (window.innerWidth <= 760) {
      setAnchorsReady(true)
      return
    }
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
    setAnchorsReady(true)
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

  return <div ref={storyRef} className={`botanical-story ${anchorsReady ? 'is-ready' : ''}`} aria-hidden="true">
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
      <a className="brand-signature" href="#/" aria-label={t.home}><img src={`${assets}brand/green-tomato-logo-green.png`} alt="GreenTomato" /></a>
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label={t.navigation}>
        {t.nav.slice(0, -1).map((item, index) => <a key={navTargets[index]} href={navHrefs[index]} onClick={() => setMenuOpen(false)}>{item}</a>)}
        <a className="price-link" href="#/price" onClick={() => setMenuOpen(false)}>{t.price}</a>
        {t.nav.slice(-1).map((item, index) => {
          const navIndex = t.nav.length - 1 + index
          return <a key={navTargets[navIndex]} href={navHrefs[navIndex]} onClick={() => setMenuOpen(false)}>{item}</a>
        })}
      </nav>
      <div className="header-actions">
        <div className="language-switcher" role="group" aria-label={t.language}>
          {languageOptions.map(([value, label, accessibleLabel]) => <button key={value} className={language === value ? 'is-active' : ''} type="button" onClick={() => { setLanguage(value); setMenuOpen(false) }} aria-pressed={language === value} aria-label={accessibleLabel}>{label}</button>)}
        </div>
      </div>
    </Container>
  </header>
}

function ArtistCard({ artist, onOpen, total, t }) {
  const isChinese = t.language !== 'Language'
  return <button className={`artist-tile artist-tile--${artist.slug}`} type="button" onClick={() => onOpen(`#/artists/${artist.slug}`)} aria-label={`${t.profile}: ${artist.name}`}>
    <img src={artist.src} alt={`Portrait of ${artist.name}`} style={{ objectPosition: artist.position }} loading="lazy" decoding="async" />
    <span className="artist-scrim" aria-hidden="true" />
    <span className="artist-number" aria-hidden="true">{artist.number} / {String(total).padStart(2, '0')}</span>
    <span className="artist-info"><strong>{artist.name}</strong><span className="artist-role">{isChinese ? artist.roleZh : artist.role}</span><span className="artist-tags">{(isChinese ? artist.tagsZh : artist.tags).join(' · ')}</span></span>
    <span className="artist-profile">{t.profile} <b aria-hidden="true">→</b></span>
  </button>
}

function WorkCard({ work, onPlay, t }) {
  const [muted, setMuted] = useState(false)
  const isChinese = t.language !== 'Language'

  const toggleMuted = (event) => {
    event.stopPropagation()
    setMuted((current) => !current)
  }

  return <article className={`work-card work-card--${work.slug}`} onPointerEnter={() => prewarmWorkVideo(work)} onPointerDown={() => prewarmWorkVideo(work)}>
    <img className="work-video" src={work.poster} alt="" style={{ objectPosition: work.position }} loading="lazy" decoding="async" />
    <span className="work-name">{work.name}</span><span className="work-category">{isChinese ? work.categoryZh : work.category}</span><span className="work-case">{t.playCase} →</span>
    <div className="work-controls" aria-label={`${work.name} video controls`}>
      <button className="work-control work-control--play" type="button" onClick={() => onPlay(work, muted)} aria-label={`Play ${work.name}`}>▶</button>
      <span className="work-progress" aria-hidden="true" />
      <button className="work-control" type="button" onClick={toggleMuted} aria-label={muted ? 'Play video with sound' : 'Play video muted'}>{muted ? '🔇' : '🔊'}</button>
    </div>
  </article>
}

let warmedWorkVideo = null

function prewarmWorkVideo(work) {
  if (!work?.videoWeb || work.photo || typeof document === 'undefined') return
  if (warmedWorkVideo?.dataset.src === work.videoWeb) return
  if (warmedWorkVideo) {
    warmedWorkVideo.pause()
    warmedWorkVideo.removeAttribute('src')
    warmedWorkVideo.load()
  }
  const video = document.createElement('video')
  video.dataset.src = work.videoWeb
  video.preload = 'auto'
  video.muted = true
  video.playsInline = true
  video.src = work.videoWeb
  video.load()
  warmedWorkVideo = video
}

function waitForVideo(video, eventName, ready, timeout = 15000) {
  if (ready(video)) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => finish(new Error(`Timed out waiting for ${eventName}`)), timeout)
    const onReady = () => finish()
    const onError = () => finish(new Error('Video failed to load'))
    const finish = (error) => {
      window.clearTimeout(timer)
      video.removeEventListener(eventName, onReady)
      video.removeEventListener('error', onError)
      if (error) reject(error)
      else resolve()
    }
    video.addEventListener(eventName, onReady, { once: true })
    video.addEventListener('error', onError, { once: true })
  })
}

function WorkPlayerModal({ work, initialMuted = false, onClose, language, playerRef }) {
  const fallbackVideoRef = useRef(null)
  const webVideoRef = playerRef || fallbackVideoRef
  const hdVideoRef = useRef(null)
  const qualityRef = useRef('web')
  const mutedRef = useRef(initialMuted)
  const isPhoto = Boolean(work.photo)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(initialMuted)
  const [progress, setProgress] = useState(0)
  const [quality, setQuality] = useState('web')
  const [hdRequested, setHdRequested] = useState(false)
  const [hdUserRequested, setHdUserRequested] = useState(false)
  const [hdPreparing, setHdPreparing] = useState(false)
  const webVideoSrc = isPhoto ? null : work.videoWeb || work.video
  const hdVideoSrc = isPhoto ? null : `${work.videoHd || work.video}?v=${workVideoRevision}`
  const hasSeparateHd = Boolean(!isPhoto && work.videoHd && work.videoWeb && work.videoHd !== work.videoWeb)

  const activeVideo = () => qualityRef.current === 'hd' ? hdVideoRef.current : webVideoRef.current

  useEffect(() => {
    const video = webVideoRef.current
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    if (!isPhoto && video) {
      video.defaultMuted = initialMuted
      video.muted = initialMuted
      video.play().catch(() => setPlaying(false))
    }
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      video?.pause()
      hdVideoRef.current?.pause()
    }
  }, [initialMuted, isPhoto, onClose])

  useEffect(() => {
    if (!hdUserRequested || !hdRequested || !hasSeparateHd) return undefined
    let cancelled = false
    const handoff = async () => {
      const webVideo = webVideoRef.current
      const hdVideo = hdVideoRef.current
      if (!webVideo || !hdVideo) return
      try {
        hdVideo.muted = true
        hdVideo.volume = webVideo.volume
        hdVideo.playbackRate = webVideo.playbackRate
        await waitForVideo(hdVideo, 'loadedmetadata', (video) => video.readyState >= HTMLMediaElement.HAVE_METADATA)
        hdVideo.currentTime = Math.min(webVideo.currentTime, Math.max(0, hdVideo.duration - .05))
        await waitForVideo(hdVideo, 'canplay', (video) => video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA)
        if (Math.abs(hdVideo.currentTime - webVideo.currentTime) > .35) {
          hdVideo.currentTime = Math.min(webVideo.currentTime, Math.max(0, hdVideo.duration - .05))
          await waitForVideo(hdVideo, 'canplay', (video) => video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA)
        }
        await hdVideo.play()
        if (cancelled) { hdVideo.pause(); return }
        if (Math.abs(hdVideo.currentTime - webVideo.currentTime) > .5) hdVideo.currentTime = webVideo.currentTime
        qualityRef.current = 'hd'
        setQuality('hd')
        requestAnimationFrame(() => {
          if (cancelled) return
          hdVideo.muted = mutedRef.current
          webVideo.pause()
          setHdPreparing(false)
          setPlaying(!hdVideo.paused)
        })
      } catch {
        if (!cancelled) {
          setHdPreparing(false)
          setHdUserRequested(false)
        }
      }
    }
    handoff()
    return () => { cancelled = true }
  }, [hasSeparateHd, hdRequested, hdUserRequested])

  const prepareHd = (userRequested = false) => {
    if (!hasSeparateHd || qualityRef.current === 'hd') return
    if (userRequested) {
      setHdPreparing(true)
      setHdUserRequested(true)
    }
    setHdRequested(true)
  }

  const onWebPlaying = () => {
    if (qualityRef.current !== 'web') return
    setPlaying(true)
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    const slowConnection = connection?.saveData || ['slow-2g', '2g', '3g'].includes(connection?.effectiveType)
    if (hasSeparateHd && !slowConnection) window.setTimeout(() => prepareHd(false), 2200)
  }

  const togglePlayback = () => {
    const video = activeVideo()
    if (!video) return
    if (video.paused) {
      if (video.networkState === HTMLMediaElement.NETWORK_EMPTY) video.load()
      video.play().catch(() => setPlaying(false))
    }
    else video.pause()
  }
  const toggleMuted = () => {
    const nextMuted = !muted
    setMuted(nextMuted)
    mutedRef.current = nextMuted
    if (webVideoRef.current) webVideoRef.current.muted = nextMuted
    if (hdVideoRef.current && qualityRef.current === 'hd') hdVideoRef.current.muted = nextMuted
  }
  const seek = (event) => {
    const video = activeVideo()
    if (!video?.duration) return
    video.currentTime = Number(event.target.value) * video.duration
  }
  const closeFromBackdrop = (event) => { if (event.target === event.currentTarget) onClose() }

  return <div className={`work-player-modal ${isPhoto ? 'work-player-modal--photo' : work.portrait ? 'work-player-modal--portrait' : ''}`} role="dialog" aria-modal="true" aria-label={`${work.name} ${isPhoto ? 'image' : 'video'} player`} onMouseDown={closeFromBackdrop}>
    <div className="work-player-dialog" onMouseDown={(event) => event.stopPropagation()}>
      {isPhoto ? <img className="work-player-video" src={work.poster} alt={`${work.brand} — ${work.name}`} /> : <div className="work-player-media">
        <video ref={webVideoRef} className={`work-player-video ${quality === 'web' ? 'is-active' : ''}`} src={webVideoSrc} poster={work.poster} preload="auto" autoPlay playsInline muted={muted} style={{ objectPosition: work.position }} onPlaying={onWebPlaying} onPause={() => { if (qualityRef.current === 'web') setPlaying(false) }} onEnded={() => { if (qualityRef.current === 'web') { setPlaying(false); setProgress(0) } }} onError={() => setPlaying(false)} onTimeUpdate={(event) => { if (qualityRef.current === 'web') setProgress(event.currentTarget.duration ? event.currentTarget.currentTime / event.currentTarget.duration : 0) }} />
        <video ref={hdVideoRef} className={`work-player-video work-player-video--hd ${quality === 'hd' ? 'is-active' : ''}`} src={hdRequested ? hdVideoSrc : undefined} preload={hdRequested ? 'auto' : 'none'} playsInline muted={quality === 'hd' ? muted : true} style={{ objectPosition: work.position }} onPlaying={() => { if (qualityRef.current === 'hd') setPlaying(true) }} onPause={() => { if (qualityRef.current === 'hd') setPlaying(false) }} onEnded={() => { if (qualityRef.current === 'hd') { setPlaying(false); setProgress(0) } }} onTimeUpdate={(event) => { if (qualityRef.current === 'hd') setProgress(event.currentTarget.duration ? event.currentTarget.currentTime / event.currentTarget.duration : 0) }} />
      </div>}
      <div className="work-player-meta"><strong>{work.name}</strong><span>{work.category}</span></div>
      {work.artistIds?.length > 0 && <div className="work-player-cast"><span>{language === 'en' ? 'Featured artists' : language === 'zh-Hant' ? '出演藝術家' : '出演艺人'}</span><div>{work.artistIds.map((id) => { const artist = directoryArtists.find((item) => item.id === id); if (!artist) return null; return <a key={id} href={`#/artists?focus=${id}`} onClick={onClose}><img src={artist.src} alt="" /><strong>{artist.display_name}</strong></a> })}</div></div>}
      {!isPhoto && <div className="work-player-controls">
        <button className="work-control work-control--play" type="button" onClick={togglePlayback} aria-label={playing ? 'Pause video' : 'Play video'}>{playing ? 'Ⅱ' : '▶'}</button>
        <input className="work-progress" type="range" min="0" max="1" step="0.001" value={progress} onChange={seek} aria-label="Video progress" />
        <button className="work-control" type="button" onClick={toggleMuted} aria-label={muted ? 'Unmute video' : 'Mute video'}>{muted ? '🔇' : '🔊'}</button>
        {hasSeparateHd && <button className={`work-control work-control--quality ${quality === 'hd' ? 'is-active' : ''}`} type="button" onClick={() => prepareHd(true)} aria-label="Play HD video" aria-pressed={quality === 'hd'} aria-busy={hdPreparing}>HD</button>}
      </div>}
      <button className="work-player-close" type="button" onClick={onClose} aria-label="Close video">×</button>
    </div>
  </div>
}

function HomePage({ t, onNavigate }) {
  const homeRef = useHomeNarrative(true)
  const [formStatus, setFormStatus] = useState('idle')
  const [activeWork, setActiveWork] = useState(null)
  const [workStartsMuted, setWorkStartsMuted] = useState(false)
  const onSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    setFormStatus('sending')
    const formData = new FormData(form)
    formData.append('_subject', 'New GreenTomato contact enquiry')
    formData.append('_template', 'table')
    try {
      const response = await fetch('https://formsubmit.co/ajax/babysharkdoludodo@gmail.com', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })
      if (!response.ok) throw new Error('Form delivery failed')
      form.reset()
      setFormStatus('success')
    } catch {
      setFormStatus('error')
    }
  }
  const openWork = (work, muted) => { setWorkStartsMuted(muted); setActiveWork(work) }
  const closeWork = useCallback(() => setActiveWork(null), [])
  return <>
  <main id="main" className="home-main" ref={homeRef}>
    <BotanicalStory />
    <Section id="top" tone="dark" className="hero">
      <Container className="hero-grid">
        <Eyebrow number="01">{t.heroKicker}</Eyebrow><h1><span>Green</span><span className="outline">Tomato</span></h1><p className="hero-copy">{t.heroBody}</p><p className="hero-credit">{t.est}</p><p className="scroll-note">{t.scroll}</p>
      </Container>
    </Section>
    <Section id="about" tone="light" className="about-section"><Container className="split-layout"><div className="section-copy"><Eyebrow number="02">{t.aboutEyebrow}</Eyebrow><h2>{t.aboutTitle}</h2><p>{t.aboutBody}</p></div></Container></Section>
    <Section id="artists" tone="dark" className="artists-section"><Container className="artists-layout"><div className="section-copy"><Eyebrow number="03">{t.artistsEyebrow}</Eyebrow><h2>{t.artistsTitle}</h2><p>{t.artistsBody}</p><TextLink className="directory-link" href="#/artists">{t.allArtists}</TextLink></div><div className="artist-tiles" aria-label={t.artistsEyebrow}>{featuredArtists.map((artist) => <ArtistCard key={artist.slug} artist={artist} onOpen={onNavigate} total={artists.length} t={t} />)}</div></Container></Section>
    <Section id="work" tone="light" className="work-section"><Container className="work-layout"><div className="section-copy"><Eyebrow number="04">{t.workEyebrow}</Eyebrow><h2>{t.workTitle}</h2><p>{t.workBody}</p><TextLink href="#/work">{t.allWork}</TextLink></div><div className="work-grid" aria-label={t.selectedWork}>{works.map((work) => <WorkCard key={work.slug} work={work} onPlay={openWork} t={t} />)}</div></Container></Section>
    <Section id="brands" tone="dark" className="brands-section"><Container className="brands-layout"><div className="section-copy"><Eyebrow number="05">{t.brandsEyebrow}</Eyebrow><h2>{t.brandsTitle}</h2><ul className="brand-list">{t.brands.map((brand) => <li key={brand}>{brand}</li>)}</ul></div><div id="services" className="world-copy"><h2>{t.worldTitle}</h2><ul>{t.worldItems.map((item) => <li key={item}>{item}</li>)}</ul></div></Container></Section>
    <Section id="contact" tone="light" className="contact-section"><Container className="contact-layout"><div><Eyebrow number="06">{t.contactEyebrow}</Eyebrow><h2>{t.contactTitle}</h2><form className="contact-form" onSubmit={onSubmit} noValidate><input name="name" aria-label={t.form[0]} placeholder={t.form[0]} autoComplete="name" required /><input name="email" aria-label={t.form[1]} placeholder={t.form[1]} type="email" autoComplete="email" required /><input name="project_budget" aria-label={t.form[2]} placeholder={t.form[2]} /><textarea name="message" aria-label={t.form[3]} placeholder={t.form[3]} rows="2" required /><button type="submit" disabled={formStatus === 'sending'}>{formStatus === 'sending' ? t.sending : t.send}</button>{formStatus === 'success' && <p className="form-message" role="status">{t.sent}</p>}{formStatus === 'error' && <p className="form-message form-message--error" role="alert">{t.sendError}</p>}</form></div></Container></Section>
  </main>
  {activeWork && <WorkPlayerModal work={activeWork} initialMuted={workStartsMuted} onClose={closeWork} />}
  </>
}

function PageHeader({ eyebrow, title, back, backLabel = 'Back', className = '' }) {
  return <div className={`page-heading ${className}`.trim()}><a className="back-link" href={back}>← {backLabel}</a><Eyebrow>{eyebrow}</Eyebrow>{title && <h1>{title}</h1>}</div>
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

function DirectoryArtistCard({ artist, language, className = '', style, ...props }) {
  const labels = directoryLabels[language]
  const role = language === 'en' ? artist.role_en : artist.role_zh
  const profileHash = artist.profile_slug ? `#/artists/${artist.profile_slug}` : null
  const openProfile = (event) => { event.preventDefault(); window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); window.location.hash = profileHash }
  const cardContent = <><img src={artist.src} alt={`Portrait of ${artist.display_name}`} style={{ objectPosition: artist.position }} loading="lazy" decoding="async" /><span className="directory-card-scrim" aria-hidden="true" /><span className="directory-card-number">{artist.number} / 07</span><span className="directory-card-info"><strong>{artist.display_name}</strong><small>{role}</small><em>{artist.creative_talents.slice(0, 3).join(' · ')}</em></span>{profileHash ? <span className="directory-card-link">{labels.profile} <b aria-hidden="true">→</b></span> : <span className="directory-card-link directory-card-link--soon">{labels.comingSoon}</span>}</>
  if (!profileHash) return <div {...props} className={`directory-artist-card ${className} directory-artist-card--soon`} aria-label={artist.display_name} style={style}>{cardContent}</div>
  return <a {...props} className={`directory-artist-card ${className}`} href={profileHash} onClick={openProfile} aria-label={`${labels.profile}: ${artist.display_name}`} style={style}>{cardContent}</a>
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

function ArtistArchive({ language, focus }) {
  const labels = directoryLabels[language]
  const [filters, setFilters] = useState({ gender: 'all', language: 'all', type: 'all', city: 'all' })
  const dragRef = useRef({ active: false, moved: false, startX: 0, startScrollLeft: 0 })
  const filteredArtists = useMemo(() => directoryArtists.filter((artist) => (
    (filters.gender === 'all' || artist.gender === filters.gender)
    && (filters.language === 'all' || artist.languages.includes(filters.language))
    && (filters.type === 'all' || artist.creative_talents.includes(filters.type))
    && (filters.city === 'all' || artist.locations.includes(filters.city))
  )), [filters])
  useEffect(() => {
    if (!focus) return
    const target = document.querySelector(`[data-artist-id="${focus}"]`)
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    target.classList.add('is-focused')
    const timer = window.setTimeout(() => target.classList.remove('is-focused'), 1800)
    return () => window.clearTimeout(timer)
  }, [focus, filteredArtists.length])
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
        {filteredArtists.map((artist, index) => <DirectoryArtistCard key={artist.id} artist={artist} language={language} className="artist-archive-card" style={{ '--archive-offset': `${(2 - index) * 30}vw`, '--archive-delay': `${index * 85}ms` }} data-artist-id={artist.id} />)}
        {!filteredArtists.length && <p className="artist-empty">No artists match these filters.</p>}
      </div>
    </div>
  </section>
}

function ArtistsOverview({ language, focus }) {
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
    <ArtistArchive language={language} focus={focus} />
  </main>
}

function ArtistDetail({ artist, language }) {
  if (!artist) return <NotFound />
  if (artist.id === 'maya') return <MayaProfile artist={artist} language={language} />
  if (castingProfiles[artist.id]) return <CastingProfile artist={artist} language={language} profile={castingProfiles[artist.id]} />
  if (storyProfiles[artist.id]) {
    const story = storyProfiles[artist.id]
    const localizedStory = language === 'en' ? story : localizeStoryProfile(artist.id, story, language)
    return <ArtistStoryProfile artist={artist} language={language} story={localizedStory} />
  }
  if (artistProfileMedia[artist.id]) return <ArtistProfile artist={artist} language={language} media={artistProfileMedia[artist.id]} />
  const labels = directoryLabels[language]
  const role = language === 'zh' ? artist.role_zh : artist.role_en
  return <main id="main" className="subpage subpage--dark"><Container><div className="detail-grid detail-grid--artist"><div><PageHeader eyebrow={`${artist.number} / Artist`} title={artist.display_name} back="#/artists" backLabel={labels.back} /><p className="detail-role">{role}</p><dl className="artist-confirmed-fields"><div><dt>{labels.location}</dt><dd>{artist.locations.join(' · ')}</dd></div><div><dt>{labels.languages}</dt><dd>{artist.languages.join(' · ')}</dd></div><div><dt>{labels.talents}</dt><dd>{artist.creative_talents.join(' · ')}</dd></div></dl><p className="artist-coming-soon">{labels.comingSoon}</p></div><figure className="detail-media"><img src={artist.src} alt={`Portrait of ${artist.display_name}`} style={{ objectPosition: artist.position }} /></figure></div></Container></main>
}

const castingProfiles = {
  connor: {
    palette: { base: '#d7d9d5', atmosphere: '#c4cbc6', deep: '#1c2929', glow: 'rgba(48, 88, 90, .22)', ink: '#111518', accent: '#30585a' },
    role: 'British-Chinese fashion and film talent', roleZh: '英籍华人时装／影像艺人',
    hello: 'I’m Connor.',
    slogan: 'A strong, composed presence built for fashion, film and movement.',
    dossier: [['Height', '187 cm'], ['Weight', '86 kg'], ['Shoe size', '45'], ['Based in', 'Hong Kong / London'], ['Languages', 'English / Cantonese / Mandarin'], ['Artist type', 'Fashion / Film / Lifestyle']],
    personalityTitle: ['Strength with', 'quiet control.'],
    personality: [['Grounded', 'A broad-shouldered presence with calm, physical confidence.'], ['Controlled', 'Every gesture stays intentional, clean and camera-ready.'], ['Magnetic', 'He holds attention without needing to force the frame.'], ['Direct', 'A clear, modern energy that reads instantly on screen.']],
    collaborations: [{ slug: 'mgm-film-03', label: 'MGM POOL', caption: 'Lead talent · Connor + Bailey' }],
    cta: ['Available for fashion, film and lifestyle casting.', 'Work with Connor →'],
    nextSlug: 'bailey', nextLabel: { en: 'Next artist · Bailey', zh: '下一位艺术家 · Bailey', 'zh-Hant': '下一位藝術家 · Bailey' },
  },
  bailey: {
    palette: { base: '#e4dcda', atmosphere: '#d4c7c4', deep: '#2a2022', glow: 'rgba(123, 85, 87, .2)', ink: '#151315', accent: '#7b5557' },
    role: 'Chinese-French fashion and lifestyle talent', roleZh: '华裔法籍时装／生活方式艺人',
    hello: 'I’m Bailey.',
    slogan: 'A polished, natural presence moving between fashion, wellness and lifestyle.',
    dossier: [['Height', '174 cm'], ['Weight', '52 kg'], ['Measurements', '84 / 60 / 88'], ['Shoe size', '38'], ['Based in', 'Hong Kong / Paris'], ['Languages', 'English / Mandarin / French'], ['Artist type', 'Fashion / Wellness / Lifestyle']],
    personalityTitle: ['Lightness with', 'a refined edge.'],
    personality: [['Elegant', 'A precise, effortless image with a distinctly European ease.'], ['Calm', 'She brings softness and control to every campaign environment.'], ['Luminous', 'Natural expression, clean movement and an immediate camera connection.'], ['Expressive', 'A flexible presence that can move from wellness to fashion storytelling.']],
    collaborations: [{ slug: 'mgm-film-01', label: 'MGM SPA', caption: 'Lead talent · Bailey' }, { slug: 'mgm-film-02', label: 'MGM FILM', caption: 'Lead talent · Bailey' }, { slug: 'mgm-film-03', label: 'MGM POOL', caption: 'Lead talent · Connor + Bailey' }],
    cta: ['Available for fashion, wellness and lifestyle casting.', 'Work with Bailey →'],
    nextSlug: 'maya', nextLabel: { en: 'Next artist · Maya', zh: '下一位艺术家 · Maya', 'zh-Hant': '下一位藝術家 · Maya' },
  },
}

function CastingProfile({ artist, language, profile }) {
  const rootRef = useCastingProfileMotion()
  useProfileStart(artist.id)
  const isEnglish = language === 'en'
  const copy = language === 'zh-Hant'
    ? { back: '返回藝術家列表', profile: '藝術家檔案', dossier: '個人資料', identity: 'Identity.', personality: '人物性格', collaborations: '合作案例', madeWith: <>Made with<br />brands.</>, contact: '聯絡合作', available: '可透過 Green Tomato 預約', notPublic: '未公開', booking: '僅接受合作預約' }
    : language === 'zh'
      ? { back: '返回艺术家列表', profile: '艺术家档案', dossier: '个人资料', identity: 'Identity.', personality: '人物性格', collaborations: '合作案例', madeWith: <>Made with<br />brands.</>, contact: '联系合作', available: '可通过 Green Tomato 预约', notPublic: '未公开', booking: '仅接受合作预约' }
      : { back: 'Back to artists', profile: 'Artist profile', dossier: 'Personal dossier', identity: 'Identity.', personality: 'Personality', collaborations: 'Selected collaborations', madeWith: <>Made with<br />brands.</>, contact: 'Social + contact', available: 'Available through Green Tomato', notPublic: 'Not public', booking: 'Booking only' }
  const role = isEnglish ? profile.role : profile.roleZh
  const labelMap = language === 'zh-Hant'
    ? { Height: '身高', Weight: '體重', Measurements: '三圍', 'Shoe size': '鞋碼', 'Based in': '常駐地', Languages: '語言', 'Artist type': '藝術家類型' }
    : language === 'zh' ? { Height: '身高', Weight: '体重', Measurements: '三围', 'Shoe size': '鞋码', 'Based in': '常驻地', Languages: '语言', 'Artist type': '艺术家类型' } : {}
  const pose = (name) => {
    const resolved = name === 'detail-v2' && artist.id !== 'bailey' ? 'detail' : name
    return `${assets}artists/profile-poses/${artist.id}/${resolved}.png`
  }
  useEffect(() => {
    ;['hero', 'identity', 'detail', 'detail-v2'].forEach((name) => {
      const image = new Image()
      image.src = pose(name)
    })
  }, [artist.id])
  return <main id="main" ref={rootRef} data-artist={artist.id} className="maya-profile artist-story-profile casting-story-profile" style={{ '--story-base': profile.palette.base, '--story-atmosphere': profile.palette.atmosphere, '--story-deep': profile.palette.deep, '--story-glow': profile.palette.glow, '--story-ink': profile.palette.ink }}>
    <div className="maya-stage">
      <div className="maya-atmosphere" aria-hidden="true" />
      <figure className="maya-camera story-camera" aria-hidden="true">
        <img className="story-camera-pose" src={pose('hero')} alt="" fetchPriority="high" decoding="async" />
        <img className="story-camera-pose" src={pose('identity')} alt="" fetchPriority="high" decoding="async" />
        <img className="story-camera-pose" src={pose('detail')} alt="" decoding="async" />
        <img className="story-camera-pose" src={pose('detail-v2')} alt="" fetchPriority="high" decoding="async" />
      </figure>
      <section className="maya-scene maya-scene--hero"><Container><div className="maya-safe maya-safe--hero"><a className="back-link" href="#/artists">← {copy.back}</a><Eyebrow number="01">{copy.profile}</Eyebrow><h1>{artist.display_name}</h1><p className="maya-role">{role}</p><p className="maya-hello">{profile.hello}</p><div className="maya-about-intro"><p>{profile.slogan}</p></div></div><a className="next-artist-link" href={`#/artists/${profile.nextSlug}`}>{profile.nextLabel[language]} →</a><img className="maya-mobile-crop maya-mobile-crop--hero" src={pose('hero')} alt={`${artist.display_name} hero pose`} /></Container></section>
      <section className="maya-scene maya-scene--identity"><Container><figure className="maya-identity-portrait" aria-hidden="true"><img src={pose('identity')} alt="" fetchPriority="high" decoding="async" /></figure><div className="maya-safe maya-safe--identity"><Eyebrow number="02">{copy.dossier}</Eyebrow><h2>{copy.identity}</h2><dl className="maya-dossier">{profile.dossier.map(([label, value]) => <div key={label} className={label === 'Artist type' ? 'maya-dossier-wide' : ''}><dt>{labelMap[label] || label}</dt><dd>{value}</dd></div>)}</dl></div><img className="maya-mobile-crop" src={pose('identity')} alt={`${artist.display_name} identity pose`} /></Container></section>
      <section className="maya-scene maya-scene--detail"><Container><div className="maya-safe maya-safe--detail"><Eyebrow number="03">{copy.personality}</Eyebrow><h2 className="maya-detail-title">{profile.personalityTitle.map((line) => <span key={line}>{line}</span>)}</h2><div className="maya-personality-list">{profile.personality.map(([title, text], index) => <article className="maya-personality-item" key={title}><b>{String(index + 1).padStart(2, '0')}</b><div className="maya-personality-copy"><h3>{title}</h3><p>{text}</p></div></article>)}</div></div><img className="maya-mobile-crop" src={pose('detail-v2')} alt={`${artist.display_name} detail pose`} /></Container></section>
      <CastingCollaborationScene profile={profile} language={language} copy={copy} />
      <CastingContactScene profile={profile} language={language} copy={copy} />
    </div>
  </main>
}

function CastingCollaborationScene({ profile, language, copy }) {
  const [activeWork, setActiveWork] = useState(null)
  return <>
    <section className="maya-scene maya-scene--cases"><Container><div className={`maya-safe maya-safe--cases maya-safe--cases--${profile.collaborations.length}`}><Eyebrow number="04">{copy.collaborations}</Eyebrow><h2>{copy.madeWith}</h2><div className={`maya-collaboration-grid maya-collaboration-grid--${profile.collaborations.length}`}>{profile.collaborations.map((item, index) => { const work = workProjects.find((entry) => entry.slug === item.slug); return <button className="maya-collaboration-card casting-collaboration-card" type="button" onClick={() => work && setActiveWork(work)} key={item.slug} aria-label={`Play ${item.label}`}><div className="maya-collaboration-media">{work?.video ? <video src={work.video} poster={work.poster} muted playsInline preload="metadata" aria-label={`${item.label} collaboration preview`} /> : <img src={work?.poster} alt={`${item.label} collaboration`} loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} />}</div><span>{item.label} ↗</span><small className="casting-collaboration-caption">{item.caption}</small></button> })}</div></div></Container></section>
    {activeWork && <WorkPlayerModal work={activeWork} language={language} initialMuted={false} onClose={() => setActiveWork(null)} />}
  </>
}

function CastingContactScene({ profile, language, copy }) {
  const isEnglish = language === 'en'
  const heading = language === 'zh-Hant' ? ['想一起', '合作', '嗎？'] : language === 'zh' ? ['想一起', '合作', '吗？'] : ['Want to', 'work', 'together?']
  return (
    <section className="maya-scene maya-scene--social">
      <Container>
        <div className="maya-safe maya-safe--social">
          <Eyebrow number="05">{copy.contact}</Eyebrow>
          <div className="maya-social-layout casting-social-layout casting-social-layout--minimal">
            <div className="maya-social-metric">
              <span className="maya-social-handle">{copy.notPublic}</span>
              <strong className="maya-followers casting-private-label">{copy.booking}</strong>
              <p className="casting-contact-note">{copy.available}</p>
            </div>
            <div className="maya-cta">
              <h2>{heading.map((line) => <span key={line}>{line}</span>)}</h2>
              <a className="maya-primary-link" href="#/contact">{profile.cta[1]}</a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
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
      ['flight.jpg', 'In transit', 'A window seat above the city'],
      ['dinner-smile.jpg', 'After hours', 'A softer side of the night'],
      ['dinner-night.jpg', 'Night table', 'One last look before the lights go down'],
    ],
    collaborations: [
      ['miumiu', 'MIU MIU', 'https://www.instagram.com/p/DXv8OU5FTeN/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='],
      ['loewe', 'LOEWE', 'https://www.instagram.com/p/C9hC59UJJHm/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='],
      ['lemaire', 'LEMAIRE', 'https://www.instagram.com/p/C7QdMqiNONh/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='],
    ],
    socialLabel: 'Historical snapshot', socialHandle: 'Instagram', followers: '12,999', socialLinks: [['Instagram', '@amber.yun_', 'https://www.instagram.com/amber.yun_/']],
    factsLabel: 'Audience snapshot · historical', facts: [
      ['Male audience', '83.7%'], ['Female audience', '16.3%'], ['25–34', '35.0%'], ['18–24', '24.2%'],
      ['India', '28.2%'], ['Korea', '10.4%'], ['Brazil', '7.9%'], ['Taiwan', '6.4%'], ['United States', '6.4%'],
    ],
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
    world: [['video/lip-gloss.mp4', 'Lip colour', 'A polished detail', 'video'], ['video/beauty-still-life.mp4', 'Beauty object', 'A close look', 'video'], ['video/transformation.mp4', 'Transformation', 'A shift in mood', 'video'], ['hero.jpg', 'Beauty', 'A bright beginning'], ['mirror.jpg', 'Reflection', 'Looking closer'], ['stairs.jpg', 'City life', 'A gentle ascent'], ['sport.jpg', 'Motion', 'Energy in practice']],
    collaborations: [
      ['adidas-originals', 'ADIDAS ORIGINALS', 'https://www.instagram.com/p/DZuA1oTGIlC/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='],
      ['nike-seoul', 'NIKE SEOUL', 'https://www.instagram.com/p/DZfdxEXtqFF/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='],
      ['romand', 'ROM&ND', 'https://www.instagram.com/reel/DXbbQXYjW9z/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='],
      ['dear-dahlia', 'DEAR DAHLIA', 'https://www.instagram.com/reel/DWTRdVPjbL-/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='],
      ['lululemon-adidas', 'LULULEMON × ADIDAS', 'https://www.instagram.com/reel/DYZu4TStLlV/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='],
    ],
    socialLabel: 'Historical snapshot', socialHandle: 'Instagram', followers: '15.1K', socialLinks: [['Instagram', '@ooonana.yoga', 'https://www.instagram.com/ooonana.yoga/'], ['小红书', '94327612352', 'https://www.xiaohongshu.com/search_result?keyword=94327612352']],
    factsLabel: 'Audience snapshot · historical', facts: [
      ['Male audience', '72.4%'], ['Female audience', '27.6%'], ['Core age · 18–24', '37.8%'],
      ['Hong Kong', '3.2%'], ['Delhi', '1.7%'], ['New Taipei City', '1.5%'],
    ],
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
    world: [['video/shanghai-day-3.mp4', 'Shanghai · Day 3', 'A moving city note', 'video'], ['video/ocean-time.mp4', 'Ocean time', 'A quieter horizon', 'video'], ['mario-hero.jpg', 'City life', 'The everyday frame'], ['mario-editorial.jpg', 'Style', 'A sharper line'], ['mario-campaign.jpg', 'Campaign', 'Built for motion'], ['yotree-cover.jpg', 'Travel', 'A different pace']],
    collaborations: [
      ['loro-piana', 'LORO PIANA', 'https://www.instagram.com/p/DazrY8KjK0S/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='],
      ['yotree-coffee', 'YOTREE COFFEE', 'https://www.instagram.com/p/DZ_toKXCRvz/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='],
      ['polo-ralph-lauren', 'POLO RALPH LAUREN', 'https://www.instagram.com/p/DZ4op42CUif/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='],
      ['acqua-di-parma', 'ACQUA DI PARMA', 'https://www.instagram.com/p/DZouiMjCVa_/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='],
      ['mosay', 'MOSAY', 'https://www.instagram.com/p/DW5_E8PCTeC/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='],
      ['dwn45nrcvd', 'GENTLE MONSTER', 'https://www.instagram.com/p/DWn45nRCVd_/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='],
    ],
    socialLabel: 'Social snapshots · historical', socialHandle: 'Instagram', followers: '13.5K', socialLinks: [['Instagram', '@marrrio._.m', 'https://www.instagram.com/marrrio._.m/'], ['小红书', 'Mario', 'https://www.xiaohongshu.com/user/profile/6712310b000000001d022632']],
    socialMetrics: [
      ['Instagram', 'Historical snapshot', '13.5K'],
      ['Xiaohongshu', 'Historical snapshot', '5,214'],
    ],
    factsLabel: 'Audience snapshots · historical', facts: [
      ['Instagram · Male', '76.3%'], ['Instagram · 18–24', '44.8%'], ['Instagram · India', '58.0%'], ['Instagram · Taiwan', '15.1%'],
      ['Xiaohongshu · Male', '75%'], ['Xiaohongshu · 25–34', '58%'], ['Xiaohongshu · Shanghai', '8%'], ['Xiaohongshu · Beijing / Zaoyang', '7%'],
    ],
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
    world: [['video/cherry-blossom.mp4', 'Cherry blossom', 'A softer passing frame', 'video'], ['video/today-ca2.mp4', 'Today', 'A note from the day', 'video'], ['video/twin-sunglasses.mp4', 'Twin sunglasses', 'Built in contrast', 'video'], ['hero.png', 'Portrait', 'A clear point of view'], ['black-portrait.png', 'Fashion', 'Built in contrast'], ['cafe-portrait.png', 'City life', 'Between takes'], ['apple-portrait.jpg', 'Travel', 'A passing frame']],
    collaborations: [
      ['ralph-lauren', 'RALPH LAUREN', 'https://www.instagram.com/p/DVx718TAfjf/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='],
      ['nike', 'NIKE', 'https://www.instagram.com/p/DUmiM1mAS3t/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='],
    ],
    socialLabel: 'Historical snapshot', socialHandle: 'Instagram', followers: '8,254', socialLinks: [['Instagram', '@noahhhh0947', 'https://www.instagram.com/noahhhh0947/'], ['小红书', 'Noah', 'https://www.xiaohongshu.com/user/profile/673ab4b3000000001d02ed3f']],
    factsLabel: 'Audience snapshot · historical', facts: [
      ['Male audience', '75.9%'], ['Female audience', '24.1%'], ['18–24', '38.7%'], ['25–34', '27.9%'],
      ['13–17', '17.1%'], ['35–44', '9.4%'], ['45–54', '3.7%'], ['55–64', '2.0%'], ['65+', '1.2%'], ['Active peak · GMT+8', '21:00'],
      ['Delhi', '1.8%'], ['Shanghai', '1.2%'], ['Hong Kong', '1.1%'], ['Ahmedabad', '0.6%'], ['Antananarivo', '0.6%'],
    ],
    cta: 'Want to create something together?', next: 'Next artist · Connor', nextSlug: 'connor',
  },
}

const storyProfilesZh = {
  amber: {
    role: '音乐制作人／时尚艺术家', hello: '我是 Amber。', slogan: '融合音乐、时尚与都市文化的数字艺人。',
    intro: ['以音乐、造型与视觉共同建立鲜明表达。', '适合音乐、时尚及年轻文化品牌合作。'],
    personalityTitle: ['鲜明表达，', '跨界创造。'],
    personality: [
      ['自信鲜明', '在音乐、时尚及年轻文化企划中展现清晰、有力量的存在感。'],
      ['表达力强', '善于通过音乐、造型与动态视觉传递观点和情绪。'],
      ['先锋开放', '能够自然连接新兴音乐、潮流风格与文化趋势。'],
      ['跨界多元', '能够灵活驾驭音乐、美妆、时尚与生活方式内容。'],
    ],
    worldLead: '音乐、造型与城市文化持续交汇。', cta: '寻找合适的数字艺人合作？', next: '下一位数字艺人 · Ooona',
  },
  ooona: {
    role: '美妆／身心健康艺术家', hello: '我是 Ooona。', slogan: '以清新、自然的表达连接美妆、健康与生活方式。',
    intro: ['以轻松可信的内容呈现美妆、运动与日常健康。', '适合当代消费与生活方式品牌合作。'],
    personalityTitle: ['清新自然，', '轻松连接。'],
    personality: [
      ['自然亲和', '以自然、可信的表达拉近品牌与生活方式受众的距离。'],
      ['平衡从容', '将美妆、健康与运动融入统一、稳定的人物形象。'],
      ['清新现代', '具备清新现代的首尔美学，适合当代消费与生活方式品牌。'],
      ['积极健康', '以轻松方式传递自我关怀与健康理念，避免生硬说教。'],
    ],
    worldLead: '以轻盈节奏连接美妆、运动与日常健康生活。', cta: '寻找合适的数字艺人合作？', next: '下一位数字艺人 · Mario',
  },
  mario: {
    role: '生活方式创作者／摄影师', hello: '我是 Mario。', slogan: '记录街头文化、运动、旅行与真实日常。',
    intro: ['以摄影与生活观察建立可信、有亲和力的内容表达。', '适合运动、旅行及城市生活方式品牌合作。'],
    personalityTitle: ['真实视角，', '城市活力。'],
    personality: [
      ['真实自然', '内容真实、松弛且具有亲和力，容易与生活方式受众建立连接。'],
      ['好奇开放', '以开放视角探索不同地点、社群与日常故事。'],
      ['积极有活力', '为运动、旅行与城市内容带来自然活力与行动感。'],
      ['善于记录', '善于将日常细节转化为清晰、有吸引力的视觉故事。'],
    ],
    worldLead: '记录街头文化、旅行体验与值得保留的日常瞬间。', cta: '寻找合适的数字艺人合作？', next: '下一位数字艺人 · Noah',
  },
  noah: {
    role: '影像／时尚艺术家', hello: '我是 Noah。', slogan: '以精准造型与都市视角连接时尚、影像与旅行。',
    intro: ['通过动作、构图与场景建立清晰的视觉叙事。', '适合高端生活方式及文化型 Campaign。'],
    personalityTitle: ['清晰判断，', '精准表达。'],
    personality: [
      ['沉稳克制', '在时尚与影像内容中保持沉稳、精准且有控制力的表现。'],
      ['观察敏锐', '善于捕捉城市、旅行与日常流动中的独特视觉细节。'],
      ['当代感强', '将高品质造型与当代都市文化视角自然结合。'],
      ['目标清晰', '确保每个视觉选择都围绕 Campaign 的核心概念展开。'],
    ],
    worldLead: '以清晰视角记录时尚、影像与流动中的城市生活。', cta: '寻找合适的数字艺人合作？', next: '下一位数字艺人 · Connor',
  },
}

const storyProfilesZhHant = {
  amber: {
    role: '音樂製作人／時尚藝術家', hello: '我是 Amber。', slogan: '融合音樂、時尚與都市文化的數字藝人。', intro: ['以音樂、造型與視覺共同建立鮮明表達。', '適合音樂、時尚及年輕文化品牌合作。'], personalityTitle: ['鮮明表達，', '跨界創造。'],
    personality: [['自信鮮明', '在音樂、時尚及年輕文化企劃中展現清晰、有力量的存在感。'], ['表達力強', '善於透過音樂、造型與動態視覺傳遞觀點和情緒。'], ['先鋒開放', '能夠自然連接新興音樂、潮流風格與文化趨勢。'], ['跨界多元', '能夠靈活駕馭音樂、美妝、時尚與生活方式內容。']], worldLead: '音樂、造型與城市文化持續交匯。', cta: '尋找合適的數字藝人合作？', next: '下一位數字藝人 · Ooona',
  },
  ooona: {
    role: '美妝／身心健康藝術家', hello: '我是 Ooona。', slogan: '以清新、自然的表達連接美妝、健康與生活方式。', intro: ['以輕鬆可信的內容呈現美妝、運動與日常健康。', '適合當代消費與生活方式品牌合作。'], personalityTitle: ['清新自然，', '輕鬆連接。'],
    personality: [['自然親和', '以自然、可信的表達拉近品牌與生活方式受眾的距離。'], ['平衡從容', '將美妝、健康與運動融入統一、穩定的人物形象。'], ['清新現代', '具備清新現代的首爾美學，適合當代消費與生活方式品牌。'], ['積極健康', '以輕鬆方式傳遞自我關懷與健康理念，避免生硬說教。']], worldLead: '以輕盈節奏連接美妝、運動與日常健康生活。', cta: '尋找合適的數字藝人合作？', next: '下一位數字藝人 · Mario',
  },
  mario: {
    role: '生活方式創作者／攝影師', hello: '我是 Mario。', slogan: '記錄街頭文化、運動、旅行與真實日常。', intro: ['以攝影與生活觀察建立可信、有親和力的內容表達。', '適合運動、旅行及城市生活方式品牌合作。'], personalityTitle: ['真實視角，', '城市活力。'],
    personality: [['真實自然', '內容真實、鬆弛且具有親和力，容易與生活方式受眾建立連接。'], ['好奇開放', '以開放視角探索不同地點、社群與日常故事。'], ['積極有活力', '為運動、旅行與城市內容帶來自然活力與行動感。'], ['善於記錄', '善於將日常細節轉化為清晰、有吸引力的視覺故事。']], worldLead: '記錄街頭文化、旅行體驗與值得保留的日常瞬間。', cta: '尋找合適的數字藝人合作？', next: '下一位數字藝人 · Noah',
  },
  noah: {
    role: '影像／時尚藝術家', hello: '我是 Noah。', slogan: '以精準造型與都市視角連接時尚、影像與旅行。', intro: ['透過動作、構圖與場景建立清晰的視覺敘事。', '適合高端生活方式及文化型 Campaign。'], personalityTitle: ['清晰判斷，', '精準表達。'],
    personality: [['沉穩克制', '在時尚與影像內容中保持沉穩、精準且有控制力的表現。'], ['觀察敏銳', '善於捕捉城市、旅行與日常流動中的獨特視覺細節。'], ['當代感強', '將高品質造型與當代都市文化視角自然結合。'], ['目標清晰', '確保每個視覺選擇都圍繞 Campaign 的核心概念展開。']], worldLead: '以清晰視角記錄時尚、影像與流動中的城市生活。', cta: '尋找合適的數字藝人合作？', next: '下一位數字藝人 · Connor',
  },
}

function localizeStoryProfile(id, story, language) {
  const localized = language === 'zh-Hant' ? storyProfilesZhHant[id] : storyProfilesZh[id]
  if (!localized) return story
  return { ...story, ...localized }
}

function SocialAccountLinks({ links }) {
  return <div className="maya-social-links">{links.map(([platform, handle, url]) => <a key={url} href={url} target="_blank" rel="noreferrer"><span>{platform}</span><b>{handle}</b><i aria-hidden="true">↗</i></a>)}</div>
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
  ['seedance-travel-vlog.mp4', 'On the move', 'A handheld travel note', 'video'],
  ['pink-editorial.jpg', 'Fashion', 'Soft structure'], ['pink-closeup.jpg', 'Beauty', 'A quiet close-up'],
  ['black-tailoring.jpg', 'Art', 'A tailored pause'], ['street-grey.jpg', 'City life', 'Between places'],
  ['cafe-peace.jpg', 'Pause', 'A small moment between plans'], ['camera-selfie.jpg', 'Self portrait', 'Behind the camera'],
  ['graffiti-street.jpg', 'City life', 'A street-side pause'], ['chrome-street.jpg', 'Style', 'A sharper silhouette'],
  ['cafe-window.jpg', 'Afternoon', 'A table by the window'],
].map(([file, category, caption, kind]) => ({ src: `${assets}artists/maya-world/mockup/${file}`, category, caption, kind }))
const mayaCollaborations = [
  ['hifather', 'HI FATHER', 'https://www.instagram.com/p/C14WnnsJ037/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='],
  ['ugg', 'UGG × MUSINSA', 'https://www.instagram.com/p/C0GCsQmJtgB/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='],
  ['eatppeum', 'EAT PPEUM', 'https://www.instagram.com/p/C2guQy3pK0C/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='],
  ['dontaskmyplan', "DON'T ASK MY PLAN", 'https://www.instagram.com/p/C27hAEMJg3O/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='],
  ['emis', 'EMIS', 'https://www.instagram.com/p/C6s3I2DrGuK/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='],
  ['tamburins', 'TAMBURINS', 'https://www.instagram.com/p/Cz8cKQ6BDvG/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='],
  ['chillgood-tv', 'CHILLGOOD_TV', '#/work/chillgood-takoyaki', 'video'],
]

function MayaCollaborationCard({ item, index, onVideo }) {
  const [file, brand, url, kind] = item
  if (kind === 'video') {
    // Maya's selected-work video is the short collaboration cut stored with
    // her profile. Do not reuse the long Work-page Takoyaki project here.
    const video = `${assets}artists/collaborations/maya/${file}.mp4`
    const poster = `${assets}artists/collaborations/maya/${file}.jpg`
    const work = { brand, name: brand, category: 'Selected collaboration', video, poster }
    return <button className="maya-collaboration-card maya-collaboration-card--video" type="button" onClick={() => onVideo(work)} aria-label={`Play ${brand}`}>
      <div className="maya-collaboration-media"><video src={video} poster={poster} muted playsInline preload="metadata" aria-label={`Maya collaboration with ${brand}`} /></div>
      <span>{brand} ↗</span>
    </button>
  }
  return <a className="maya-collaboration-card" href={url} key={file} target="_blank" rel="noreferrer"><div className="maya-collaboration-media"><img src={`${assets}artists/collaborations/maya/${file}.jpg`} alt={`Maya collaboration with ${brand}`} loading={index < 2 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} /></div><span>{brand} ↗</span></a>
}

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
      ['精致克制', '注重比例、质感与细节，视觉表达高级且克制。'],
      ['审美敏锐', '对造型与创意有明确判断，每个选择都服务于整体表达。'],
      ['艺术导向', '关注具有质感、结构与文化关联的时尚影像。'],
      ['独立鲜明', '面对不同品牌、城市与内容形式，始终保持鲜明且一致的个人风格。'],
    ],
    aboutLines: ['在表达之前，我会先收集参考与感受。', '我的作品在柔和结构与清晰观点之间生长。', '当时尚为感受留出空间，它就会变得很私人。'],
    worldMoments: [['时尚', '柔和结构'], ['艺术', '凝视细节'], ['城市生活', '城市之间'], ['美妆', '安静仪式']],
    age1824: '18–24 岁', age2534: '25–34 岁', male: '男性受众', female: '女性受众', countries: '热门国家／地区', swipe: '滑动浏览',
  },
}
mayaStoryCopy['zh-Hant'] = { ...mayaStoryCopy.zh, back: '返回藝術家列表', role: '奢華時尚 / 藝術', hello: '我是 Maya。', slogan: '一位遊走於奢華、藝術與文化之間的高級時尚藝術家。', dossier: '個人檔案', personality: '人物氣質', measurements: '三圍', shoe: '鞋碼', base: '常駐地', world: '我的世界', worldLead: '讓我的世界持續流動的靈感。', about: '關於我', social: '社交與合作', followers: '粉絲數', audience: '受眾快照 · 近 30 天', cta: '想一起創作些什麼嗎？', work: '與 Maya 合作', next: '下一位藝術家 · Amber', countries: '熱門國家／地區', swipe: '滑動瀏覽' }
mayaStoryCopy['zh-Hant'].personalityItems = [
  ['精緻克制', '注重比例、質感與細節，視覺表達高級且克制。'],
  ['審美敏銳', '對造型與創意有明確判斷，每個選擇都服務於整體表達。'],
  ['藝術導向', '關注具有質感、結構與文化關聯的時尚影像。'],
  ['獨立鮮明', '面對不同品牌、城市與內容形式，始終保持鮮明且一致的個人風格。'],
]
mayaStoryCopy['zh-Hant'].aboutLines = ['在表達之前，我會先收集參考與感受。', '我的作品在柔和結構與清晰觀點之間生長。', '當時尚為感受留出空間，它就會變得很私人。']
mayaStoryCopy['zh-Hant'].worldMoments = [['時尚', '柔和結構'], ['藝術', '凝視細節'], ['城市生活', '城市之間'], ['美妝', '安靜儀式']]

const profileUi = {
  en: { artist: 'Artist / 05', identity: 'Identity', collaborations: 'Selected collaborations', madeWith: <>Made with<br />brands.</>, historical: 'historical', workWith: 'Work with' },
  zh: { artist: '艺术家 / 05', identity: '身份档案', collaborations: '合作案例', madeWith: <>与品牌<br />共同创作。</>, historical: '历史快照', workWith: '与' },
  'zh-Hant': { artist: '藝術家 / 05', identity: '身份檔案', collaborations: '合作案例', madeWith: <>與品牌<br />共同創作。</>, historical: '歷史快照', workWith: '與' },
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
      // The hero subject sits under the Next Artist link. Keep the later
      // dossier/detail camera landings in their original left reading lane.
      const heroOffset = (window.innerWidth * .09 / camera.getBoundingClientRect().width) * 100
      gsap.set(scenes, { autoAlpha: 0, y: 22, pointerEvents: 'none' })
      gsap.set(scenes[0], { autoAlpha: 1, y: 0, pointerEvents: 'auto' })
      gsap.set(personality, { opacity: 1, x: 0 })
      gsap.set(camera, { xPercent: 0, yPercent: 0, scale: 1, transformOrigin: '50% 50%' })

      const revealScene = (timeline, from, to, at) => {
        timeline.to(from, { autoAlpha: 0, y: -20, pointerEvents: 'none', duration: .32 }, at)
          .fromTo(to, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, pointerEvents: 'auto', duration: .42 }, at + .18)
      }
      const timeline = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
        trigger: root, start: 'top top', end: () => `+=${window.innerHeight * 7.4}`, pin: stage,
        scrub: .75, anticipatePin: 1, invalidateOnRefresh: true,
      } })
      // Keep the Maya camera inside the left subject lane while the dossier owns the right reading lane.
      timeline.to(camera, { xPercent: -208 + heroOffset, yPercent: 12, scale: 1.9, transformOrigin: '50% 17%', duration: 1.3 }, .45)
        .to(atmosphere, { xPercent: -5, yPercent: 3, scale: 1.08, backgroundColor: '#191718', duration: 1.3 }, .45)
        .to(camera, { autoAlpha: 0, duration: .16 }, .75)
      revealScene(timeline, scenes[0], scenes[1], .78)
      // The close garment frame stays entirely to the left of the Personality column.
      timeline.to(camera, { autoAlpha: 1, xPercent: -223 + heroOffset, yPercent: -14, scale: 1.9, transformOrigin: '50% 52%', duration: 1.25 }, 1.75)
        .to(atmosphere, { xPercent: 6, yPercent: -4, scale: 1.14, backgroundColor: '#191718', duration: 1.25 }, 1.75)
      revealScene(timeline, scenes[1], scenes[2], 1.92)
      personality.forEach((item, index) => {
        timeline.to(item, { x: 12, duration: .18 }, 2.15 + index * .22)
      })
      // Scene 04 is image-free: the subject holds its final 03 framing, then fades away before the phone appears.
      timeline.to(camera, { autoAlpha: 0, duration: .34 }, 2.82)
        .to(atmosphere, { xPercent: -3, yPercent: 2, scale: 1.02, backgroundColor: '#e7ded9', duration: 1.15 }, 3.05)
      revealScene(timeline, scenes[2], scenes[3], 3.18)
      revealScene(timeline, scenes[3], scenes[4], 4.48)
      timeline.to(atmosphere, { backgroundColor: '#efa7b1', duration: .72 }, 5.48)
      revealScene(timeline, scenes[4], scenes[5], 5.54)
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
      {mayaWorldImages.map((image, index) => <figure key={image.src}>{image.kind === 'video' ? <WorldPhoneVideo src={image.src} label={`Maya — ${image.category}: ${image.caption}`} priority={index === 0} /> : <img src={image.src} alt={`Maya — ${image.category}: ${image.caption}`} loading={index < 2 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} />}<figcaption><strong>{image.category}</strong><span>{image.caption}</span></figcaption></figure>)}
    </div>
    <div className="maya-phone-bottom"><span>{page} / {mayaWorldImages.length}</span><span>{copy.swipe} ↔</span></div>
  </div>
}

function MayaProfile({ artist, language }) {
  const rootRef = useMayaProfileMotion()
  useProfileStart(artist.id)
  const [activeWork, setActiveWork] = useState(null)
  const dossier = artist.personal_dossier
  const social = artist.social_snapshot
  const copy = mayaStoryCopy[language]
  const ui = profileUi[language]
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
      <section className="maya-scene maya-scene--hero"><Container><div className="maya-safe maya-safe--hero"><a className="back-link" href="#/artists">← {copy.back}</a><Eyebrow number="01">{ui.artist}</Eyebrow><h1>Maya</h1><p className="maya-role">{copy.role}</p><p className="maya-hello">{copy.hello}</p><div className="maya-about-intro"><p>{copy.slogan}</p></div></div><a className="next-artist-link" href="#/artists/amber">{copy.next} →</a><img className="maya-mobile-crop maya-mobile-crop--hero" src={mayaStanding.src} alt={mayaStanding.alt} /></Container></section>
      <section className="maya-scene maya-scene--identity"><Container><figure className="maya-identity-portrait" aria-hidden="true"><img src={mayaWalking.src} alt="" fetchPriority="high" /></figure><div className="maya-safe maya-safe--identity"><Eyebrow number="02">{copy.dossier}</Eyebrow><h2>{ui.identity}</h2><dl className="maya-dossier"><div><dt>{copy.height}</dt><dd>{dossier.height}</dd></div><div><dt>{copy.weight}</dt><dd>{dossier.weight}</dd></div><div><dt>{copy.measurements}</dt><dd>{dossier.measurements}</dd></div><div><dt>{copy.shoe}</dt><dd>{dossier.shoe_size}</dd></div><div><dt>{copy.base}</dt><dd>{artist.locations.join(' / ')}</dd></div><div><dt>{copy.languages}</dt><dd>{artist.languages.join(' / ')}</dd></div><div className="maya-dossier-wide"><dt>{copy.type}</dt><dd>{artist.creative_talents.join(' / ')}</dd></div></dl></div><img className="maya-mobile-crop" src={mayaWalking.src} alt={mayaWalking.alt} /></Container></section>
      <section className="maya-scene maya-scene--detail"><Container><div className="maya-safe maya-safe--detail"><Eyebrow number="03">{copy.personality}</Eyebrow><h2 className="maya-detail-title"><span>Details of</span><span>character.</span></h2><div className="maya-personality-list">{copy.personalityItems.map(([title, text], index) => <article className="maya-personality-item" key={title}><b>{String(index + 1).padStart(2, '0')}</b><div className="maya-personality-copy"><h3>{title}</h3><p>{text}</p></div></article>)}</div></div><img className="maya-mobile-crop" src={mayaStanding.src} alt={mayaStanding.alt} /></Container></section>
      <section className="maya-scene maya-scene--world"><Container><div className="maya-safe maya-safe--world"><div className="maya-world-copy"><Eyebrow number="04">{copy.world}</Eyebrow><h2>{copy.world}</h2><p>{copy.worldLead}</p><p>{copy.aboutLines[2]}</p></div><MayaWorldPhone copy={copy} /></div></Container></section>
      <section className="maya-scene maya-scene--cases"><Container><div className={`maya-safe maya-safe--cases maya-safe--cases--${mayaCollaborations.length}`}><Eyebrow number="05">{ui.collaborations}</Eyebrow><h2>{ui.madeWith}</h2><div className={`maya-collaboration-grid maya-collaboration-grid--${mayaCollaborations.length}`}>{mayaCollaborations.map((item, index) => <MayaCollaborationCard item={item} index={index} onVideo={setActiveWork} key={item[0]} />)}</div></div></Container></section>
      <section className="maya-scene maya-scene--social"><Container><div className="maya-safe maya-safe--social"><Eyebrow number="06">{copy.social}</Eyebrow><div className="maya-social-layout"><div className="maya-social-metric"><a className="maya-social-handle" href={social.url} target="_blank" rel="noreferrer">{social.platform} · {social.handle} ↗</a><strong className="maya-followers">{dossier.followers_snapshot}<small>{copy.followers}</small></strong><SocialAccountLinks links={[[social.platform, social.handle, social.url]]} /></div><div className="maya-audience"><p>{copy.audience}</p><dl><div><dt>{copy.age2534}</dt><dd>{audience.age_25_34}</dd></div><div><dt>{copy.age1824}</dt><dd>{audience.age_18_24}</dd></div><div><dt>{copy.male}</dt><dd>{audience.male_audience}</dd></div><div><dt>{copy.female}</dt><dd>{audience.female_audience}</dd></div><div className="maya-audience-countries"><dt>{copy.countries}</dt><dd>{audience.countries}</dd></div></dl></div><div className="maya-cta"><h2>{language === 'en' ? <><span>Want to</span><span>create</span><span>something</span><span>together?</span></> : language === 'zh-Hant' ? <><span>想一起</span><span>創作</span><span>些什麼</span><span>嗎？</span></> : <><span>想一起</span><span>创作</span><span>些什么</span><span>吗？</span></>}</h2><a className="maya-primary-link" href="#contact">{copy.work} →</a></div></div></div></Container></section>
    </div>
    {activeWork && <WorkPlayerModal work={activeWork} language={language} initialMuted={false} onClose={() => setActiveWork(null)} />}
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
      const hasCases = Boolean(root.querySelector('.maya-scene--cases'))
      const isMarioCases = root.dataset.artist === 'mario' && hasCases
      const casesSafe = root.querySelector('.maya-scene--cases .maya-safe--cases')
      const detailScale = root.dataset.artist === 'noah' ? 1.1 : 1.35
      gsap.set(scenes, { autoAlpha: 0, y: 22, pointerEvents: 'none' })
      gsap.set(scenes[0], { autoAlpha: 1, y: 0, pointerEvents: 'auto' })
      gsap.set(poses, { autoAlpha: 0 })
      gsap.set(poses[0], { autoAlpha: 1 })
      gsap.set(personality, { opacity: 1, x: 0 })
      gsap.set(camera, { xPercent: 0, yPercent: 0, scale: 1, transformOrigin: '50% 50%' })
      const revealScene = (timeline, from, to, at) => timeline.to(from, { autoAlpha: 0, y: -20, pointerEvents: 'none', duration: .32 }, at).fromTo(to, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, pointerEvents: 'auto', duration: .42 }, at + .18)
      const timeline = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: root, start: 'top top', end: () => `+=${window.innerHeight * (isMarioCases ? 9.3 : (hasCases ? 7.4 : 6.2))}`, pin: stage, scrub: .75, anticipatePin: 1, invalidateOnRefresh: true } })
      timeline.to(camera, { xPercent: -188, yPercent: 12, scale: 1.78, transformOrigin: '50% 16%', duration: 1.3 }, .45)
        .to(atmosphere, { xPercent: -5, yPercent: 3, scale: 1.08, backgroundColor: 'var(--story-deep)', duration: 1.3 }, .45)
        .to(camera, { autoAlpha: 0, duration: .16 }, .75)
      revealScene(timeline, scenes[0], scenes[1], .78)
      timeline.set(poses[0], { autoAlpha: 0 }, 1.75).set(poses[2], { autoAlpha: 1 }, 1.75)
        // Non-Maya pose studies use a looser 03 camera so every artist's head stays in frame.
        .to(camera, { autoAlpha: 1, xPercent: -170, yPercent: -10, scale: detailScale, transformOrigin: '50% 30%', duration: 1.25 }, 1.75)
        .to(atmosphere, { xPercent: 6, yPercent: -4, scale: 1.14, backgroundColor: 'var(--story-deep)', duration: 1.25 }, 1.75)
      revealScene(timeline, scenes[1], scenes[2], 1.92)
      personality.forEach((item, index) => timeline.to(item, { x: 12, duration: .18 }, 2.15 + index * .22))
      // Keep every artist in place as scene 03 resolves, then remove the figure before the image-only My World scene.
      timeline.to(camera, { autoAlpha: 0, duration: .34 }, 2.82)
        .to(atmosphere, { xPercent: -3, yPercent: 2, scale: 1.02, backgroundColor: 'var(--story-base)', duration: 1.15 }, 3.05)
      revealScene(timeline, scenes[2], scenes[3], 3.18)
      timeline.to(atmosphere, { backgroundColor: 'var(--story-base)', duration: .72 }, 4.42)
      revealScene(timeline, scenes[3], scenes[4], 4.48)
      if (isMarioCases) {
        // Mario has two rows of collaborations. Move the eyebrow, heading and
        // both rows as one editorial block so the 05 label never gets stranded
        // above the works while the visitor scrolls toward 06.
        gsap.set(casesSafe, { y: 0, willChange: 'transform' })
        timeline.to(casesSafe, {
          y: () => -Math.max(0, casesSafe ? casesSafe.scrollHeight - window.innerHeight * .86 : 0),
          duration: 1.15
        }, 6.35)
        revealScene(timeline, scenes[4], scenes[5], 7.82)
      } else if (hasCases) revealScene(timeline, scenes[4], scenes[5], 5.54)
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }, root)
    return () => ctx.revert()
  }, [])
  return rootRef
}

// Casting profiles use the same pinned stage and camera rhythm as the five
// established artist profiles, with 04 collaborations followed directly by 05 contact.
function useCastingProfileMotion() {
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
      const cameraShift = root.dataset.artist === 'connor' ? 14 : 0
      const timeline = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: root, start: 'top top', end: () => `+=${window.innerHeight * 6.2}`, pin: stage, scrub: .75, anticipatePin: 1, invalidateOnRefresh: true } })
      timeline.to(camera, { xPercent: -188, yPercent: 12, scale: 1.78, transformOrigin: '50% 16%', duration: 1.3 }, .45)
        .to(atmosphere, { xPercent: -5, yPercent: 3, scale: 1.08, backgroundColor: 'var(--story-deep)', duration: 1.3 }, .45)
        .to(camera, { autoAlpha: 0, duration: .16 }, .75)
      revealScene(timeline, scenes[0], scenes[1], .78)
      timeline.set(poses[0], { autoAlpha: 0 }, 1.75).set(poses[2], { autoAlpha: 1 }, 1.75).set(poses[3], { autoAlpha: 0 }, 1.75)
        .to(camera, { autoAlpha: 1, xPercent: -170 + cameraShift, yPercent: -10, scale: 1.28, transformOrigin: '50% 30%', duration: 1.25 }, 1.75)
        .to(atmosphere, { xPercent: 6, yPercent: -4, scale: 1.14, backgroundColor: 'var(--story-deep)', duration: 1.25 }, 1.75)
      revealScene(timeline, scenes[1], scenes[2], 1.92)
      timeline.set(poses[2], { autoAlpha: 0 }, 2.35).set(poses[3], { autoAlpha: 1 }, 2.35)
      personality.forEach((item, index) => timeline.to(item, { x: 12, duration: .18 }, 2.15 + index * .22))
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
      {story.world.map(([file, category, caption, kind], index) => <figure key={file}>{kind === 'video' ? <WorldPhoneVideo src={`${assets}artists/profile-media/${artist.id}/${file}`} label={`${artist.display_name} — ${category}: ${caption}`} priority={index === 0} /> : <img src={`${assets}artists/profile-media/${artist.id}/${file}`} alt={`${artist.display_name} — ${category}: ${caption}`} loading={index < 2 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} />}<figcaption><strong>{category}</strong><span>{caption}</span></figcaption></figure>)}
    </div>
    <div className="maya-phone-bottom"><span>{page} / {story.world.length}</span><span>{copy.swipe} ↔</span></div>
  </div>
}

function WorldPhoneVideo({ src, label, priority }) {
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(true)
  const stopRailDrag = (event) => event.stopPropagation()
  const togglePlayback = (event) => {
    stopRailDrag(event)
    const video = videoRef.current
    if (!video) return
    if (video.paused) video.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    else { video.pause(); setPlaying(false) }
  }
  const toggleMuted = (event) => {
    stopRailDrag(event)
    const video = videoRef.current
    if (!video) return
    const nextMuted = !video.muted
    video.muted = nextMuted
    setMuted(nextMuted)
  }
  return <><video ref={videoRef} className="maya-phone-video" src={src} aria-label={label} autoPlay muted loop playsInline preload={priority ? 'auto' : 'metadata'} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} /><div className="maya-phone-video-controls" aria-label="Video controls"><button type="button" onPointerDown={stopRailDrag} onClick={togglePlayback} aria-label={playing ? 'Pause video' : 'Play video'}>{playing ? 'Ⅱ' : '▶'}</button><button type="button" onPointerDown={stopRailDrag} onClick={toggleMuted} aria-label={muted ? 'Turn sound on' : 'Mute video'}>{muted ? '🔇' : '🔊'}</button></div></>
}

function ArtistCollaborationScene({ artist, collaborations, language }) {
  const ui = profileUi[language]
  return <section className="maya-scene maya-scene--cases"><Container><div className={`maya-safe maya-safe--cases maya-safe--cases--${collaborations.length}`}><Eyebrow number="05">{ui.collaborations}</Eyebrow><h2>{ui.madeWith}</h2><div className={`maya-collaboration-grid maya-collaboration-grid--${collaborations.length}`}>{collaborations.map(([file, brand, url], index) => <a className="maya-collaboration-card" href={url} key={file} target="_blank" rel="noreferrer"><div className="maya-collaboration-media"><img src={`${assets}artists/collaborations/${artist.id}/${file}.jpg`} alt={`${artist.display_name} collaboration with ${brand}`} loading={index < 2 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} /></div><span>{brand} ↗</span></a>)}</div></div></Container></section>
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
    const sources = [pose('hero'), pose('identity'), pose('detail'), ...story.world.slice(0, 2).filter(([, , , kind]) => kind !== 'video').map(([file]) => `${assets}artists/profile-media/${artist.id}/${file}`)]
    sources.forEach((src) => { const image = new Image(); image.src = src; image.decode?.().catch(() => {}) })
  }, [artist.id])
  return <main id="main" ref={rootRef} data-artist={artist.id} className="maya-profile artist-story-profile" style={cssVars}>
    <div className="maya-stage">
      <div className="maya-atmosphere" aria-hidden="true" />
      <figure className="maya-camera story-camera" aria-hidden="true"><img className="story-camera-pose" src={pose('hero')} alt="" fetchPriority="high" decoding="async" /><img className="story-camera-pose" src={pose('identity')} alt="" decoding="async" /><img className="story-camera-pose" src={pose('detail')} alt="" fetchPriority="high" decoding="async" /></figure>
      <section className="maya-scene maya-scene--hero"><Container><div className="maya-safe maya-safe--hero"><a className="back-link" href="#/artists">← {copy.back}</a><Eyebrow number="01">{profileUi[language].artist}</Eyebrow><h1>{artist.display_name}</h1><p className="maya-role">{story.role}</p><p className="maya-hello">{story.hello}</p><div className="maya-about-intro"><p>{story.slogan}</p></div></div><a className="next-artist-link" href={`#/artists/${story.nextSlug}`}>{story.next} →</a><img className="maya-mobile-crop maya-mobile-crop--hero" src={pose('hero')} alt={`${artist.display_name} standing pose`} /></Container></section>
      <section className="maya-scene maya-scene--identity"><Container><figure className="maya-identity-portrait" aria-hidden="true"><img src={pose('identity')} alt="" fetchPriority="high" decoding="async" /></figure><div className="maya-safe maya-safe--identity"><Eyebrow number="02">{copy.dossier}</Eyebrow><h2>{profileUi[language].identity}</h2><dl className="maya-dossier">{media.dossier.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}<div className="maya-dossier-wide"><dt>{copy.type}</dt><dd>{artist.creative_talents.join(' / ')}</dd></div></dl></div><img className="maya-mobile-crop" src={pose('identity')} alt={`${artist.display_name} editorial pose`} /></Container></section>
      <section className="maya-scene maya-scene--detail"><Container><div className="maya-safe maya-safe--detail"><Eyebrow number="03">{copy.personality}</Eyebrow><h2 className="maya-detail-title">{story.personalityTitle.map((line) => <span key={line}>{line}</span>)}</h2><div className="maya-personality-list">{story.personality.map(([title, text], index) => <article className="maya-personality-item" key={title}><b>{String(index + 1).padStart(2, '0')}</b><div className="maya-personality-copy"><h3>{title}</h3><p>{text}</p></div></article>)}</div></div><img className="maya-mobile-crop" src={pose('detail')} alt={`${artist.display_name} seated pose`} /></Container></section>
      <section className="maya-scene maya-scene--world"><Container><div className="maya-safe maya-safe--world"><div className="maya-world-copy"><Eyebrow number="04">{copy.world}</Eyebrow><h2>{copy.world}</h2><p>{story.worldLead}</p><p>{story.intro[1]}</p></div><ArtistWorldPhone artist={artist} story={story} copy={copy} /></div></Container></section>
      {story.collaborations && <ArtistCollaborationScene artist={artist} collaborations={story.collaborations} language={language} />}
      <section className="maya-scene maya-scene--social"><Container><div className="maya-safe maya-safe--social"><Eyebrow number={story.collaborations ? '06' : '05'}>{copy.social}</Eyebrow><div className="maya-social-layout"><div className={`maya-social-metric${story.socialMetrics ? ' maya-social-metric--multiple' : ''}`}>{story.socialMetrics ? story.socialMetrics.map(([platform, label, followers]) => <div className="maya-social-metric-item" key={platform}><span className="maya-social-handle">{platform} · {label}</span><strong className="maya-followers">{followers}<small>{copy.followers}</small></strong></div>) : <><span className="maya-social-handle">{story.socialHandle} · {story.socialLabel}</span><strong className="maya-followers">{story.followers}<small>{copy.followers} · historical</small></strong></>}<SocialAccountLinks links={story.socialLinks} /></div><div className="maya-audience"><p>{story.factsLabel}</p><dl>{story.facts.map(([label, value]) => <div key={label} className={label === 'Focus' || value.length > 22 ? 'maya-audience-countries' : ''}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div><div className="maya-cta"><h2>{story.cta.split(' ').map((word, index) => <span key={`${word}-${index}`}>{word}</span>)}</h2><a className="maya-primary-link" href="#contact">Work with {artist.display_name} →</a></div></div></div></Container></section>
    </div>
  </main>
}

const workFormats = [
  ['commercial', 'Brand Worlds', 'Brands in full focus.', '品牌世界', '让品牌成为主角。', '品牌世界', '讓品牌成為主角。'],
  ['mv', 'Sound in Motion', 'Sound, seen differently.', '声画现场', '让声音被看见。', '聲畫現場', '讓聲音被看見。'],
  ['reels', 'Quick Cuts', 'Small moments, in motion.', '灵感快切', '轻快瞬间，持续流动。', '靈感快切', '輕快瞬間，持續流動。'],
  ['photo', 'Still Worlds', 'Still, never static.', '静帧世界', '静止，也持续发生。', '靜幀世界', '靜止，也持續發生。'],
  ['drama', 'Narrative Frames', 'Stories that stay with you.', '叙事片场', '留在心里的故事。', '敘事片場', '留在心裡的故事。'],
  ['crew', 'Crew', 'The people behind the picture.', '幕后团队', '让创作发生的人。', '幕後團隊', '讓創作發生的人。'],
]
const workFormatFor = (work) => work.format || (work.photo ? 'photo' : ['peninsula-fathers-day', 'chunwo-dreamgirl-03', 'chow-sang-sang'].includes(work.slug) ? 'reels' : ['chillgood-takoyaki', 'chillgood-animation'].includes(work.slug) ? 'mv' : 'commercial')
// Keep the complete Work process section in source so it can be restored without rebuilding it.
const showWorkIntro = true

function useWorkIntroMotion(language) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const section = ref.current
    if (!section) return undefined
    section.classList.add('is-motion-ready')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || window.innerWidth <= 820) {
      section.classList.add('is-static-story')
      return undefined
    }
    section.classList.add('is-pinned-story')
    const story = section.querySelector('.work-story')
    const panels = gsap.utils.toArray('.work-story-part', story)
    if (!story || panels.length < 3) return undefined
    const ctx = gsap.context(() => {
      const hero = section.querySelector('.work-hero')
      const art = section.querySelector('.work-hero-art img')
      const processCards = gsap.utils.toArray('.work-process-card', panels[1])
      gsap.fromTo(hero?.querySelectorAll('.work-hero-copy > *') || [], { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: .9, stagger: .1, ease: 'power3.out' })
      gsap.fromTo(art, { autoAlpha: 0, scale: 1.08, xPercent: 4 }, { autoAlpha: 1, scale: 1, xPercent: 0, duration: 1.35, ease: 'power3.out' })
      gsap.set(panels, { autoAlpha: 0, y: 34, pointerEvents: 'none' })
      gsap.set(panels[0], { autoAlpha: 1, y: 0, pointerEvents: 'auto' })
      gsap.set(processCards, { autoAlpha: 0, y: 24, pointerEvents: 'none' })
      const showPanel = (timeline, from, to, at) => {
        const exitDuration = .34
        timeline
          .to(from, { autoAlpha: 0, y: -18, pointerEvents: 'none', duration: exitDuration }, at)
          .fromTo(to, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, pointerEvents: 'auto', duration: .5 }, at + exitDuration)
      }
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: story,
          start: 'top top+=80',
          end: () => `+=${window.innerHeight * 5.75}`,
          pin: story,
          scrub: .7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      if (art) timeline.to(art, { xPercent: -5, yPercent: -3, scale: 1.035, duration: 1.15 }, 0)
      showPanel(timeline, panels[0], panels[1], 1.15)
      const firstStepAt = 1.49
      const exitDuration = .28
      const enterDuration = .42
      const holdDuration = .42
      let lastEnterAt = firstStepAt
      timeline.fromTo(processCards[0], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, pointerEvents: 'auto', duration: enterDuration }, firstStepAt)
      processCards.slice(1).forEach((card, index) => {
        const previous = processCards[index]
        const exitAt = lastEnterAt + enterDuration + holdDuration
        const enterAt = exitAt + exitDuration
        timeline.to(previous, { autoAlpha: 0, y: -18, pointerEvents: 'none', duration: exitDuration }, exitAt)
        timeline.fromTo(card, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, pointerEvents: 'auto', duration: enterDuration }, enterAt)
        lastEnterAt = enterAt
      })
      showPanel(timeline, panels[1], panels[2], lastEnterAt + enterDuration + holdDuration)
      if (art) timeline.to(art, { xPercent: -10, yPercent: 4, scale: 1.08, duration: .9 }, lastEnterAt)
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }, section)
    return () => ctx.revert()
  }, [language])
  return ref
}

function WorkOverview({ language, initialWorkSlug, initialFormat }) {
  const [format, setFormat] = useState(workFormats.some(([id]) => id === initialFormat) ? initialFormat : 'commercial')
  const [activeWork, setActiveWork] = useState(() => workProjects.find((work) => work.slug === initialWorkSlug) || null)
  const activeVideoRef = useRef(null)
  const workIntroRef = useWorkIntroMotion(language)
  const current = workFormats.find(([id]) => id === format)
  const items = workProjects.filter((work) => workFormatFor(work) === format)
  const t = copy[language]
  const localized = language === 'zh-Hant'
  const openWork = (work) => {
    flushSync(() => setActiveWork(work))
    if (work.photo) return
    const video = activeVideoRef.current
    if (!video) return
    video.defaultMuted = false
    video.muted = false
    video.play().catch(() => {})
  }
  return <>
    <main id="main" className="subpage subpage--light work-overview-page">
      <Container>
        {showWorkIntro && <section ref={workIntroRef} className={`work-intro work-intro--${language === 'en' ? 'en' : 'zh'}`} aria-labelledby="work-intro-title">
          <div className="work-intro-shell">
            <section className="work-hero">
              <div className="work-hero-art" aria-hidden="true"><img src={`${assets}work/work-botanical-macro.png`} alt="" /></div>
              <div className="work-intro-inner work-hero-copy">
                <p className="work-intro-kicker">AI FILM / STORY / PRODUCTION</p>
                <h2 id="work-intro-title">{t.workIntro.title}</h2>
                <p className="work-intro-lead">{t.workIntro.lead}</p>
                <p className="work-intro-context">{t.workIntro.context}</p>
              </div>
            </section>
            <div className="work-story work-intro-inner">
              <section className="work-story-part work-values" aria-label={t.workIntro.valuesLead}>
                <div className="work-values-intro"><h2>{t.workIntro.valuesTitle}</h2><p>{t.workIntro.valuesLead}</p></div>
                <div className="work-values-list">
                  {t.workIntro.values.map(([title, text]) => <article key={title} className="work-value"><h3>{title}</h3><p>{text}</p></article>)}
                </div>
                <div className="work-format-catalog"><h3>{t.workIntro.formatsTitle}</h3><p className="work-format-list">{t.workIntro.formats.map((item) => <span key={item}>{item}</span>)}</p></div>
              </section>
              <section className="work-story-part work-process" aria-label={t.workIntro.processLead}>
                <div className="work-process-intro"><h2>{t.workIntro.processTitle}</h2><p className="work-process-lead">{t.workIntro.processLead}</p></div>
                <div className="work-process-stage">
                  {t.workIntro.process.map(([title, description]) => <article key={title} tabIndex={0} className="work-process-card"><h3>{title}</h3><p>{description}</p></article>)}
                </div>
              </section>
              <section className="work-story-part work-scope" aria-labelledby="work-scope-title">
                <div className="work-scope-copy"><h2 id="work-scope-title">{t.workIntro.scopeTitle}</h2><p>{t.workIntro.scopeLead}</p></div>
                <ul className="work-scope-list">
                  {t.workIntro.scope.map(([title, text]) => <li key={title}><strong>{title}</strong><p>{text}</p></li>)}
                </ul>
              </section>
            </div>
          </div>
        </section>}
        <div className="work-format-tabs" role="tablist" aria-label={t.workFormats}>{workFormats.map(([id, label, , zhLabel, , zhHantLabel]) => <button key={id} type="button" role="tab" aria-selected={format === id} className={format === id ? 'is-active' : ''} onClick={() => setFormat(id)}>{language === 'en' ? label : localized ? zhHantLabel : zhLabel}</button>)}</div>
        <div className="work-format-heading"><span>{language === 'en' ? current[1] : localized ? current[5] : current[3]}</span><p>{language === 'en' ? current[2] : localized ? current[6] : current[4]}</p></div>
        {items.length ? <div className={`work-index work-index--${format}`}>{items.map((work, index) => <button type="button" className="work-index-card" onClick={() => openWork(work)} onPointerEnter={() => prewarmWorkVideo(work)} onPointerDown={() => prewarmWorkVideo(work)} onFocus={() => prewarmWorkVideo(work)} key={work.slug} aria-label={`${t.openWork}: ${work.name}`}><img src={work.poster} alt="" loading={index < 2 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} /><span>{String(index + 1).padStart(2, '0')}</span><div><em>{work.name}</em><strong>{work.brand}</strong><i>▶</i></div><small>{t.openWork} →</small></button>)}</div> : <p className="work-empty">{t.moreWork}</p>}
      </Container>
    </main>
    {activeWork && <WorkPlayerModal work={activeWork} language={language} initialMuted={false} playerRef={activeVideoRef} onClose={() => setActiveWork(null)} />}
  </>
}

function WorkDetail({ work }) {
  if (!work) return <NotFound />
  return <main id="main" className="subpage subpage--light"><Container><div className="detail-grid detail-grid--work"><div><PageHeader className="work-page-heading" eyebrow={work.brand} title={work.name} back="#/work" /><p className="detail-role">{work.category}</p><p className="detail-tags">Selected work · {work.photo ? 'Photography' : 'Film'}</p></div><div className={`detail-work-media ${work.portrait || work.photo ? 'detail-work-media--portrait' : ''}`}>{work.photo ? <img src={work.poster} alt={`${work.brand} — ${work.name}`} /> : <video controls playsInline preload="metadata" poster={work.poster} aria-label={`${work.brand} — ${work.name}`}><source src={work.video} type="video/mp4" /></video>}</div></div></Container></main>
}

function PricePage() {
  return <main id="main" className="price-page">
    <iframe
      className="price-frame"
      src="https://gt-ai-talent-rate-card.gthk-ai-2.chatgpt.site/?v=4"
      title="GreenTomato talent rate card"
      loading="eager"
    />
  </main>
}

function NotFound() { return <main id="main" className="subpage subpage--dark"><Container><PageHeader eyebrow="404" title="Not found." back="#/" /></Container></main> }

function Footer({ language }) { return <footer className="site-footer"><Container><a className="wordmark" href="#/">GreenTomato</a><span>© {new Date().getFullYear()} Green Tomato</span></Container></footer> }

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
    : route.type === 'artists' ? <ArtistsOverview language={language} focus={route.focus} />
      : route.type === 'artist-detail' ? <ArtistDetail artist={directoryArtists.find((artist) => artist.profile_slug === route.slug)} language={language} />
          : route.type === 'work' ? <WorkOverview language={language} initialWorkSlug={route.open} initialFormat={route.format} />
            : route.type === 'work-detail' ? <WorkDetail work={workProjects.find((work) => work.slug === route.slug)} />
              : route.type === 'price' ? <PricePage />
            : <NotFound />
  return <><a className="skip-link" href="#main">{t.skip}</a><Header language={language} setLanguage={setLanguage} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />{content}<Footer language={language} /></>
}

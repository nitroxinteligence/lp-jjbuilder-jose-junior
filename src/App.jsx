import { useEffect, useRef, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa6'
import BrandLogo from './BrandLogo'
import MeshDriftShader from './MeshDriftShader'
import SocialCards from './SocialCards'
import {
  LuChartNoAxesCombined,
  LuArrowDownRight,
  LuCheck,
  LuChevronLeft,
  LuChevronRight,
  LuFlaskConical,
  LuGlobe,
  LuGraduationCap,
  LuInstagram,
  LuLandmark,
  LuLightbulb,
  LuLinkedin,
  LuMicVocal,
  LuStar,
  LuTarget,
  LuYoutube,
} from 'react-icons/lu'

const galleryImages = [
  {
    src: '/jose-junior-gallery/01-palestra-igreja.webp',
    alt: 'José Junior palestrando com os braços abertos em uma igreja',
  },
  {
    src: '/jose-junior-gallery/02-corrida-praia.webp',
    alt: 'José Junior correndo à beira-mar',
  },
  {
    src: '/jose-junior-gallery/03-veneza-canal.webp',
    alt: 'José Junior em Veneza próximo a um canal',
  },
  {
    src: '/jose-junior-gallery/04-familia-natal.webp',
    alt: 'José Junior com sua família em uma celebração de Natal',
  },
  {
    src: '/jose-junior-gallery/05-familia-celebracao.webp',
    alt: 'José Junior com sua família em uma celebração',
  },
  {
    src: '/jose-junior-gallery/06-corrida-entardecer.webp',
    alt: 'José Junior correndo ao entardecer',
  },
  {
    src: '/jose-junior-gallery/07-palestra-aristoteles.webp',
    alt: 'José Junior palestrando diante de uma projeção de Aristóteles',
  },
  {
    src: '/jose-junior-gallery/08-veneza-basilica.webp',
    alt: 'José Junior diante da Basílica de São Marcos em Veneza',
  },
  {
    src: '/jose-junior-gallery/09-palestra-palco.webp',
    alt: 'José Junior caminhando durante uma palestra',
  },
  {
    src: '/jose-junior-gallery/10-entrevista-cafe.webp',
    alt: 'José Junior durante uma entrevista',
  },
  {
    src: '/jose-junior-gallery/11-masterchef.webp',
    alt: 'José Junior em visita ao estúdio MasterChef',
  },
]

const aboutImages = [
  {
    src: '/jose-junior-about/01-stanford-coo.webp',
    alt: 'José Junior durante o programa de COO em Stanford',
    caption: 'Programa de COO em Stanford',
  },
  {
    src: '/jose-junior-about/02-lideres-culturas.webp',
    alt: 'José Junior reunido com líderes de diferentes culturas',
    caption: 'Trocas com líderes de diferentes culturas',
  },
  {
    src: '/jose-junior-about/03-google-cultura.webp',
    alt: 'José Junior conhecendo a sede e a cultura da Google',
    caption: 'Que experiência conhecer o Google e sua cultura!',
  },
  {
    src: '/jose-junior-gallery/01-palestra-igreja.webp',
    alt: 'José Junior ministrando diante de uma comunidade cristã',
    caption: 'Vivendo em obediência ao Rei',
  },
  {
    src: '/jose-junior-gallery/05-familia-celebracao.webp',
    alt: 'José Junior ao lado de sua família em uma celebração',
    caption: 'Do topo à mesa',
  },
  {
    src: '/jose-junior-gallery/07-palestra-aristoteles.webp',
    alt: 'José Junior palestrando diante de uma projeção de Aristóteles',
    caption: 'Carreira é vocação',
  },
]

const academicBackground = [
  { icon: LuGraduationCap, label: 'Sistemas de Informação' },
  { icon: LuChartNoAxesCombined, label: 'MBA Gestão · FGV' },
  { icon: LuGlobe, label: 'CCO · Stanford' },
  { icon: LuFlaskConical, label: 'Mestrando · FDC' },
  { icon: LuLightbulb, label: 'Design Thinking' },
]

const credentials = [
  { value: 10, suffix: '+', label: 'Anos formando líderes' },
  {
    value: 5,
    suffix: 'k+',
    label: 'Profissionais transformados pelo método Builder',
  },
  {
    value: 210,
    suffix: '+',
    label: 'Anos de expertise combinada no time Builder',
  },
]

const portfolioItems = [
  {
    icon: LuLandmark,
    tag: 'Educação executiva',
    title: 'Builder School of Business',
    description: (
      <>
        Um laboratório, não uma escola de gestão. Você entra com o que já sabe.{' '}
        <strong>Sai sabendo o que precisava ter aprendido há anos.</strong> O
        resultado aparece no trabalho, no time e na conta.
      </>
    ),
    programs: [
      { name: 'Formação de Liderança' },
      { name: 'Programa de Imersão' },
      {
        name: 'Jornada de Empreendedorismo',
        sub: '↳ Da ideia ao negócio operando',
      },
    ],
    action: 'Quero saber mais',
  },
  {
    icon: LuTarget,
    tag: 'Mentoria individual',
    title: 'O Topo e a Mesa',
    description: (
      <>
        Para quem já chegou longe e percebeu que o próximo passo pede mais do
        que motivação. Pede um guia.{' '}
        <strong>Uma vaga. Um processo seletivo.</strong> Um trabalho que muda
        como você decide, lidera e vive.
      </>
    ),
    programs: [
      { name: 'Liderança como propósito' },
      { name: 'Resultados que aparecem na empresa' },
      { name: 'Família e carreira em equilíbrio' },
      { name: 'Impacto e legado na sociedade' },
    ],
    action: 'Quero me candidatar',
  },
  {
    icon: LuMicVocal,
    tag: 'Palestras',
    title: 'Alta Performance na sua empresa',
    description: (
      <>
        Sua equipe tem potencial. Falta o gatilho.{' '}
        <strong>
          Uma palestra que muda como as pessoas pensam, lideram e entregam
          resultado.
        </strong>{' '}
        Diferente daquela inspiração que some no café da tarde.
      </>
    ),
    programs: [
      { name: 'Quando Integridade Vira Influência' },
      { name: 'A Força das Conexões que Movem' },
      { name: 'Diversidade como Estratégia de Resultado' },
      { name: 'Carreira como Vocação' },
    ],
    action: 'Contratar palestra',
  },
]

function useRevealOnScroll() {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]')

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -7% 0px',
      },
    )

    elements.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
    }
  }, [])
}

function Hero() {
  return (
    <section className="hero" id="topo">
      <picture className="hero-media" aria-hidden="true">
        <source
          media="(max-width: 600px)"
          srcSet="/jose-junior-stanford-hero-mobile.webp"
        />
        <source
          media="(max-width: 1024px)"
          srcSet="/jose-junior-stanford-hero-tablet.webp"
        />
        <img
          src="/jose-junior-stanford-hero-desktop.webp"
          alt=""
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <div className="hero-content">
        <BrandLogo className="hero-brand-logo" data-reveal />
        <h1 data-reveal style={{ '--reveal-delay': '60ms' }}>
          Onde líderes
          <br />
          comuns param,
          <br />
          <em>
            Builders
            <br />
            começam
          </em>
        </h1>
        <p
          className="hero-sub"
          data-reveal
          style={{ '--reveal-delay': '120ms' }}
        >
          Você chegou longe executando. O problema é que executar melhor não
          vai te levar aonde você quer chegar.
        </p>
        <div
          className="hero-actions"
          data-reveal
          style={{ '--reveal-delay': '180ms' }}
        >
          <a href="#portfolio" className="hero-cta">
            <span>Ver meu trabalho</span>
            <span className="hero-cta-icon" aria-hidden="true">
              <LuArrowDownRight />
            </span>
          </a>
        </div>
        <div
          className="executive-credentials"
          data-reveal
          style={{ '--reveal-delay': '240ms' }}
        >
          <div className="executive-credentials-primary">
            <span className="executive-badge">
              <LuStar aria-hidden="true" />
              Executivo
            </span>
            <span className="executive-badge">
              <LuStar aria-hidden="true" />
              Empresário
            </span>
            <span className="executive-badge">
              <LuStar aria-hidden="true" />
              Advisor
            </span>
          </div>
          <span className="executive-badge executive-badge-founder">
            <LuStar aria-hidden="true" />
            Fundador da Builder School of Business
          </span>
        </div>
      </div>
    </section>
  )
}

function CountUp({ value, suffix }) {
  const [count, setCount] = useState(0)
  const numberRef = useRef(null)

  useEffect(() => {
    const element = numberRef.current
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      setCount(value)
      return undefined
    }

    let animationFrame
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        const duration = 1600
        const startTime = performance.now()

        const animate = (currentTime) => {
          const progress = Math.min((currentTime - startTime) / duration, 1)
          const easedProgress = 1 - (1 - progress) ** 4

          setCount(Math.round(value * easedProgress))

          if (progress < 1) animationFrame = requestAnimationFrame(animate)
        }

        animationFrame = requestAnimationFrame(animate)
        observer.disconnect()
      },
      { threshold: 0.45 },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(animationFrame)
    }
  }, [value])

  return (
    <span className="metric-number" ref={numberRef} aria-hidden="true">
      {count}
      {suffix}
    </span>
  )
}

function Metrics() {
  return (
    <section className="metrics" aria-label="Números da experiência Builder">
      <MeshDriftShader />
      <div className="metrics-grid">
        {credentials.map((credential, index) => (
          <div
            className="metric"
            key={credential.label}
            aria-label={`${credential.value}${credential.suffix} ${credential.label}`}
            data-reveal
            style={{ '--reveal-delay': `${index * 60}ms` }}
          >
            <CountUp value={credential.value} suffix={credential.suffix} />
            <span className="metric-label">{credential.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function PhotoReel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoplayCycle, setAutoplayCycle] = useState(0)
  const activeImage = aboutImages[activeIndex]

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) return undefined

    const autoplay = window.setTimeout(() => {
      setActiveIndex((currentIndex) =>
        (currentIndex + 1) % aboutImages.length,
      )
    }, 3000)

    return () => window.clearTimeout(autoplay)
  }, [activeIndex, autoplayCycle])

  const selectImage = (direction) => {
    setActiveIndex((currentIndex) =>
      direction === 'next'
        ? (currentIndex + 1) % aboutImages.length
        : (currentIndex - 1 + aboutImages.length) % aboutImages.length,
    )
    setAutoplayCycle((cycle) => cycle + 1)
  }

  return (
    <div
      className="photo-reel"
      role="region"
      aria-roledescription="carrossel"
      aria-label="Experiências acadêmicas e profissionais de José Junior"
    >
      <div className="photo-reel-window" aria-live="polite">
        <figure className="photo-reel-frame" key={activeImage.src}>
          <img
            src={activeImage.src}
            alt={activeImage.alt}
            loading="eager"
            decoding="async"
          />
          <figcaption>{activeImage.caption}</figcaption>
        </figure>
      </div>

      <div className="photo-reel-controls" aria-label="Navegação das fotos">
        <button
          type="button"
          className="fan-arrow"
          onClick={() => selectImage('previous')}
          aria-label="Foto anterior"
        >
          <LuChevronLeft aria-hidden="true" />
        </button>

        <div className="photo-reel-pagination" aria-hidden="true">
          {aboutImages.map((image, index) => (
            <span
              className={index === activeIndex ? 'is-active' : undefined}
              key={image.src}
            />
          ))}
        </div>

        <button
          type="button"
          className="fan-arrow"
          onClick={() => selectImage('next')}
          aria-label="Próxima foto"
        >
          <LuChevronRight aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

function About() {
  return (
    <section className="bio" id="quem-sou">
      <div className="bio-photo" data-reveal="left">
        <PhotoReel />
      </div>
      <div
        className="bio-content"
        data-reveal="right"
        style={{ '--reveal-delay': '60ms' }}
      >
        <div className="section-label">José Junior</div>
        <h2>
          Passei 20 anos dentro
          <br />
          do jogo. <span className="heading-accent">Aprendi o que</span>
          <br />
          <em>ninguém te conta</em>
        </h2>

        <p>
          Executivo, empreendedor serial e advisor. Estive em boardrooms,
          planos de carreira e crises de empresa. Na prática, aprendi o que
          nenhum MBA sozinho te conta:{' '}
          <strong>
            chegar longe não depende só de competência. Depende de saber
            liderar pessoas, incluindo você mesmo.
          </strong>
        </p>

        <p>
          Criei a <strong>Builder School</strong> e a{' '}
          <strong>Comunidade Builder</strong> depois de ver de perto o que
          acontece quando alguém descobre como liderar com propósito real. A
          carreira muda. A família percebe. A empresa sente.
        </p>

        <p>
          Existe um ponto onde mais esforço não resolve. Você sente que tem
          mais a dar, mas falta clareza sobre como chegar lá.{' '}
          <strong>É aí que eu entro.</strong>
        </p>

      </div>
    </section>
  )
}

function Education() {
  return (
    <section className="education" aria-labelledby="education-title">
      <div className="education-heading" data-reveal="left">
        <h2 id="education-title">Formação acadêmica</h2>
      </div>
      <div className="education-list">
        {academicBackground.map((item, index) => (
          <div
            className="education-item"
            key={item.label}
            data-reveal="right"
            style={{ '--reveal-delay': `${index * 60}ms` }}
          >
            <span className="education-icon" aria-hidden="true">
              <item.icon />
            </span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function TrajectoryCards() {
  const cards = galleryImages.map((image) => ({
    imgUrl: image.src,
    alt: image.alt,
  }))

  return <SocialCards cards={cards} />
}

function PortfolioCard({ item, index }) {
  const Icon = item.icon

  return (
    <div
      className="card-reveal"
      data-reveal
      style={{ '--reveal-delay': `${index * 60}ms` }}
    >
      <article className="card">
        <div className="card-heading">
          <div className="card-meta">
            <div className="card-icon" aria-hidden="true">
              <Icon />
            </div>
            <div className="card-tag">{item.tag}</div>
          </div>
          <h3>{item.title}</h3>
        </div>
        <p>{item.description}</p>
        <ul className="card-programs" aria-label={`O que inclui ${item.title}`}>
          {item.programs.map((program) => (
            <li key={program.name}>
              <span className="prog-name">
                <LuCheck aria-hidden="true" />
                {program.name}
              </span>
              {program.sub && <span className="prog-sub">{program.sub}</span>}
            </li>
          ))}
        </ul>
        <a href="#contato" className="btn-card">
          {item.action}
        </a>
      </article>
    </div>
  )
}

function Portfolio() {
  return (
    <section className="portfolio" id="portfolio">
      <div className="portfolio-header" data-reveal>
        <div className="section-label section-label-centered">Meu trabalho</div>
        <h2>
          O que faço e{' '}
          <em>
            como
            <br />
            posso te ajudar
          </em>
        </h2>
        <p>Onde você está hoje define por onde começar.</p>
      </div>
      <div className="portfolio-grid">
        {portfolioItems.map((item, index) => (
          <PortfolioCard item={item} index={index} key={item.title} />
        ))}
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="cta-section" id="contato">
      <MeshDriftShader />
      <div className="cta-content" data-reveal="scale">
        <h2>
          Por onde você
          <br />
          <em>começa?</em>
        </h2>
        <p>
          Me conta onde está hoje. A gente descobre juntos o que faz mais sentido
          para o seu momento. Escola, mentoria ou palestra. Sem enrolação.
        </p>
        <a
          href="https://wa.me/5531983042705"
          className="btn-primary"
          target="_blank"
          rel="noreferrer"
        >
          <span className="whatsapp-icon" aria-hidden="true">
            <FaWhatsapp />
          </span>
          Falar no WhatsApp
        </a>
      </div>
    </section>
  )
}

function ClosingStatement() {
  return (
    <section className="closing-statement">
      <img
        className="closing-statement-image"
        src="/jose-junior-closing-group.webp"
        alt="José Junior reunido com líderes de diferentes culturas"
        loading="lazy"
        decoding="async"
      />
      <div className="closing-statement-content">
        <h2 data-reveal="scale">
          O próximo nível não pede mais esforço.
          <br />
          <em>Pede uma liderança à altura.</em>
        </h2>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer>
      <div className="footer-brand">
        <a href="#topo" className="footer-logo" aria-label="JJ Builder — voltar ao início">
          <BrandLogo />
        </a>
      </div>
      <div className="footer-bottom">
        <div className="footer-social" aria-label="Redes sociais">
          <a
            href="https://www.instagram.com/josejuniorbuilder"
            target="_blank"
            rel="noreferrer"
          >
            <LuInstagram aria-hidden="true" />
            <span>Instagram</span>
          </a>
          <a
            href="https://www.youtube.com/@ocodigobuilder"
            target="_blank"
            rel="noreferrer"
          >
            <LuYoutube aria-hidden="true" />
            <span>YouTube</span>
          </a>
          <a
            href="https://www.linkedin.com/in/joseraimundojunior/"
            target="_blank"
            rel="noreferrer"
          >
            <LuLinkedin aria-hidden="true" />
            <span>LinkedIn</span>
          </a>
        </div>
        <div className="footer-copy">
          © 2026 José Junior Builder. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  useRevealOnScroll()

  return (
    <>
      <main>
        <Hero />
        <Metrics />
        <About />
        <TrajectoryCards />
        <Education />
        <Portfolio />
        <Contact />
        <ClosingStatement />
      </main>
      <Footer />
    </>
  )
}

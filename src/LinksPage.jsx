import { useEffect } from 'react'
import BrandLogo from './BrandLogo'
import MeshDriftShader from './MeshDriftShader'
import './links.css'

const links = [
  {
    title: 'Curso: Liderança Vocacional',
    description: 'Descubra sua vocação e desenvolva uma liderança com direção, propósito e impacto.',
    art: 'liderança',
    artAccent: 'vocacional',
    theme: 'charcoal',
  },
  {
    title: 'Formação: Liderança Builder para Alta Performance',
    description: 'Uma jornada de liderança Builder para elevar a performance de pessoas e equipes.',
    art: 'liderança',
    artAccent: 'builder',
    theme: 'orange',
  },
  {
    title: 'Imersão Presencial: líder de si, líder do outro',
    description: 'Uma experiência presencial para liderar a si mesmo e transformar suas relações.',
    art: 'líder de si',
    artAccent: 'líder do outro',
    theme: 'brown',
  },
  {
    title: 'Mentoria Individual',
    description: 'Conversas individuais para trazer clareza às suas decisões e aos próximos passos.',
    art: 'mentoria',
    artAccent: 'individual',
    theme: 'orange',
  },
  {
    title: 'Palestras',
    description: 'Perspectivas sobre liderança, cultura e performance para provocar novas conversas.',
    art: 'ideias',
    artAccent: 'em movimento',
    theme: 'charcoal',
  },
  {
    title: 'YouTube',
    description: 'Ideias e conversas sobre liderança, carreira e desenvolvimento humano.',
    href: 'https://www.youtube.com/@ocodigobuilder',
    art: 'o código',
    artAccent: 'builder',
    theme: 'orange',
  },
]

export default function LinksPage() {
  useEffect(() => {
    document.title = 'Links | José Junior Builder'
  }, [])

  return (
    <main className="links-page">
      <div className="links-page__hero-effect" aria-hidden="true">
        <MeshDriftShader />
      </div>
      <header className="links-page__header">
        <h1 className="links-page__heading">
          <a className="links-page__wordmark" href="https://www.jjbuilder.com.br/" aria-label="José Junior Builder — página principal">
            <BrandLogo className="links-page__logo" />
          </a>
        </h1>

        <div className="links-page__portrait">
          <img src="/jose-junior-bio.webp" alt="José Junior" fetchPriority="high" />
        </div>

        <p className="links-page__intro">
          <span>LIDERANÇA · PROPÓSITO · PERFORMANCE</span>
        </p>
      </header>

      <nav className="links-page__cards" aria-label="Links de José Junior">
        {links.map((link) => {
          const CardElement = link.href ? 'a' : 'article'

          return (
          <CardElement
            className={`links-card links-card--${link.theme}${link.href ? '' : ' links-card--disabled'}`}
            key={link.title}
            {...(link.href ? {
              href: link.href,
              target: '_blank',
              rel: 'noopener noreferrer',
              'aria-label': `${link.title} — assistir agora (abre em nova aba)`,
            } : {})}
          >
            <span className="links-card__art" aria-hidden="true">
              <span className="links-card__art-title">
                {link.art}
                <strong>{link.artAccent}</strong>
              </span>
            </span>

            <div className="links-card__copy">
              <h2 className="links-card__title">{link.title}</h2>
              <span className="links-card__description">{link.description}</span>
              {link.href && (
                <span className="links-card__action">
                  ASSISTIR AGORA
                  <b aria-hidden="true">→</b>
                </span>
              )}
            </div>
          </CardElement>
          )
        })}
      </nav>

      <footer className="links-page__footer">© {new Date().getFullYear()} José Junior Builder</footer>
    </main>
  )
}

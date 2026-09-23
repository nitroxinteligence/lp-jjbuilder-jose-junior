import { useEffect, useState } from 'react'
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
    href: 'https://www.jjbuilder.com.br/lideres',
    action: 'CONHECER FORMAÇÃO',
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
  const [openTooltip, setOpenTooltip] = useState(null)

  const toggleBlockedCard = (title) => {
    setOpenTooltip((current) => current === title ? null : title)
  }

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

        <p className="links-page__name">José Júnior</p>

        <p className="links-page__intro">
          <span>LIDERANÇA · PROPÓSITO · PERFORMANCE</span>
        </p>
      </header>

      <nav className="links-page__cards" aria-label="Links de José Junior">
        {links.map((link) => {
          const CardElement = link.href ? 'a' : 'article'

          return (
          <CardElement
            className={`links-card links-card--${link.theme}${link.href ? '' : ' links-card--disabled'}${openTooltip === link.title ? ' links-card--tooltip-open' : ''}`}
            key={link.title}
            {...(link.href ? {
              href: link.href,
              target: '_blank',
              rel: 'noopener noreferrer',
              'aria-label': `${link.title} — ${(link.action || 'ASSISTIR AGORA').toLocaleLowerCase('pt-BR')} (abre em nova aba)`,
            } : {
              role: 'button',
              tabIndex: 0,
              'aria-label': `${link.title} — em breve`,
              onClick: () => toggleBlockedCard(link.title),
              onKeyDown: (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  toggleBlockedCard(link.title)
                }
              },
              onBlur: () => setOpenTooltip(null),
            })}
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
                  {link.action || 'ASSISTIR AGORA'}
                  <b aria-hidden="true">→</b>
                </span>
              )}
            </div>
            {!link.href && (
              <span className="links-card__tooltip" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="10" width="14" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                EM BREVE
              </span>
            )}
          </CardElement>
          )
        })}
      </nav>

      <footer className="links-page__footer">
        <a
          className="links-page__footer-logo"
          href="https://www.jjbuilder.com.br/"
          aria-label="JJ Builder — página principal"
        >
          <BrandLogo />
        </a>
        <p>© 2026 José Junior Builder. Todos os direitos reservados.</p>
      </footer>
    </main>
  )
}

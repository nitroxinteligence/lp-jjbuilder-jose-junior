import { useEffect } from 'react'
import { LuLockKeyhole } from 'react-icons/lu'
import './links.css'

const links = [
  {
    label: 'CURSO ONLINE',
    title: 'Curso: Liderança Vocacional',
    description: 'Descubra sua vocação e desenvolva uma liderança com direção, propósito e impacto.',
    action: 'EM BREVE',
    art: 'liderança',
    artAccent: 'vocacional',
    theme: 'charcoal',
  },
  {
    label: 'FORMAÇÃO',
    title: 'Formação: Liderança Builder para Alta Performance',
    description: 'Uma jornada de liderança Builder para elevar a performance de pessoas e equipes.',
    action: 'EM BREVE',
    art: 'liderança',
    artAccent: 'builder',
    theme: 'orange',
  },
  {
    label: 'IMERSÃO PRESENCIAL',
    title: 'Imersão Presencial: líder de si, líder do outro',
    description: 'Uma experiência presencial para liderar a si mesmo e transformar suas relações.',
    action: 'EM BREVE',
    art: 'líder de si',
    artAccent: 'líder do outro',
    theme: 'brown',
  },
  {
    label: 'ACOMPANHAMENTO',
    title: 'Mentoria Individual',
    description: 'Conversas individuais para trazer clareza às suas decisões e aos próximos passos.',
    action: 'EM BREVE',
    art: 'mentoria',
    artAccent: 'individual',
    theme: 'orange',
  },
  {
    label: 'PARA SEU EVENTO',
    title: 'Palestras',
    description: 'Perspectivas sobre liderança, cultura e performance para provocar novas conversas.',
    action: 'EM BREVE',
    art: 'ideias',
    artAccent: 'em movimento',
    theme: 'charcoal',
  },
  {
    label: 'CONTEÚDO GRATUITO',
    title: 'YouTube',
    description: 'Ideias e conversas sobre liderança, carreira e desenvolvimento humano.',
    action: 'ASSISTIR AGORA',
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
      <header className="links-page__header">
        <h1 className="links-page__heading">
          <a className="links-page__wordmark" href="https://www.jjbuilder.com.br/" aria-label="José Junior Builder — página principal">
            <span className="links-page__wordmark-kicker">BUILDER</span>
            <span className="links-page__wordmark-name">josé junior</span>
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
              'aria-label': `${link.title} — ${link.action.toLocaleLowerCase('pt-BR')} (abre em nova aba)`,
            } : {})}
          >
            <span className="links-card__art" aria-hidden="true">
              <span className="links-card__art-type">JOSÉ JUNIOR · BUILDER</span>
              <span className="links-card__art-title">
                {link.art}
                <strong>{link.artAccent}</strong>
              </span>
              <span className="links-card__art-mark">JJ<span>↗</span></span>
            </span>

            <div className="links-card__copy">
              <span className="links-card__label">{link.label}</span>
              <h2 className="links-card__title">{link.title}</h2>
              <span className="links-card__description">{link.description}</span>
              <span className="links-card__action">
                <span aria-hidden="true" />
                {link.action}
                {link.href ? <b aria-hidden="true">→</b> : <LuLockKeyhole aria-hidden="true" />}
              </span>
            </div>
          </CardElement>
          )
        })}
      </nav>

      <footer className="links-page__footer">© {new Date().getFullYear()} José Junior Builder</footer>
    </main>
  )
}

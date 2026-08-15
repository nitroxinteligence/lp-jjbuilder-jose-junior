import { useEffect, useRef, useState } from 'react'
import {
  LuArrowRight,
  LuBrainCircuit,
  LuBriefcaseBusiness,
  LuCheck,
  LuChevronDown,
  LuChevronLeft,
  LuCircleAlert,
  LuHeartHandshake,
  LuInstagram,
  LuLeaf,
  LuLinkedin,
  LuSparkles,
  LuUsers,
  LuX,
  LuYoutube,
} from 'react-icons/lu'
import BrandLogo from './BrandLogo'
import MeshDriftShader from './MeshDriftShader'

const applicationSteps = [
  { label: 'Você', shortLabel: 'Perfil' },
  { label: 'Seu momento', shortLabel: 'Momento' },
  { label: 'Decisão', shortLabel: 'Decisão' },
]

const initialApplication = {
  name: '',
  email: '',
  phone: '',
  role: '',
  moment: '',
  goal: '',
  investment: '',
  commitment: '',
}

const validationMessages = {
  name: 'Informe seu nome completo.',
  email: 'Informe seu melhor e-mail.',
  phone: 'Informe seu WhatsApp com DDD.',
  role: 'Informe seu cargo e empresa atual.',
  moment: 'Selecione o momento que melhor descreve você.',
  goal: 'Conte qual mudança você quer alcançar.',
  investment: 'Selecione sua disponibilidade de investimento.',
  commitment: 'Selecione sua disponibilidade para participar da formação.',
}

function formatWhatsApp(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (!digits) return ''
  if (digits.length <= 2) return `(${digits}`

  const areaCode = digits.slice(0, 2)
  const number = digits.slice(2)
  if (number.length <= 4) return `(${areaCode}) ${number}`

  const prefixLength = number.length > 8 ? 5 : 4
  return `(${areaCode}) ${number.slice(0, prefixLength)}-${number.slice(prefixLength)}`
}

const programFacts = [
  ['03', 'meses de formação'],
  ['30', 'líderes por turma'],
  ['08', 'módulos'],
  ['06', 'encontros ao vivo'],
]

const pillars = [
  {
    icon: LuBriefcaseBusiness,
    title: 'Vocação e direção',
    text: 'Clareza para decidir onde colocar energia e construir uma carreira coerente com o valor que você quer gerar.',
  },
  {
    icon: LuBrainCircuit,
    title: 'Autoconhecimento',
    text: 'Consciência das forças que impulsionam sua liderança e dos padrões que hoje limitam seu próximo nível.',
  },
  {
    icon: LuLeaf,
    title: 'Performance sustentável',
    text: 'Família, saúde, fé e relacionamentos como fontes de presença, discernimento e capacidade de entrega.',
  },
  {
    icon: LuUsers,
    title: 'Pessoas e cultura',
    text: 'Equipes mais autônomas, responsáveis e produtivas, sem depender de um líder que centraliza tudo.',
  },
  {
    icon: LuSparkles,
    title: 'Futuro e IA',
    text: 'Lentes para interpretar mudanças, construir cenários e preparar pessoas e processos para o que vem pela frente.',
  },
  {
    icon: LuHeartHandshake,
    title: 'Impacto e legado',
    text: 'Influência transformada em valor para a organização, para a comunidade e para além do resultado imediato.',
  },
]

const outcomes = [
  'Direcionar energia para o que realmente gera valor.',
  'Delegar melhor e reduzir a dependência excessiva da equipe.',
  'Conduzir conversas difíceis com clareza e coragem.',
  'Manter qualidade de decisão mesmo sob pressão.',
  'Interpretar tendências e preparar a carreira para o futuro.',
  'Construir resultados que não destruam a confiança no processo.',
]

const modules = [
  'Vocação, sentido e direção',
  'Autoconhecimento e protagonismo de carreira',
  'Estratégia e liderança de futuros',
  'Performance sustentável: família, saúde e prioridades',
  'Confiança e coragem para liderar',
  'Pessoas, equipes e cultura de resultado',
  'Influência, mudança e geração de valor',
  'Impacto social, licença social e legado',
]

function CustomSelect({ name, value, options, placeholder, onChange, invalid, shaking }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    const closeOnOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false)
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [isOpen])

  const selectOption = (option) => {
    onChange({ target: { name, value: option } })
    setActiveIndex(options.indexOf(option))
    setIsOpen(false)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      setIsOpen(false)
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      setIsOpen(true)
      setActiveIndex((current) => {
        const start = current < 0 ? options.indexOf(value) : current
        return Math.min(Math.max(start + direction, 0), options.length - 1)
      })
      return
    }

    if ((event.key === 'Enter' || event.key === ' ') && isOpen) {
      event.preventDefault()
      selectOption(options[Math.max(activeIndex, 0)])
    }
  }

  return (
    <div className={`leaders-custom-select ${isOpen ? 'is-open' : ''} ${shaking ? 'is-shaking' : ''}`.trim()} ref={rootRef}>
      <button
        type="button"
        name={name}
        className="leaders-custom-select-trigger"
        onClick={() => {
          setIsOpen((current) => !current)
          setActiveIndex(value ? options.indexOf(value) : 0)
        }}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-invalid={invalid}
      >
        <span className={value ? '' : 'is-placeholder'}>{value || placeholder}</span>
        <LuChevronDown aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="leaders-custom-select-menu" role="listbox" aria-label="Momento atual">
          {options.map((option, index) => (
            <button
              type="button"
              role="option"
              aria-selected={value === option}
              className={`${value === option ? 'is-selected' : ''} ${activeIndex === index ? 'is-active' : ''}`.trim()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => selectOption(option)}
              key={option}
            >
              <span>{option}</span>
              {value === option && <LuCheck aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ApplicationModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState(initialApplication)
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(null)
  const [shakingField, setShakingField] = useState(null)
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const previousFocusRef = useRef(null)
  const toastTimeoutRef = useRef(null)
  const shakeStartTimeoutRef = useRef(null)
  const shakeStopTimeoutRef = useRef(null)

  useEffect(() => {
    if (isOpen) return
    window.clearTimeout(toastTimeoutRef.current)
    window.clearTimeout(shakeStartTimeoutRef.current)
    window.clearTimeout(shakeStopTimeoutRef.current)
    setToast(null)
    setErrors({})
    setShakingField(null)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return undefined

    previousFocusRef.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.setTimeout(() => closeButtonRef.current?.focus(), 0)

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') return
      const focusable = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])',
      )
      if (!focusable?.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const updateField = (event) => {
    const { name, value } = event.target
    const nextValue = name === 'phone' ? formatWhatsApp(value) : value
    setData((current) => ({ ...current, [name]: nextValue }))
    setErrors((current) => {
      if (!current[name]) return current

      let isValid = Boolean(nextValue.trim())
      if (name === 'email') isValid = /^\S+@\S+\.\S+$/.test(nextValue)
      if (name === 'phone') isValid = [10, 11].includes(nextValue.replace(/\D/g, '').length)
      if (!isValid) return current

      const nextErrors = { ...current }
      delete nextErrors[name]
      return nextErrors
    })
    if (shakingField === name) setShakingField(null)
  }

  const showToast = (message) => {
    window.clearTimeout(toastTimeoutRef.current)
    setToast({ id: Date.now(), message })
    toastTimeoutRef.current = window.setTimeout(() => setToast(null), 3600)
  }

  const shakeField = (field) => {
    window.clearTimeout(shakeStartTimeoutRef.current)
    window.clearTimeout(shakeStopTimeoutRef.current)
    setShakingField(null)
    shakeStartTimeoutRef.current = window.setTimeout(() => {
      setShakingField(field)
      shakeStopTimeoutRef.current = window.setTimeout(() => setShakingField(null), 520)
    }, 0)
  }

  const currentFields = [
    ['name', 'email', 'phone'],
    ['role', 'moment', 'goal'],
    ['investment', 'commitment'],
  ][step]

  const validateStep = () => {
    const nextErrors = {}
    currentFields.forEach((field) => {
      if (!data[field].trim()) nextErrors[field] = validationMessages[field]
    })

    if (step === 0 && data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
      nextErrors.email = 'Informe um e-mail válido.'
    }

    const phoneDigits = data.phone.replace(/\D/g, '')
    if (step === 0 && data.phone && ![10, 11].includes(phoneDigits.length)) {
      nextErrors.phone = 'Informe um WhatsApp válido com DDD.'
    }

    const firstError = Object.keys(nextErrors)[0]
    if (firstError) {
      setErrors(nextErrors)
      showToast(nextErrors[firstError])
      shakeField(firstError)
      window.setTimeout(() => dialogRef.current?.querySelector(`[name="${firstError}"]`)?.focus(), 0)
      return false
    }

    setErrors({})
    return true
  }

  const goForward = (event) => {
    event.preventDefault()
    if (!validateStep()) return
    window.clearTimeout(toastTimeoutRef.current)
    setErrors({})
    setToast(null)
    setShakingField(null)
    setStep((current) => Math.min(current + 1, applicationSteps.length - 1))
    window.setTimeout(() => dialogRef.current?.querySelector('input, textarea, [name="moment"]')?.focus(), 0)
  }

  const submitApplication = (event) => {
    event.preventDefault()
    if (!validateStep()) return

    const message = [
      'Olá, Junior. Quero aplicar para a Formação Líder de Futuros.',
      '',
      `Nome: ${data.name}`,
      `E-mail: ${data.email}`,
      `Telefone: ${data.phone}`,
      `Cargo/empresa: ${data.role}`,
      `Momento atual: ${data.moment}`,
      `Objetivo: ${data.goal}`,
      `Investimento: ${data.investment}`,
      `Compromisso: ${data.commitment}`,
    ].join('\n')

    window.open(`https://wa.me/5531983042705?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="leaders-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      {toast && (
        <div className="leaders-toast" role="alert" aria-live="assertive" key={toast.id}>
          <LuCircleAlert aria-hidden="true" />
          <span>{toast.message}</span>
        </div>
      )}
      <div
        className="leaders-modal"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="leaders-form-title"
      >
        <div className="leaders-form-progress" aria-label={`Etapa ${step + 1} de ${applicationSteps.length}`}>
          {applicationSteps.map((item, index) => (
            <div className={`leaders-progress-item ${index <= step ? 'is-active' : ''}`} key={item.label}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <small>{item.shortLabel}</small>
            </div>
          ))}
          <button ref={closeButtonRef} type="button" className="leaders-modal-close leaders-progress-close" onClick={onClose} aria-label="Fechar formulário">
            <LuX aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={submitApplication} noValidate>
          <div className="leaders-form-heading">
            <h2 id="leaders-form-title">
              {step === 0 && <>Vamos começar <strong>por você.</strong></>}
              {step === 1 && <>Onde sua liderança <strong>precisa chegar?</strong></>}
              {step === 2 && <>Uma decisão exige <strong>clareza.</strong></>}
            </h2>
            <p>
              {step === 0 && 'Seus dados serão usados apenas para dar continuidade à sua aplicação.'}
              {step === 1 && 'Queremos entender seu contexto, não avaliar respostas perfeitas.'}
              {step === 2 && 'A aplicação não garante uma vaga. Ela inicia nossa conversa de seleção.'}
            </p>
          </div>

          <div className="leaders-form-fields">
            {step === 0 && (
              <>
                <label>
                  Nome completo
                  <input className={shakingField === 'name' ? 'is-shaking' : undefined} name="name" value={data.name} onChange={updateField} autoComplete="name" placeholder="Como podemos chamar você?" aria-invalid={Boolean(errors.name)} />
                </label>
                <label>
                  Melhor e-mail
                  <input className={shakingField === 'email' ? 'is-shaking' : undefined} name="email" type="email" value={data.email} onChange={updateField} autoComplete="email" inputMode="email" placeholder="voce@empresa.com" aria-invalid={Boolean(errors.email)} />
                </label>
                <label>
                  WhatsApp
                  <input className={shakingField === 'phone' ? 'is-shaking' : undefined} name="phone" type="tel" value={data.phone} onChange={updateField} autoComplete="tel" inputMode="numeric" maxLength="15" placeholder="(00) 00000-0000" aria-invalid={Boolean(errors.phone)} />
                </label>
              </>
            )}

            {step === 1 && (
              <>
                <label>
                  Qual é seu cargo e empresa hoje?
                  <input className={shakingField === 'role' ? 'is-shaking' : undefined} name="role" value={data.role} onChange={updateField} autoComplete="organization-title" placeholder="Ex.: Diretor de Operações, Empresa X" aria-invalid={Boolean(errors.role)} />
                </label>
                <label>
                  O que melhor descreve seu momento atual?
                  <CustomSelect
                    name="moment"
                    value={data.moment}
                    onChange={updateField}
                    placeholder="Selecione uma opção"
                    invalid={Boolean(errors.moment)}
                    shaking={shakingField === 'moment'}
                    options={[
                      'Estou crescendo, mas centralizo decisões demais',
                      'Entrego resultados, mas o ritmo não é sustentável',
                      'Quero preparar minha carreira e equipe para o futuro',
                      'Busco mais clareza de vocação e direção',
                      'Vivo outro desafio de liderança',
                    ]}
                  />
                </label>
                <label>
                  Qual mudança você quer alcançar nos próximos 12 meses?
                  <textarea className={shakingField === 'goal' ? 'is-shaking' : undefined} name="goal" value={data.goal} onChange={updateField} rows="4" maxLength="600" placeholder="Conte de forma objetiva o resultado que faria diferença para você." aria-invalid={Boolean(errors.goal)} />
                </label>
              </>
            )}

            {step === 2 && (
              <>
                <fieldset className={`${errors.investment ? 'is-invalid' : ''} ${shakingField === 'investment' ? 'is-shaking' : ''}`.trim()}>
                  <legend>Se for selecionado, você tem disponibilidade para investir a partir de R$ 10 mil na formação?</legend>
                  <div className="leaders-radio-grid">
                    {['Sim, tenho disponibilidade', 'Preciso avaliar condições', 'Não neste momento'].map((option) => (
                      <label className={`leaders-radio ${data.investment === option ? 'is-selected' : ''}`} key={option}>
                        <input type="radio" name="investment" value={option} checked={data.investment === option} onChange={updateField} />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <fieldset className={`${errors.commitment ? 'is-invalid' : ''} ${shakingField === 'commitment' ? 'is-shaking' : ''}`.trim()}>
                  <legend>Você consegue se comprometer com encontros ao vivo, workshops e aplicação prática durante três meses?</legend>
                  <div className="leaders-radio-grid leaders-radio-grid-two">
                    {['Sim, consigo me comprometer', 'Preciso alinhar minha agenda'].map((option) => (
                      <label className={`leaders-radio ${data.commitment === option ? 'is-selected' : ''}`} key={option}>
                        <input type="radio" name="commitment" value={option} checked={data.commitment === option} onChange={updateField} />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </>
            )}
          </div>

          <div className="leaders-form-actions">
            {step > 0 ? (
              <button type="button" className="leaders-form-back" onClick={() => { setStep((current) => current - 1); setErrors({}) }}>
                <LuChevronLeft aria-hidden="true" /> Voltar
              </button>
            ) : <span />}
            {step < applicationSteps.length - 1 ? (
              <button key="continue" type="button" className="leaders-form-next" onClick={goForward}>
                Continuar <LuArrowRight aria-hidden="true" />
              </button>
            ) : (
              <button key="submit" type="submit" className="leaders-form-next">
                Enviar aplicação <LuArrowRight aria-hidden="true" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

function ApplyButton({ children, className = '', onClick }) {
  return (
    <button type="button" className={`leaders-apply-button ${className}`.trim()} onClick={onClick}>
      <span>{children}</span>
      <span className="leaders-apply-icon" aria-hidden="true"><LuArrowRight /></span>
    </button>
  )
}

export default function LideresPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Líder de Futuros | JJ Builder'
    return () => { document.title = previousTitle }
  }, [])

  return (
    <div className="leaders-page">
      <main>
        <section className="leaders-hero" id="inicio">
          <div className="leaders-hero-glow" aria-hidden="true" />
          <picture className="leaders-hero-media" aria-hidden="true">
            <source media="(max-width: 650px)" type="image/avif" srcSet="/jose-junior-stanford-hero-mobile-enhanced.avif" />
            <source media="(max-width: 650px)" type="image/webp" srcSet="/jose-junior-stanford-hero-mobile.webp" />
            <source media="(max-width: 1024px)" type="image/avif" srcSet="/jose-junior-stanford-hero-tablet-enhanced.avif" />
            <source media="(max-width: 1024px)" type="image/webp" srcSet="/jose-junior-stanford-hero-tablet.webp" />
            <source type="image/avif" srcSet="/jose-junior-stanford-hero-desktop-enhanced.avif" />
            <img src="/jose-junior-stanford-hero-desktop.webp" alt="" fetchPriority="high" decoding="async" />
          </picture>
          <div className="leaders-shell leaders-hero-content">
            <a href="/" className="leaders-hero-logo" aria-label="JJ Builder — página principal" data-reveal>
              <BrandLogo />
            </a>
            <h1 data-reveal style={{ '--reveal-delay': '60ms' }}>
              Lidere com propósito.<br />
              Entregue resultados.<br />
              <strong>Preserve o que sustenta<br />sua vida.</strong>
            </h1>
            <p data-reveal style={{ '--reveal-delay': '120ms' }}>
              Uma formação de três meses para líderes que querem gerar mais valor, preparar-se para o futuro e alcançar resultados duradouros sem abrir mão da família, dos valores e da própria saúde.
            </p>
            <div data-reveal style={{ '--reveal-delay': '180ms' }}>
              <ApplyButton onClick={() => setIsFormOpen(true)}>Quero fazer parte da próxima turma</ApplyButton>
            </div>
            <span className="leaders-hero-note" data-reveal style={{ '--reveal-delay': '220ms' }}>
              Processo seletivo · Turma limitada a 30 líderes
            </span>
          </div>
        </section>

        <section className="leaders-thesis">
          <div className="leaders-shell leaders-thesis-grid">
            <div data-reveal>
              <h2>Resultado duradouro exige um líder que <strong>também consiga durar.</strong></h2>
            </div>
            <div className="leaders-thesis-copy" data-reveal style={{ '--reveal-delay': '80ms' }}>
              <p>Há líderes que cresceram porque aprenderam a suportar pressão, resolver problemas e assumir responsabilidades. Mas, com o tempo, as mesmas características que impulsionaram a carreira podem começar a cobrar um preço alto.</p>
              <p><strong>A solução não é diminuir sua ambição.</strong> É amadurecer sua forma de liderar: direcionar energia, desenvolver pessoas, preservar suas fontes de sustentação e tomar decisões pensando além do resultado imediato.</p>
            </div>
          </div>
          <div className="leaders-facts leaders-shell" aria-label="Informações da formação">
            {programFacts.map(([value, label], index) => (
              <div key={label} data-reveal style={{ '--reveal-delay': `${index * 55}ms` }}>
                <strong>{value}</strong><span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="leaders-pillars">
          <div className="leaders-shell">
            <div className="leaders-section-heading" data-reveal>
              <h2>O que sustenta sua vida também pode <strong>sustentar sua performance.</strong></h2>
              <p>Vocação, autoconhecimento, família e fé são o método. Alta performance, valor e resultados duradouros são parte da entrega.</p>
            </div>
            <div className="leaders-pillars-grid">
              {pillars.map((pillar, index) => (
                <article key={pillar.title} data-reveal style={{ '--reveal-delay': `${(index % 3) * 55}ms` }}>
                  <span className="leaders-pillar-icon" aria-hidden="true"><pillar.icon /></span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="leaders-journey">
          <div className="leaders-shell leaders-journey-grid">
            <div className="leaders-journey-intro" data-reveal>
              <h2>Três meses para transformar <strong>clareza em prática.</strong></h2>
              <p>Aulas gravadas, encontros ao vivo, workshops, desenvolvimento entre pares e um projeto de impacto social construído com uma comunidade.</p>
              <ApplyButton onClick={() => setIsFormOpen(true)}>Quero viver essa jornada</ApplyButton>
            </div>
            <ol className="leaders-module-list">
              {modules.map((module, index) => (
                <li key={module} data-reveal style={{ '--reveal-delay': `${(index % 4) * 40}ms` }}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{module}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="leaders-results">
          <div className="leaders-shell leaders-results-grid">
            <div className="leaders-results-copy" data-reveal>
              <h2>Alta performance que <strong>pode ser sustentada.</strong></h2>
              <p>Alta performance não é viver permanentemente no limite. É entregar valor com clareza, consistência e responsabilidade, sem destruir as pessoas, a confiança ou a própria vida no processo.</p>
              <ul>
                {outcomes.map((outcome) => <li key={outcome}><LuCheck aria-hidden="true" />{outcome}</li>)}
              </ul>
            </div>
            <figure className="leaders-results-image" data-reveal style={{ '--reveal-delay': '80ms' }}>
              <img src="/jose-junior-performance-stage.avif" alt="José Junior conduzindo uma palestra sobre liderança e integridade" loading="lazy" decoding="async" />
              <figcaption>
                <blockquote>“Resultado e humanidade não são escolhas opostas.”</blockquote>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="leaders-mentor">
          <picture aria-hidden="true">
            <source media="(min-width: 901px)" srcSet="/jose-junior-postits-wide-treated.avif" />
            <img src="/jose-junior-postits-original.avif" alt="" className="leaders-mentor-background" loading="lazy" decoding="async" />
          </picture>
          <div className="leaders-shell leaders-mentor-content" data-reveal>
            <h2>Experiência real para quem está diante de <strong>decisões reais.</strong></h2>
            <p>Executivo, empreendedor serial, advisor e fundador da Builder School of Business. Depois de 20 anos dentro do jogo, Junior construiu esta formação para líderes que querem continuar crescendo sem colocar tudo o que importa na conta do sucesso.</p>
            <div className="leaders-mentor-proof">
              <span>CCO · Stanford</span><span>MBA Gestão · FGV</span><span>10+ anos formando líderes</span>
            </div>
          </div>
        </section>

        <section className="leaders-final">
          <div className="leaders-final-mesh" aria-hidden="true" />
          <div className="leaders-shell leaders-final-content" data-reveal>
            <h2>O próximo nível da sua carreira exige uma <strong>nova forma de viver e liderar.</strong></h2>
            <p>Se você quer gerar mais valor, preparar-se para o futuro e construir resultados que possam durar, dê o primeiro passo. A aplicação é objetiva e leva poucos minutos.</p>
            <ApplyButton className="leaders-apply-button-light" onClick={() => setIsFormOpen(true)}>Iniciar minha aplicação</ApplyButton>
          </div>
        </section>
      </main>

      <footer className="leaders-footer">
        <MeshDriftShader />
        <div className="leaders-footer-main">
          <span>Formação Líder de Futuros</span>
          <a href="#inicio" className="leaders-footer-logo" aria-label="JJ Builder — voltar ao início"><BrandLogo /></a>
        </div>

        <div className="leaders-footer-bottom">
          <nav className="leaders-footer-social" aria-label="Redes sociais">
            <a href="https://www.instagram.com/josejuniorbuilder" target="_blank" rel="noreferrer">
              <LuInstagram aria-hidden="true" /><span>Instagram</span>
            </a>
            <a href="https://www.youtube.com/@ocodigobuilder" target="_blank" rel="noreferrer">
              <LuYoutube aria-hidden="true" /><span>YouTube</span>
            </a>
            <a href="https://www.linkedin.com/in/joseraimundojunior/" target="_blank" rel="noreferrer">
              <LuLinkedin aria-hidden="true" /><span>LinkedIn</span>
            </a>
          </nav>

          <div className="leaders-footer-meta">
            <nav className="leaders-footer-legal" aria-label="Informações legais">
              <a href="/politica-de-privacidade">Política de Privacidade</a>
              <a href="/termos-de-uso">Termos de Uso</a>
            </nav>
            <p>© 2026 José Junior Builder. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      <ApplicationModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  )
}

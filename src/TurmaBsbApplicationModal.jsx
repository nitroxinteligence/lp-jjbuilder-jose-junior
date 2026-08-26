import { useEffect, useRef, useState } from 'react'
import { LuArrowRight, LuCircleAlert, LuX } from 'react-icons/lu'

const initialApplication = {
  name: '',
  phone: '',
  company: '',
  role: '',
  investment: '',
}

const validationMessages = {
  name: 'Informe seu nome completo.',
  phone: 'Informe seu celular com DDD.',
  company: 'Informe a empresa em que você atua.',
  role: 'Informe seu cargo atual.',
  investment: 'Selecione sua faixa de investimento.',
}

const investmentOptions = [
  'Até R$ 7 mil',
  'De R$ 7 mil a R$ 12 mil',
  'De R$ 13 mil a R$ 16 mil',
  'R$ 20 mil ou mais',
]

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (!digits) return ''
  if (digits.length <= 2) return `(${digits}`

  const areaCode = digits.slice(0, 2)
  const number = digits.slice(2)
  if (number.length <= 4) return `(${areaCode}) ${number}`

  const prefixLength = number.length > 8 ? 5 : 4
  return `(${areaCode}) ${number.slice(0, prefixLength)}-${number.slice(prefixLength)}`
}

export default function TurmaBsbApplicationModal({ isOpen, onClose }) {
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

    document.body.classList.remove('bsb-modal-open')
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
    document.body.classList.add('bsb-modal-open')
    window.setTimeout(() => closeButtonRef.current?.focus(), 0)

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') return
      const focusable = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), input:not([disabled])',
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
      document.body.classList.remove('bsb-modal-open')
      document.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const updateField = (event) => {
    const { name, value } = event.target
    const nextValue = name === 'phone' ? formatPhone(value) : value

    setData((current) => ({ ...current, [name]: nextValue }))
    setErrors((current) => {
      if (!current[name]) return current

      const isValid = name === 'phone'
        ? [10, 11].includes(nextValue.replace(/\D/g, '').length)
        : Boolean(nextValue.trim())

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

  const validateApplication = () => {
    const nextErrors = {}

    Object.keys(initialApplication).forEach((field) => {
      if (!data[field].trim()) nextErrors[field] = validationMessages[field]
    })

    const phoneDigits = data.phone.replace(/\D/g, '')
    if (data.phone && ![10, 11].includes(phoneDigits.length)) {
      nextErrors.phone = 'Informe um celular válido com DDD.'
    }

    const firstError = Object.keys(nextErrors)[0]
    if (firstError) {
      setErrors(nextErrors)
      showToast(nextErrors[firstError])
      shakeField(firstError)
      window.setTimeout(
        () => dialogRef.current?.querySelector(`[name="${firstError}"]`)?.focus(),
        0,
      )
      return false
    }

    setErrors({})
    return true
  }

  const submitApplication = (event) => {
    event.preventDefault()
    if (!validateApplication()) return

    const message = [
      'Olá, Junior! Quero garantir minha vaga na próxima turma da Formação de Liderança da Builder School of Business.',
      '',
      `Nome: ${data.name}`,
      `Celular: ${data.phone}`,
      `Empresa: ${data.company}`,
      `Cargo: ${data.role}`,
      `Faixa de investimento: ${data.investment}`,
    ].join('\n')

    window.open(
      `https://wa.me/5531983042705?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  return (
    <div
      className="leaders-modal-backdrop bsb-application-modal"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
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
        aria-labelledby="bsb-form-title"
      >
        <div className="bsb-modal-topbar">
          <div>
            <span>Builder School of Business</span>
            <strong>Candidatura · Turma BSB</strong>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="leaders-modal-close"
            onClick={onClose}
            aria-label="Fechar formulário"
          >
            <LuX aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={submitApplication} noValidate>
          <div className="leaders-form-heading">
            <h2 id="bsb-form-title">
              Garanta sua vaga na <strong>próxima turma.</strong>
            </h2>
            <p>
              Preencha seus dados. Ao enviar, o WhatsApp será aberto com suas
              respostas prontas para iniciar a conversa com o Junior.
            </p>
          </div>

          <div className="leaders-form-fields bsb-form-fields">
            <div className="bsb-form-row">
              <label>
                Nome completo
                <input
                  className={shakingField === 'name' ? 'is-shaking' : undefined}
                  name="name"
                  value={data.name}
                  onChange={updateField}
                  autoComplete="name"
                  placeholder="Como podemos chamar você?"
                  aria-invalid={Boolean(errors.name)}
                />
              </label>
              <label>
                Celular com DDD
                <input
                  className={shakingField === 'phone' ? 'is-shaking' : undefined}
                  name="phone"
                  type="tel"
                  value={data.phone}
                  onChange={updateField}
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength="15"
                  placeholder="(00) 00000-0000"
                  aria-invalid={Boolean(errors.phone)}
                />
              </label>
            </div>

            <div className="bsb-form-row">
              <label>
                Empresa
                <input
                  className={shakingField === 'company' ? 'is-shaking' : undefined}
                  name="company"
                  value={data.company}
                  onChange={updateField}
                  autoComplete="organization"
                  placeholder="Nome da empresa"
                  aria-invalid={Boolean(errors.company)}
                />
              </label>
              <label>
                Cargo
                <input
                  className={shakingField === 'role' ? 'is-shaking' : undefined}
                  name="role"
                  value={data.role}
                  onChange={updateField}
                  autoComplete="organization-title"
                  placeholder="Seu cargo atual"
                  aria-invalid={Boolean(errors.role)}
                />
              </label>
            </div>

            <fieldset
              className={`${errors.investment ? 'is-invalid' : ''} ${
                shakingField === 'investment' ? 'is-shaking' : ''
              }`.trim()}
            >
              <legend>Quanto você está disposto(a) a investir na sua formação?</legend>
              <div className="leaders-radio-grid bsb-investment-grid">
                {investmentOptions.map((option) => (
                  <label
                    className={`leaders-radio ${data.investment === option ? 'is-selected' : ''}`}
                    key={option}
                  >
                    <input
                      type="radio"
                      name="investment"
                      value={option}
                      checked={data.investment === option}
                      onChange={updateField}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="leaders-form-actions bsb-form-actions">
            <span>Seus dados seguem apenas na mensagem do WhatsApp.</span>
            <button type="submit" className="leaders-form-next">
              Enviar <LuArrowRight aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

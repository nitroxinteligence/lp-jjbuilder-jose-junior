function BrandMark({ className = '', title }) {
  const labelled = Boolean(title)

  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      role={labelled ? 'img' : undefined}
      aria-hidden={labelled ? undefined : 'true'}
      aria-label={labelled ? title : undefined}
    >
      <path
        d="M8 16H28V38C28 49.6 21.6 56 10 56H6V46H10C15.4 46 18 43.4 18 38V26H8V16Z"
        fill="currentColor"
      />
      <path
        d="M34 8H58V35C58 48.5 50.5 56 37 56H30V46H37C44.2 46 48 42.2 48 35V18H34V8Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function BrandLogo({ className = '', ...props }) {
  return (
    <span className={`brand-logo ${className}`.trim()} {...props}>
      <span className="brand-logo-symbol" aria-hidden="true">
        <BrandMark className="brand-logo-mark" />
      </span>
      <strong className="brand-logo-wordmark" aria-hidden="true">Builder</strong>
      <span className="sr-only">JJ Builder</span>
    </span>
  )
}

export { BrandMark }

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'

const MAX_VISIBLE = 7
const HALF = 3

const FAN_POSITIONS = [
  { rotation: -21, scale: 0.78, x: -30, y: 7.3, zIndex: 1 },
  { rotation: -14, scale: 0.85, x: -22, y: 4, zIndex: 2 },
  { rotation: -7, scale: 0.935, x: -11, y: 1.3, zIndex: 3 },
  { rotation: 0, scale: 1, x: 0, y: 0, zIndex: 10 },
  { rotation: 7, scale: 0.935, x: 11, y: 1.3, zIndex: 3 },
  { rotation: 14, scale: 0.85, x: 22, y: 4, zIndex: 2 },
  { rotation: 21, scale: 0.78, x: 30, y: 7.3, zIndex: 1 },
]

function getWidthMultiplier(width) {
  if (width < 480) return 0.28
  if (width < 640) return 0.38
  if (width < 768) return 0.5
  if (width < 1024) return 0.75
  return 1
}

function getHeightMultiplier(width) {
  let idealHeight

  if (width < 480) idealHeight = 352
  else if (width < 640) idealHeight = 416
  else if (width < 768) idealHeight = 448
  else if (width < 1024) idealHeight = 544
  else idealHeight = 608

  return Math.min(1, (window.innerHeight * 0.7) / idealHeight)
}

function getSlotConfig(totalCards, slot) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot]

  const center = totalCards >> 1
  const distance = totalCards > 1 ? (slot - center) / center : 0
  const absoluteDistance = Math.abs(distance)

  return {
    rotation: distance * 21,
    scale: 1 - 0.2244 * absoluteDistance * absoluteDistance,
    x: distance * 30,
    y: absoluteDistance * absoluteDistance * 7.3,
    zIndex: 10 - Math.abs(slot - center),
  }
}

function Chevron({ direction }) {
  const points = direction === 'left' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <polyline points={points} />
    </svg>
  )
}

export default function SocialCards({ cards }) {
  const containerRef = useRef(null)
  const isAnimating = useRef(false)
  const hasEntered = useRef(false)
  const directionRef = useRef(null)
  const previousVisible = useRef(new Set())

  const totalCards = cards.length
  const needsPagination = totalCards > MAX_VISIBLE
  const [centerIndex, setCenterIndex] = useState(
    needsPagination ? HALF : totalCards >> 1,
  )

  const getVisibleMap = useCallback(
    (center) => {
      const map = new Map()

      if (!needsPagination) {
        cards.forEach((_, index) => map.set(index, index))
        return map
      }

      for (let slot = 0; slot < MAX_VISIBLE; slot += 1) {
        const cardIndex =
          ((center + slot - HALF) % totalCards + totalCards) % totalCards
        map.set(cardIndex, slot)
      }

      return map
    },
    [cards, needsPagination, totalCards],
  )

  const visibleMap = useMemo(
    () => getVisibleMap(centerIndex),
    [centerIndex, getVisibleMap],
  )

  const cycle = useCallback(
    (direction) => {
      if (isAnimating.current || !needsPagination) return

      isAnimating.current = true
      directionRef.current = direction
      setCenterIndex((current) =>
        direction === 'right'
          ? (current + 1) % totalCards
          : (current - 1 + totalCards) % totalCards,
      )
    },
    [needsPagination, totalCards],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container || !totalCards) return undefined

    const cardElements = Array.from(container.querySelectorAll('.fan-card'))
    if (!cardElements.length) return undefined

    const previouslyVisible = previousVisible.current
    const direction = directionRef.current
    const isFirstMount = !hasEntered.current
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards
    const config = (slot) => getSlotConfig(slotCount, slot)

    const positionCards = ({ animate = true, hoveredSlot = null } = {}) => {
      const widthMultiplier = getWidthMultiplier(window.innerWidth)
      const heightMultiplier = getHeightMultiplier(window.innerWidth)
      const visibleEntries = []

      cardElements.forEach((element, cardIndex) => {
        const slot = visibleMap.get(cardIndex)
        if (slot !== undefined) visibleEntries.push({ element, slot })
      })

      visibleEntries.sort((a, b) => a.slot - b.slot)
      const centerSlot = visibleEntries.length >> 1

      visibleEntries.forEach(({ element, slot }) => {
        const base = config(slot)
        const distance = hoveredSlot === null ? 0 : Math.abs(slot - hoveredSlot)
        let targetX = base.x * widthMultiplier * 16
        let targetY = base.y * heightMultiplier * 16
        let targetRotation = base.rotation
        let targetScale = base.scale

        if (hoveredSlot !== null) {
          if (slot === hoveredSlot) {
            targetY -= 34 * heightMultiplier
            targetScale *= 1.075
          } else {
            const normalized =
              centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0
            const push =
              112 *
              (1 - Math.abs(normalized)) *
              (1 + 0.18 * Math.max(0, 3 - distance))

            targetX += slot < hoveredSlot ? -push * widthMultiplier : push * widthMultiplier
            targetRotation +=
              slot < hoveredSlot ? -3 / (distance + 1) : 3 / (distance + 1)
          }
        }

        const target = {
          x: targetX,
          y: targetY,
          rotation: targetRotation,
          scale: targetScale,
          opacity: 1,
          zIndex: hoveredSlot === slot ? 20 : base.zIndex,
        }

        if (!animate || prefersReducedMotion) {
          gsap.set(element, target)
          return
        }

        gsap.to(element, {
          ...target,
          duration: hoveredSlot === null ? 0.48 : 0.52,
          delay: hoveredSlot === null ? 0 : distance * 0.018,
          ease: hoveredSlot === null ? 'power3.out' : 'elastic.out(1, 0.78)',
          overwrite: 'auto',
        })
      })
    }

    if (isFirstMount) {
      isAnimating.current = true
      const widthMultiplier = getWidthMultiplier(window.innerWidth)
      const heightMultiplier = getHeightMultiplier(window.innerWidth)

      cardElements.forEach((card, cardIndex) => {
        const slot = visibleMap.get(cardIndex)

        if (slot === undefined) {
          gsap.set(card, { opacity: 0, scale: 0.3, zIndex: 0 })
          return
        }

        const target = config(slot)
        gsap.set(card, {
          x: 0,
          y: 150 * heightMultiplier,
          rotation: 0,
          scale: 0.55,
          opacity: 0,
        })
        gsap.to(card, {
          x: target.x * widthMultiplier * 16,
          y: target.y * heightMultiplier * 16,
          rotation: target.rotation,
          scale: target.scale,
          opacity: 1,
          zIndex: target.zIndex,
          duration: prefersReducedMotion ? 0 : 1.05,
          delay: prefersReducedMotion ? 0 : 0.12 + slot * 0.055,
          ease: 'elastic.out(1.05, 0.78)',
          onComplete: () => {
            if (slot === visibleMap.size - 1) {
              isAnimating.current = false
              hasEntered.current = true
            }
          },
        })
      })

      if (prefersReducedMotion) {
        isAnimating.current = false
        hasEntered.current = true
      }
    } else {
      let completedVisible = 0

      cardElements.forEach((card, cardIndex) => {
        const slot = visibleMap.get(cardIndex)
        const wasVisible = previouslyVisible.has(cardIndex)

        if (slot !== undefined) {
          const widthMultiplier = getWidthMultiplier(window.innerWidth)
          const heightMultiplier = getHeightMultiplier(window.innerWidth)
          const target = config(slot)

          if (!wasVisible) {
            gsap.set(card, {
              x: direction === 'right' ? 580 : -580,
              y: target.y * heightMultiplier * 16,
              rotation: direction === 'right' ? 28 : -28,
              scale: 0.55,
              opacity: 0,
            })
          }

          gsap.to(card, {
            x: target.x * widthMultiplier * 16,
            y: target.y * heightMultiplier * 16,
            rotation: target.rotation,
            scale: target.scale,
            opacity: 1,
            zIndex: target.zIndex,
            duration: prefersReducedMotion ? 0 : 0.52,
            ease: 'power3.out',
            overwrite: 'auto',
            onComplete: () => {
              completedVisible += 1
              if (completedVisible >= visibleMap.size) isAnimating.current = false
            },
          })
        } else if (wasVisible) {
          gsap.to(card, {
            x: direction === 'right' ? -580 : 580,
            rotation: direction === 'right' ? -28 : 28,
            scale: 0.55,
            opacity: 0,
            zIndex: 0,
            duration: prefersReducedMotion ? 0 : 0.38,
            ease: 'power2.in',
            overwrite: 'auto',
          })
        }
      })
    }

    previousVisible.current = new Set(visibleMap.keys())

    let activeSlot = null
    let leaveTimer
    const enterHandlers = []

    cardElements.forEach((element, cardIndex) => {
      const slot = visibleMap.get(cardIndex)
      if (slot === undefined) return

      const onEnter = () => {
        if (isAnimating.current) return
        window.clearTimeout(leaveTimer)
        activeSlot = slot
        positionCards({ hoveredSlot: slot })
      }

      const onFocus = () => onEnter()
      element.addEventListener('mouseenter', onEnter)
      element.addEventListener('focusin', onFocus)
      enterHandlers.push({ element, onEnter, onFocus })
    })

    const resetFan = () => {
      if (isAnimating.current) return
      window.clearTimeout(leaveTimer)
      leaveTimer = window.setTimeout(() => {
        activeSlot = null
        positionCards()
      }, 45)
    }

    const onResize = () => {
      if (!isAnimating.current) {
        positionCards({ animate: false, hoveredSlot: activeSlot })
      }
    }

    container.addEventListener('mouseleave', resetFan)
    container.addEventListener('focusout', resetFan)
    window.addEventListener('resize', onResize)

    return () => {
      window.clearTimeout(leaveTimer)
      enterHandlers.forEach(({ element, onEnter, onFocus }) => {
        element.removeEventListener('mouseenter', onEnter)
        element.removeEventListener('focusin', onFocus)
      })
      container.removeEventListener('mouseleave', resetFan)
      container.removeEventListener('focusout', resetFan)
      window.removeEventListener('resize', onResize)
      gsap.killTweensOf(cardElements)
    }
  }, [needsPagination, totalCards, visibleMap])

  if (!totalCards) return null

  return (
    <section
      className="social-cards-section"
      aria-labelledby="social-cards-title"
    >
      <div className="social-cards-heading" data-reveal>
        <div className="section-label section-label-centered">Em movimento</div>
        <h2 id="social-cards-title">
          <em>Uma trajetória construída</em>
          <br />
          por inteiro
        </h2>
      </div>

      <div className="fan-stage">
        <div className="fan-layout" ref={containerRef} role="list">
          {cards.map((card, index) => {
            const slot = visibleMap.get(index)
            const image = (
              <span className="fan-card-media">
                <img
                  src={card.imgUrl}
                  alt={slot === undefined ? '' : card.alt || `Registro ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                />
              </span>
            )

            if (card.linkUrl) {
              return (
                <a
                  className="fan-card"
                  href={card.linkUrl}
                  key={card.imgUrl}
                  target={card.linkUrl.startsWith('http') ? '_blank' : undefined}
                  rel={card.linkUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                  role="listitem"
                  aria-hidden={slot === undefined}
                  tabIndex={slot === undefined ? -1 : 0}
                >
                  {image}
                </a>
              )
            }

            return (
              <figure
                className="fan-card"
                key={card.imgUrl}
                role="listitem"
                aria-hidden={slot === undefined}
                tabIndex={slot === undefined ? -1 : 0}
              >
                {image}
              </figure>
            )
          })}
        </div>
      </div>

      {needsPagination && (
        <div className="fan-controls" aria-label="Navegação da galeria">
          <button
            type="button"
            className="fan-arrow"
            onClick={() => cycle('left')}
            aria-label="Imagem anterior"
          >
            <Chevron direction="left" />
          </button>

          <div className="fan-pagination" aria-hidden="true">
            {cards.map((card, index) => (
              <span
                className={index === centerIndex ? 'is-active' : undefined}
                key={card.imgUrl}
              />
            ))}
          </div>

          <button
            type="button"
            className="fan-arrow"
            onClick={() => cycle('right')}
            aria-label="Próxima imagem"
          >
            <Chevron direction="right" />
          </button>
        </div>
      )}
    </section>
  )
}

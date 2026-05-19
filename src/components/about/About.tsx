'use client'
import { useEffect, useRef, useState } from 'react'
import { getAbout } from '@/lib/firestore'
import { parseHighlight } from '@/lib/highlights'
import type { AboutData } from '@/types'

export default function About() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState<AboutData | null>(null)

  useEffect(() => {
    getAbout().then(d => setData(d))
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const paragraphs = data?.paragraphs ?? []
  const cards = [
    { label: 'Current Focus', value: data?.focus ?? 'Software Architecture', sub: data?.focusSub ?? '' },
    { label: 'Primary Stack', value: data?.stack ?? 'Full-Stack + Mobile', sub: data?.stackSub ?? '' },
    { label: 'Industry Domains', value: data?.domains ?? 'SaaS · Fintech · E-Commerce', sub: data?.domainsSub ?? '' },
  ]

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(30px)',
    transition: `opacity 0.7s ${delay}s ease, transform 0.7s ${delay}s ease`,
  })

  return (
    <section id="about" ref={ref} style={{
      padding: '6rem 4rem',
      background: 'var(--bg2)',
    }}>
      {/* Header */}
      <div style={{ ...fadeUp(0) }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem', letterSpacing: '0.25em',
          textTransform: 'uppercase', color: 'var(--gold)',
          marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
        }}>
          <span style={{ width: '20px', height: '1px', background: 'var(--gold)', display: 'inline-block' }} />
          01 — About
        </div>
        <h2 style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
          fontWeight: 600, color: 'var(--text)', lineHeight: 1.15,
          marginBottom: '1rem',
        }}>
          The Architect<br />
          <em style={{ color: 'var(--gold)' }}>Behind the Build</em>
        </h2>
        <div style={{ width: '60px', height: '1px', background: 'var(--gold-dim)', marginBottom: '4rem' }} />
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '4rem',
        alignItems: 'start',
      }}>
        {/* Text */}
        <div style={{ ...fadeUp(0.1) }}>
          {paragraphs.map((para, i) => (
            <p
              key={i}
              style={{
                color: 'var(--text-dim)', lineHeight: 1.9,
                marginBottom: '1.2rem', fontSize: '1rem',
              }}
            >
              {/* Parse HTML and highlights */}
              {parseHighlight(para).map((part, j) =>
                typeof part === 'string' ? (
                  <span
                    key={j}
                    dangerouslySetInnerHTML={{ __html: part }}
                  />
                ) : (
                  <span key={j}>{part}</span>
                )
              )}
            </p>
          ))}
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {cards.map((card, i) => (
            <div 
              key={card.label} 
              className={`reveal reveal-delay-${Math.min(i + 1, 3)}`}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                padding: '1.75rem',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-gold)'
                e.currentTarget.style.background = 'var(--surface2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.background = 'var(--surface)'
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0,
                width: '3px', height: '100%',
                background: 'var(--gold)',
              }} />
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', color: 'var(--gold)',
                marginBottom: '0.6rem',
              }}>{card.label}</div>
              <div style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.4rem', fontWeight: 500,
                color: 'var(--text)', marginBottom: '0.25rem',
              }}>{card.value}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{card.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
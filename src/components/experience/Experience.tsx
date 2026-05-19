'use client'
import { useEffect, useRef, useState } from 'react'
import { getExperience } from '@/lib/firestore'
import { parseHighlight } from '@/lib/highlights'
import type { Experience as ExpType } from '@/types'

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [experiences, setExperiences] = useState<ExpType[]>([])

  useEffect(() => {
    getExperience().then(d => setExperiences(d))
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="experience" ref={ref} style={{ padding: '6rem 4rem', background: 'var(--bg2)' }}>
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.7s ease',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
          letterSpacing: '0.25em', textTransform: 'uppercase',
          color: 'var(--gold)', marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
        }}>
          <span style={{ width: '20px', height: '1px', background: 'var(--gold)', display: 'inline-block' }} />
          03 — Experience
        </div>
        <h2 style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
          fontWeight: 600, color: 'var(--text)', lineHeight: 1.15, marginBottom: '1rem',
        }}>
          Work<br /><em style={{ color: 'var(--gold)' }}>History</em>
        </h2>
        <div style={{ width: '60px', height: '1px', background: 'var(--gold-dim)', marginBottom: '4rem' }} />
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: '1px',
          background: 'linear-gradient(to bottom, var(--gold), transparent)',
        }} />

        {experiences.map((exp, i) => (
          <TimelineItem key={i} exp={exp} />
        ))}
      </div>
    </section>
  )
}

function TimelineItem({ exp }: {
  exp: ExpType
}) {
  const [dotHovered, setDotHovered] = useState(false)

  return (
    <div 
      className="reveal timeline-item"
      style={{
        position: 'relative',
        paddingLeft: '3rem',
        paddingBottom: '4rem',
      }}
    >
      {/* Dot */}
      <div
        onMouseEnter={() => setDotHovered(true)}
        onMouseLeave={() => setDotHovered(false)}
        style={{
          position: 'absolute', left: '-6px', top: '6px',
          width: '13px', height: '13px', borderRadius: '50%',
          border: '2px solid var(--gold)',
          background: dotHovered ? 'var(--gold)' : 'var(--bg2)',
          transition: 'background 0.3s',
          cursor: 'pointer',
        }}
      />

      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
        letterSpacing: '0.15em', textTransform: 'uppercase',
        color: 'var(--gold)', marginBottom: '0.5rem',
      }}>{exp.period}</div>

      <div style={{
        fontFamily: 'var(--font-cormorant)',
        fontSize: '1.7rem', fontWeight: 600,
        color: 'var(--text)', marginBottom: '0.25rem', lineHeight: 1.2,
      }}>{exp.role}</div>

      <div style={{
        fontSize: '0.9rem', color: 'var(--text-dim)',
        fontStyle: 'italic', marginBottom: '1.25rem',
      }}>
        {exp.company}
        <span style={{
          fontFamily: 'var(--font-mono)', fontStyle: 'normal',
          fontSize: '0.7rem', letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--text-muted)',
          marginLeft: '0.75rem',
        }}>{exp.type}</span>
      </div>

      <ul style={{ listStyle: 'none', marginBottom: '1.25rem' }}>
        {exp.bullets.map((b, i) => (
          <li key={i} style={{
            color: 'var(--text-dim)', fontSize: '0.95rem',
            lineHeight: 1.8, marginBottom: '0.4rem',
            paddingLeft: '1.25rem', position: 'relative',
          }}>
            <span style={{
              position: 'absolute', left: 0,
              color: 'var(--gold)',
            }}>—</span>
            {/* Apply highlighting to bullet points */}
            {parseHighlight(b).map((part, j) =>
              typeof part === 'string' ? part : <span key={j}>{part}</span>
            )}
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {exp.stack.map(tag => (
          <span key={tag} style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            letterSpacing: '0.05em', color: 'var(--text-muted)',
            border: '1px solid var(--border)', padding: '0.2rem 0.6rem',
          }}>{tag}</span>
        ))}
      </div>
    </div>
  )
}
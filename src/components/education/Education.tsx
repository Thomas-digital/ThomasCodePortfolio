'use client'
import { useEffect, useRef, useState } from 'react'
import { getEducation } from '@/lib/firestore'
import type { Education as EduType } from '@/types'

export default function Education() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [eduData, setEduData] = useState<EduType[]>([])

  useEffect(() => {
    getEducation().then(d => setEduData(d))
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="education" ref={ref} style={{ padding: '6rem 4rem', background: 'var(--bg2)' }}>
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
          05 — Education
        </div>
        <h2 style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
          fontWeight: 600, color: 'var(--text)', lineHeight: 1.15, marginBottom: '1rem',
        }}>
          Academic<br /><em style={{ color: 'var(--gold)' }}>Foundation</em>
        </h2>
        <div style={{ width: '60px', height: '1px', background: 'var(--gold-dim)', marginBottom: '4rem' }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
      }}>
        {eduData.map((edu, i) => (
          <EduCard key={i} edu={edu} />
        ))}
      </div>
    </section>
  )
}

function EduCard({ edu }: {
  edu: EduType
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="reveal"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${hovered ? 'var(--border-gold)' : 'var(--border)'}`,
        padding: '2rem',
        position: 'relative',
        transition: 'all 0.3s',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '2px', height: '40px', background: 'var(--gold)',
      }} />

      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
        letterSpacing: '0.15em', textTransform: 'uppercase',
        color: 'var(--gold)', marginBottom: '0.75rem',
      }}>{edu.period}</div>

      <div style={{
        fontFamily: 'var(--font-cormorant)',
        fontSize: '1.3rem', fontWeight: 600,
        color: 'var(--text)', marginBottom: '0.15rem',
      }}>{edu.degree}</div>

      <div style={{
        fontFamily: 'var(--font-cormorant)',
        fontSize: '1rem', fontStyle: 'italic',
        color: 'var(--text-dim)', marginBottom: '0.5rem',
      }}>{edu.field}</div>

      <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontStyle: 'italic', marginBottom: '0.5rem' }}>
        {edu.school}
      </div>

      {edu.grade && (
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--gold-dim)', marginBottom: '0.5rem',
        }}>Grade: {edu.grade}</div>
      )}

      {edu.notes && (
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          {edu.notes}
        </p>
      )}
    </div>
  )
}
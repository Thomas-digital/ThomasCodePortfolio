'use client'
import { useEffect, useRef, useState } from 'react'
import { getSkills } from '@/lib/firestore'
import type { Skill } from '@/types'

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [skillData, setSkillData] = useState<Skill[]>([])

  useEffect(() => {
    getSkills().then(d => setSkillData(d))
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="skills" ref={ref} style={{ padding: '6rem 4rem', background: 'var(--bg)' }}>
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
          02 — Skills
        </div>
        <h2 style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
          fontWeight: 600, color: 'var(--text)', lineHeight: 1.15, marginBottom: '1rem',
        }}>
          Technical<br /><em style={{ color: 'var(--gold)' }}>Arsenal</em>
        </h2>
        <div style={{ width: '60px', height: '1px', background: 'var(--gold-dim)', marginBottom: '4rem' }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
      }}>
        {skillData.map((cat, i) => (
          <SkillCard 
            key={cat.category} 
            cat={cat} 
            delayIndex={Math.min(i, 2)} 
          />
        ))}
      </div>
    </section>
  )
}

function SkillCard({ cat, delayIndex }: {
  cat: { category: string; tags: string[] }
  delayIndex: number
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`reveal reveal-delay-${delayIndex + 1}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--surface2)' : 'var(--surface)',
        border: `1px solid ${hovered ? 'var(--border-gold)' : 'var(--border)'}`,
        padding: '2rem',
        transition: 'all 0.3s',
      }}
    >
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'var(--gold)', marginBottom: '1.25rem',
      }}>{cat.category}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {cat.tags.map(tag => <Tag key={tag} label={tag} />)}
      </div>
    </div>
  )
}

function Tag({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
        letterSpacing: '0.05em',
        color: hovered ? 'var(--gold)' : 'var(--text-dim)',
        border: `1px solid ${hovered ? 'var(--gold)' : 'var(--border)'}`,
        background: hovered ? 'var(--gold-glow)' : 'transparent',
        padding: '0.3rem 0.75rem',
        transition: 'all 0.25s', cursor: 'default',
      }}
    >{label}</span>
  )
}
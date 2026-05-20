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
    }, { threshold: 0.08 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="skills" ref={ref} style={{
      padding: '6rem 4rem',
      background: 'var(--bg)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
          letterSpacing: '0.25em', textTransform: 'uppercase',
          color: 'var(--gold)', marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.6s ease 0.1s',
        }}>
          <span style={{
            display: 'inline-block',
            width: visible ? '20px' : '0px', height: '1px',
            background: 'var(--gold)',
            transition: 'width 0.6s ease 0.3s',
          }} />
          02 — Skills
        </div>

        <h2 style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
          fontWeight: 600, lineHeight: 1.15, marginBottom: '1rem',
        }}>
          <span style={{
            display: 'inline-block', color: 'var(--text)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(-30px)',
            transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.15s',
          }}>Technical</span>
          <br />
          <em style={{
            display: 'inline-block', color: 'var(--gold)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(-30px)',
            transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.3s',
          }}>Arsenal</em>
        </h2>

        <div style={{
          height: '1px', background: 'var(--gold-dim)',
          marginBottom: '4rem',
          width: visible ? '60px' : '0px',
          transition: 'width 0.8s ease 0.45s',
        }} />
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
      }}>
        {skillData.map((cat, i) => (
          <SkillCard key={cat.id ?? cat.category} cat={cat} index={i} sectionVisible={visible} />
        ))}
      </div>

      <style>{`
        @keyframes tagFloat {
          from { opacity: 0; transform: translateY(8px) scale(0.92); }
          to   { opacity: 1; transform: translateY(0)  scale(1); }
        }
        @keyframes cardGlow {
          0%   { box-shadow: 0 0 0px rgba(201,168,76,0); }
          50%  { box-shadow: 0 0 18px rgba(201,168,76,0.12); }
          100% { box-shadow: 0 0 0px rgba(201,168,76,0); }
        }
        @keyframes borderDraw {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0% 0 0); }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}

function SkillCard({ cat, index, sectionVisible }: {
  cat: Skill
  index: number
  sectionVisible: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [glowing, setGlowing] = useState(false)

  const delay = index * 0.12

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          setVisible(true)
          // Trigger glow once on entry
          setTimeout(() => setGlowing(true), 600)
          setTimeout(() => setGlowing(false), 1800)
        }, delay * 1000)
        obs.disconnect()
      }
    }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--surface2)' : 'var(--surface)',
        border: `1px solid ${hovered ? 'var(--border-gold)' : 'var(--border)'}`,
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translateY(0) scale(1)'
          : 'translateY(40px) scale(0.97)',
        transition: `opacity 0.6s ease, transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.3s, background 0.3s`,
        animation: glowing ? 'cardGlow 1.2s ease' : 'none',
      }}
    >
      {/* Top-left corner accent — draws on hover */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: hovered ? '30px' : '0px', height: '2px',
        background: 'var(--gold)',
        transition: 'width 0.35s ease',
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '2px', height: hovered ? '30px' : '0px',
        background: 'var(--gold)',
        transition: 'height 0.35s ease 0.05s',
      }} />

      {/* Bottom-right corner accent */}
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        width: hovered ? '30px' : '0px', height: '2px',
        background: 'var(--gold)',
        transition: 'width 0.35s ease',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        width: '2px', height: hovered ? '30px' : '0px',
        background: 'var(--gold)',
        transition: 'height 0.35s ease 0.05s',
      }} />

      {/* Category label */}
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'var(--gold)', marginBottom: '0.5rem',
        opacity: visible ? 1 : 0,
        transition: `opacity 0.5s ease 0.1s`,
      }}>{cat.category}</div>

      {/* Tag count */}
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
        color: 'var(--text-muted)', marginBottom: '1.25rem',
        letterSpacing: '0.1em',
        opacity: visible ? 1 : 0,
        animation: visible ? `countUp 0.4s ease 0.2s both` : 'none',
      }}>
        {cat.tags.length} {cat.tags.length === 1 ? 'skill' : 'skills'}
      </div>

      {/* Divider line that draws on entry */}
      <div style={{
        height: '1px',
        background: hovered ? 'var(--border-gold)' : 'var(--border)',
        marginBottom: '1.25rem',
        width: visible ? '100%' : '0%',
        transition: `width 0.7s ease 0.2s, background 0.3s`,
      }} />

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {cat.tags.map((tag, ti) => (
          <Tag
            key={tag}
            label={tag}
            visible={visible}
            delay={0.25 + ti * 0.06}
          />
        ))}
      </div>

      {/* Hover shimmer overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(201,168,76,0.04) 0%, transparent 60%)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
      }} />
    </div>
  )
}

function Tag({ label, visible, delay }: {
  label: string
  visible: boolean
  delay: number
}) {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    setClicked(true)
    setTimeout(() => setClicked(false), 600)
  }

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
        letterSpacing: '0.05em',
        color: hovered ? 'var(--gold)' : 'var(--text-dim)',
        border: `1px solid ${clicked ? 'var(--gold)' : hovered ? 'var(--gold)' : 'var(--border)'}`,
        background: clicked
          ? 'rgba(201,168,76,0.2)'
          : hovered
          ? 'var(--gold-glow)'
          : 'transparent',
        padding: '0.3rem 0.75rem',
        cursor: 'default',
        userSelect: 'none',
        opacity: visible ? 1 : 0,
        animation: visible ? `tagFloat 0.45s ease ${delay}s both` : 'none',
        transform: clicked ? 'scale(0.94)' : hovered ? 'scale(1.04)' : 'scale(1)',
        transition: 'color 0.25s, border-color 0.25s, background 0.25s, transform 0.15s',
        display: 'inline-block',
      }}
    >{label}</span>
  )
}
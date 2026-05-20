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
    <section id="experience" ref={ref} style={{ padding: '6rem 4rem', background: 'var(--bg2)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
          letterSpacing: '0.25em', textTransform: 'uppercase',
          color: 'var(--gold)', marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
        }}>
          <span style={{
            display: 'inline-block',
            width: visible ? '20px' : '0px', height: '1px',
            background: 'var(--gold)',
            transition: 'width 0.6s ease 0.3s',
          }} />
          03 — Experience
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
            transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.1s',
          }}>Work</span>
          <br />
          <em style={{
            display: 'inline-block', color: 'var(--gold)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(-30px)',
            transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.25s',
          }}>History</em>
        </h2>

        <div style={{
          height: '1px', background: 'var(--gold-dim)',
          marginBottom: '4rem',
          width: visible ? '60px' : '0px',
          transition: 'width 0.8s ease 0.4s',
        }} />
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        {/* Animated vertical line */}
        <div style={{
          position: 'absolute', left: 0, top: 0,
          width: '1px',
          height: visible ? '100%' : '0%',
          background: 'linear-gradient(to bottom, var(--gold), transparent)',
          transition: `height ${0.4 + experiences.length * 0.3}s cubic-bezier(0.23, 1, 0.32, 1) 0.5s`,
        }} />

        {experiences.map((exp, i) => (
          <TimelineItem key={exp.id ?? i} exp={exp} index={i} />
        ))}
      </div>

      <style>{`
        @keyframes dotPulse {
          0% { box-shadow: 0 0 0 0 rgba(201,168,76,0.5); }
          70% { box-shadow: 0 0 0 8px rgba(201,168,76,0); }
          100% { box-shadow: 0 0 0 0 rgba(201,168,76,0); }
        }
        @keyframes bulletSlide {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes tagPop {
          from { opacity: 0; transform: translateY(6px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </section>
  )
}

function TimelineItem({ exp, index }: { exp: ExpType; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [dotHovered, setDotHovered] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const baseDelay = index * 0.15

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        paddingLeft: '3rem',
        paddingBottom: '3.5rem',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-40px)',
        transition: `opacity 0.7s ease ${baseDelay}s, transform 0.7s cubic-bezier(0.23, 1, 0.32, 1) ${baseDelay}s`,
      }}
    >
      {/* Animated dot */}
      <div
        onMouseEnter={() => setDotHovered(true)}
        onMouseLeave={() => setDotHovered(false)}
        style={{
          position: 'absolute', left: '-7px', top: '8px',
          width: '14px', height: '14px', borderRadius: '50%',
          border: '2px solid var(--gold)',
          background: dotHovered || hovered ? 'var(--gold)' : 'var(--bg2)',
          transition: 'background 0.3s ease, transform 0.3s ease',
          transform: hovered ? 'scale(1.3)' : 'scale(1)',
          animation: visible ? `dotPulse 2s ease ${baseDelay + 0.5}s 2` : 'none',
          cursor: 'default', zIndex: 1,
        }}
      />

      {/* Card container */}
      <div style={{
        background: hovered ? 'rgba(255,255,255,0.035)' : 'transparent',
        border: `1px solid ${hovered ? 'rgba(201,168,76,0.2)' : 'transparent'}`,
        borderRadius: '2px',
        padding: hovered ? '1.5rem' : '0',
        marginLeft: hovered ? '-1.5rem' : '0',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
      }}>

        {/* Period */}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: 'var(--gold)', marginBottom: '0.5rem',
          opacity: visible ? 1 : 0,
          transition: `opacity 0.6s ease ${baseDelay + 0.1}s`,
        }}>{exp.period}</div>

        {/* Role */}
        <div style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: '1.7rem', fontWeight: 600, lineHeight: 1.2,
          marginBottom: '0.25rem',
          background: hovered
            ? 'linear-gradient(90deg, var(--text) 0%, var(--gold) 50%, var(--text) 100%)'
            : 'none',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: hovered ? 'text' : 'unset',
          WebkitTextFillColor: hovered ? 'transparent' : 'var(--text)',
          backgroundClip: hovered ? 'text' : 'unset',
          color: hovered ? 'transparent' : 'var(--text)',
          animation: hovered ? 'shimmer 2s linear infinite' : 'none',
          transition: 'all 0.4s ease',
          opacity: visible ? 1 : 0,
        }}>{exp.role}</div>

        {/* Company + type */}
        <div style={{
          fontSize: '0.9rem', color: 'var(--text-dim)',
          fontStyle: 'italic', marginBottom: '1.5rem',
          opacity: visible ? 1 : 0,
          transition: `opacity 0.6s ease ${baseDelay + 0.2}s`,
        }}>
          {exp.company}
          {exp.type && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontStyle: 'normal',
              fontSize: '0.65rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--text-muted)',
              marginLeft: '0.75rem',
            }}>{exp.type}</span>
          )}
        </div>

        {/* Bullets */}
        <ul style={{ listStyle: 'none', marginBottom: '1.25rem' }}>
          {exp.bullets.map((b, bi) => (
            <li
              key={bi}
              style={{
                color: 'var(--text-dim)', fontSize: '0.95rem',
                lineHeight: 1.8, marginBottom: '0.5rem',
                paddingLeft: '1.25rem', position: 'relative',
                opacity: visible ? 1 : 0,
                animation: visible
                  ? `bulletSlide 0.5s ease ${baseDelay + 0.3 + bi * 0.08}s both`
                  : 'none',
              }}
            >
              <span style={{
                position: 'absolute', left: 0,
                color: 'var(--gold)',
                opacity: visible ? 1 : 0,
                transition: `opacity 0.4s ease ${baseDelay + 0.3 + bi * 0.08}s`,
              }}>—</span>
              {parseHighlight(b).map((part, j) =>
                typeof part === 'string' ? part : <span key={j}>{part}</span>
              )}
            </li>
          ))}
        </ul>

        {/* Stack tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {exp.stack.map((tag, ti) => (
            <StackTag key={tag} tag={tag} visible={visible} delay={baseDelay + 0.4 + ti * 0.05} />
          ))}
        </div>
      </div>
    </div>
  )
}

function StackTag({ tag, visible, delay }: { tag: string; visible: boolean; delay: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
        letterSpacing: '0.05em',
        color: hovered ? 'var(--gold)' : 'var(--text-muted)',
        border: `1px solid ${hovered ? 'var(--gold)' : 'var(--border)'}`,
        background: hovered ? 'var(--gold-glow)' : 'transparent',
        padding: '0.25rem 0.6rem',
        transition: 'all 0.25s ease',
        cursor: 'default',
        opacity: visible ? 1 : 0,
        animation: visible ? `tagPop 0.4s ease ${delay}s both` : 'none',
      }}
    >{tag}</span>
  )
}
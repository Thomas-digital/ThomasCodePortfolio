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
    }, { threshold: 0.08 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="education" ref={ref} style={{
      padding: '6rem 4rem',
      background: 'var(--bg2)',
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
          05 — Education
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
          }}>Academic</span>
          <br />
          <em style={{
            display: 'inline-block', color: 'var(--gold)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(-30px)',
            transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.3s',
          }}>Foundation</em>
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
        {eduData.map((edu, i) => (
          <EduCard key={edu.id ?? i} edu={edu} index={i} />
        ))}
      </div>

      <style>{`
        @keyframes eduEntry {
          from { opacity: 0; transform: translateY(45px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes periodSlide {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes gradeReveal {
          from { opacity: 0; transform: translateX(10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes notesReveal {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes accentDrop {
          from { height: 0px; opacity: 0; }
          to   { height: 40px; opacity: 1; }
        }
        @keyframes cornerGrow {
          from { width: 0px; }
          to   { width: 20px; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes glowPulse {
          0%   { box-shadow: 0 0 0px rgba(201,168,76,0); }
          50%  { box-shadow: 0 0 20px rgba(201,168,76,0.12); }
          100% { box-shadow: 0 0 0px rgba(201,168,76,0); }
        }
      `}</style>
    </section>
  )
}

function EduCard({ edu, index }: {
  edu: EduType
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [glowing, setGlowing] = useState(false)
  const delay = index * 0.13

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          setVisible(true)
          setTimeout(() => setGlowing(true), 700)
          setTimeout(() => setGlowing(false), 1900)
        }, delay * 1000)
        obs.disconnect()
      }
    }, { threshold: 0.12 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(201,168,76,0.03) 100%)'
          : 'var(--surface)',
        border: `1px solid ${hovered ? 'rgba(201,168,76,0.35)' : 'var(--border)'}`,
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        animationName: visible ? 'eduEntry' : 'none',
        animationDuration: '0.7s',
        animationTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
        animationDelay: `${delay}s`,
        animationFillMode: 'both',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.3s, background 0.4s',
        boxShadow: glowing ? undefined : 'none',
      } as React.CSSProperties}
      className={glowing ? 'edu-glow' : ''}
    >
      {/* Right accent bar — drops down on entry */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '2px',
        height: visible ? '40px' : '0px',
        background: 'var(--gold)',
        transition: `height 0.6s ease ${delay + 0.3}s`,
        opacity: visible ? 1 : 0,
      }} />

      {/* Top-right horizontal accent — draws on hover */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        height: '2px',
        width: hovered ? '40px' : '0px',
        background: 'var(--gold)',
        transition: 'width 0.3s ease',
      }} />

      {/* Bottom-left corner accents — draw on hover */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        width: hovered ? '30px' : '0px', height: '2px',
        background: 'var(--gold)',
        transition: 'width 0.3s ease',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        width: '2px', height: hovered ? '30px' : '0px',
        background: 'var(--gold)',
        transition: 'height 0.3s ease 0.05s',
      }} />

      {/* Radial glow on hover */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 90% 10%, rgba(201,168,76,0.07) 0%, transparent 65%)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.5s ease',
        pointerEvents: 'none',
      }} />

      {/* Period */}
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
        letterSpacing: '0.15em', textTransform: 'uppercase',
        color: 'var(--gold)', marginBottom: '0.75rem',
        opacity: visible ? 1 : 0,
        animation: visible ? `periodSlide 0.5s ease ${delay + 0.2}s both` : 'none',
      }}>{edu.period}</div>

      {/* Degree with shimmer on hover */}
      <div style={{
        fontFamily: 'var(--font-cormorant)',
        fontSize: '1.3rem', fontWeight: 600,
        lineHeight: 1.2, marginBottom: '0.15rem',
        backgroundImage: hovered
          ? 'linear-gradient(90deg, var(--text) 0%, var(--gold) 50%, var(--text) 100%)'
          : 'none',
        backgroundSize: '200% auto',
        backgroundPosition: '0 center',
        WebkitBackgroundClip: hovered ? 'text' : 'unset',
        WebkitTextFillColor: hovered ? 'transparent' : 'var(--text)',
        backgroundClip: hovered ? 'text' : 'unset',
        color: hovered ? 'transparent' : 'var(--text)',
        animationName: hovered ? 'shimmer' : 'none',
        animationDuration: '2.5s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
        opacity: visible ? 1 : 0,
        transition: `opacity 0.5s ease ${delay + 0.25}s`,
      }}>{edu.degree}</div>

      {/* Field */}
      {edu.field && (
        <div style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: '1rem', fontStyle: 'italic',
          color: 'var(--text-dim)', marginBottom: '0.5rem',
          opacity: visible ? 1 : 0,
          transition: `opacity 0.5s ease ${delay + 0.3}s`,
        }}>{edu.field}</div>
      )}

      {/* Divider draws on entry */}
      <div style={{
        height: '1px',
        background: hovered ? 'var(--border-gold)' : 'var(--border)',
        margin: '0.75rem 0',
        width: visible ? '100%' : '0%',
        transition: `width 0.7s ease ${delay + 0.35}s, background 0.3s`,
      }} />

      {/* School */}
      <div style={{
        fontSize: '0.9rem', color: 'var(--text-dim)',
        fontStyle: 'italic', marginBottom: '0.5rem',
        opacity: visible ? 1 : 0,
        transition: `opacity 0.5s ease ${delay + 0.4}s`,
        transform: hovered ? 'translateX(4px)' : 'translateX(0)',
      }}>{edu.school}</div>

      {/* Grade badge */}
      {edu.grade && (
        <div style={{
          display: 'inline-block',
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: hovered ? 'var(--bg)' : 'var(--gold)',
          background: hovered ? 'var(--gold)' : 'transparent',
          border: '1px solid var(--gold)',
          padding: '0.2rem 0.65rem',
          marginBottom: '0.75rem',
          opacity: visible ? 1 : 0,
          animation: visible ? `gradeReveal 0.5s ease ${delay + 0.45}s both` : 'none',
          transition: 'color 0.3s, background 0.3s',
        }}>
          {edu.grade}
        </div>
      )}

      {/* Notes */}
      {edu.notes && (
        <p style={{
          fontSize: '0.82rem', color: 'var(--text-muted)',
          lineHeight: 1.7, marginTop: '0.25rem',
          opacity: visible ? 1 : 0,
          animation: visible ? `notesReveal 0.5s ease ${delay + 0.5}s both` : 'none',
          borderLeft: hovered ? '2px solid var(--border-gold)' : '2px solid transparent',
          paddingLeft: hovered ? '0.75rem' : '0',
          transition: 'border-color 0.3s, padding-left 0.3s ease',
        }}>{edu.notes}</p>
      )}
    </div>
  )
}
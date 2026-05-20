'use client'
import { useEffect, useRef, useState } from 'react'
import { getProjects } from '@/lib/firestore'
import { parseHighlight } from '@/lib/highlights'
import type { Project } from '@/types'

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    getProjects().then(d => setProjects(d.filter(p => p.visible)))
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.08 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="projects" ref={ref} style={{
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
          04 — Projects
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
          }}>Featured</span>
          <br />
          <em style={{
            display: 'inline-block', color: 'var(--gold)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(-30px)',
            transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.3s',
          }}>Work</em>
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1.5rem',
      }}>
        {projects.map((p, i) => (
          <ProjectCard
            key={p.id ?? i}
            project={p}
            num={String(i + 1).padStart(2, '0')}
            index={i}
          />
        ))}
      </div>

      <style>{`
        @keyframes stackPop {
          from { opacity: 0; transform: translateY(6px) scale(0.93); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes linkSlide {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes numFloat {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }
        @keyframes cardEntry {
          from { opacity: 0; transform: translateY(50px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes borderPulse {
          0%   { box-shadow: 0 0 0px rgba(201,168,76,0); }
          50%  { box-shadow: 0 0 20px rgba(201,168,76,0.15); }
          100% { box-shadow: 0 0 0px rgba(201,168,76,0); }
        }
      `}</style>
    </section>
  )
}

function ProjectCard({ project: p, num, index }: {
  project: Project
  num: string
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [entered, setEntered] = useState(false)
  const delay = index * 0.13

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          setVisible(true)
          setTimeout(() => setEntered(true), 1000)
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
          ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(201,168,76,0.04) 100%)'
          : 'var(--surface)',
        border: `1px solid ${hovered ? 'rgba(201,168,76,0.35)' : 'var(--border)'}`,
        padding: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        opacity: visible ? 1 : 0,
        animationName: visible ? 'cardEntry' : 'none',
        animationDuration: '0.7s',
        animationTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
        animationDelay: `${delay}s`,
        animationFillMode: 'both',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.3s, background 0.4s',
      } as React.CSSProperties}
    >
      {/* Corner accents — draw on hover */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: hovered ? '35px' : '0px', height: '2px',
        background: 'var(--gold)',
        transition: 'width 0.3s ease',
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '2px', height: hovered ? '35px' : '0px',
        background: 'var(--gold)',
        transition: 'height 0.3s ease 0.05s',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        width: hovered ? '35px' : '0px', height: '2px',
        background: 'var(--gold)',
        transition: 'width 0.3s ease',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        width: '2px', height: hovered ? '35px' : '0px',
        background: 'var(--gold)',
        transition: 'height 0.3s ease 0.05s',
      }} />

      {/* Hover glow sweep */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 80% 20%, rgba(201,168,76,0.06) 0%, transparent 60%)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.5s ease',
        pointerEvents: 'none',
      }} />

      {/* Big floating number */}
      <div style={{
        position: 'absolute', top: '1rem', right: '1.5rem',
        fontFamily: 'var(--font-cormorant)',
        fontSize: '4.5rem', fontWeight: 600, lineHeight: 1,
        color: hovered ? 'rgba(201,168,76,0.18)' : 'rgba(201,168,76,0.07)',
        transition: 'color 0.4s, transform 0.4s',
        transform: hovered ? 'translateY(-4px) scale(1.05)' : 'translateY(0) scale(1)',
        animation: entered && hovered ? 'numFloat 3s ease-in-out infinite' : 'none',
        pointerEvents: 'none',
        userSelect: 'none',
      }}>{num}</div>

      {/* Tag */}
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'var(--gold)', marginBottom: '1rem',
        opacity: visible ? 1 : 0,
        transition: `opacity 0.5s ease ${delay + 0.2}s`,
      }}>{p.tag}</div>

      {/* Title with shimmer on hover */}
      <div style={{
        fontFamily: 'var(--font-cormorant)',
        fontSize: '1.7rem', fontWeight: 600,
        lineHeight: 1.2, marginBottom: '0.75rem',
        backgroundImage: hovered
          ? 'linear-gradient(90deg, var(--text) 0%, var(--gold) 45%, var(--text) 90%)'
          : 'none',
        backgroundSize: hovered ? '200% auto' : 'auto',
        backgroundPosition: hovered ? '0 center' : 'initial',
        WebkitBackgroundClip: hovered ? 'text' : 'unset',
        WebkitTextFillColor: hovered ? 'transparent' : 'var(--text)',
        backgroundClip: hovered ? 'text' : 'unset',
        color: hovered ? 'transparent' : 'var(--text)',
        animation: hovered ? 'shimmer 2.5s linear infinite' : 'none',
        opacity: visible ? 1 : 0,
        transition: `opacity 0.5s ease ${delay + 0.25}s`,
      }}>{p.title}</div>

      {/* Divider */}
      <div style={{
        height: '1px',
        background: hovered ? 'var(--border-gold)' : 'var(--border)',
        marginBottom: '1rem',
        width: visible ? '100%' : '0%',
        transition: `width 0.7s ease ${delay + 0.3}s, background 0.3s`,
      }} />

      {/* Description */}
      <p style={{
        fontSize: '0.9rem', color: 'var(--text-dim)',
        lineHeight: 1.75, marginBottom: '1.5rem',
        opacity: visible ? 1 : 0,
        transition: `opacity 0.6s ease ${delay + 0.35}s`,
      }}>{p.description}</p>

      {/* Stack */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.4rem',
        marginBottom: '1.5rem',
        opacity: visible ? 1 : 0,
        animationName: visible ? 'stackPop' : 'none',
        animationDuration: '0.4s',
        animationTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
        animationDelay: `${delay + 0.4}s`,
        animationFillMode: 'both',
      }}>
        {p.stack?.map(tag => (
          <span key={tag} style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            letterSpacing: '0.05em', color: 'var(--text-muted)',
            border: '1px solid var(--border)', padding: '0.2rem 0.6rem',
          }}>{tag}</span>
        ))}
      </div>

      {/* Link */}
      <a href="#" style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
        letterSpacing: '0.15em', textTransform: 'uppercase',
        color: 'var(--gold)', textDecoration: 'none',
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        opacity: visible ? 1 : 0,
        animationName: visible ? 'linkSlide' : 'none',
        animationDuration: '0.5s',
        animationTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
        animationDelay: `${delay + 0.5}s`,
        animationFillMode: 'both',
        transition: 'gap 0.3s ease',
      }} onMouseEnter={(e) => {
        e.currentTarget.style.gap = '0.8rem'
      }} onMouseLeave={(e) => {
        e.currentTarget.style.gap = '0.5rem'
      }}>
        View Project →
      </a>
    </div>
  )
}
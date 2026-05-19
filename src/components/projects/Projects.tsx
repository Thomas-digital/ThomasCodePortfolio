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
    }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="projects" ref={ref} style={{ padding: '6rem 4rem', background: 'var(--bg)' }}>
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
          04 — Projects
        </div>
        <h2 style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
          fontWeight: 600, color: 'var(--text)', lineHeight: 1.15, marginBottom: '1rem',
        }}>
          Featured<br /><em style={{ color: 'var(--gold)' }}>Work</em>
        </h2>
        <div style={{ width: '60px', height: '1px', background: 'var(--gold-dim)', marginBottom: '4rem' }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1.5rem',
      }}>
        {projects.map((p, i) => (
          <ProjectCard key={p.id || i} project={p} num={String(i + 1).padStart(2, '0')} />
        ))}
      </div>
    </section>
  )
}

function ProjectCard({ project: p, num }: {
  project: Project
  num: string
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
        padding: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'all 0.3s',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      {/* Big number */}
      <div style={{
        position: 'absolute', top: '1rem', right: '2rem',
        fontFamily: 'var(--font-cormorant)',
        fontSize: '4rem', fontWeight: 600, lineHeight: 1,
        color: hovered ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.07)',
        transition: 'color 0.3s', pointerEvents: 'none',
      }}>{num}</div>

      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'var(--gold)', marginBottom: '1rem',
      }}>{p.tag}</div>

      <div style={{
        fontFamily: 'var(--font-cormorant)',
        fontSize: '1.7rem', fontWeight: 600,
        color: 'var(--text)', marginBottom: '0.75rem', lineHeight: 1.2,
      }}>{p.title}</div>

      <p style={{
        fontSize: '0.9rem', color: 'var(--text-dim)',
        lineHeight: 1.75, marginBottom: '1.5rem',
      }}>
        {parseHighlight(p.description).map((part, i) =>
          typeof part === 'string' ? part : <span key={i}>{part}</span>
        )}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
        {p.stack.map(tag => (
          <span key={tag} style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            letterSpacing: '0.05em', color: 'var(--text-muted)',
            border: '1px solid var(--border)', padding: '0.2rem 0.6rem',
          }}>{tag}</span>
        ))}
      </div>

      <a
        href={p.link}
        target={p.link !== '#' ? '_blank' : undefined}
        rel="noreferrer"
        style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: 'var(--gold)', textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          transition: 'gap 0.3s',
        } as React.CSSProperties}
        onMouseEnter={(e) => (e.currentTarget.style.gap = '0.9rem')}
        onMouseLeave={(e) => (e.currentTarget.style.gap = '0.5rem')}
      >
        {p.linkLabel} →
      </a>
    </div>
  )
}
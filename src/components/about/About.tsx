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
    }, { threshold: 0.08 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const paragraphs = data?.paragraphs ?? []
  const cards = [
    { label: 'Current Focus', value: data?.focus ?? 'Software Architecture', sub: data?.focusSub ?? '' },
    { label: 'Primary Stack', value: data?.stack ?? 'Full-Stack + Mobile', sub: data?.stackSub ?? '' },
    { label: 'Industry Domains', value: data?.domains ?? 'SaaS · Fintech · E-Commerce', sub: data?.domainsSub ?? '' },
  ]

  return (
    <section id="about" ref={ref} style={{
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
          01 — About
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
          }}>The Architect</span>
          <br />
          <em style={{
            display: 'inline-block', color: 'var(--gold)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(-30px)',
            transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.3s',
          }}>Behind the Build</em>
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '4rem',
        alignItems: 'start',
      }}>
        {/* Bio text */}
        <div>
          {paragraphs.map((para, i) => (
            <Paragraph key={i} para={para} index={i} visible={visible} />
          ))}
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {cards.map((card, i) => (
            <AboutCard key={card.label} card={card} index={i} visible={visible} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes paraReveal {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardEntry {
          from { opacity: 0; transform: translateX(40px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes barGrow {
          from { height: 0%; }
          to   { height: 100%; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes glowPulse {
          0%   { box-shadow: 0 0 0px rgba(201,168,76,0); }
          50%  { box-shadow: 0 0 18px rgba(201,168,76,0.13); }
          100% { box-shadow: 0 0 0px rgba(201,168,76,0); }
        }
        @keyframes subReveal {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}

function Paragraph({ para, index, visible }: {
  para: string
  index: number
  visible: boolean
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const delay = 0.1 + index * 0.12

  return (
    <p
      ref={ref}
      style={{
        color: 'var(--text-dim)', lineHeight: 1.9,
        marginBottom: '1.4rem', fontSize: '1rem',
        opacity: inView ? 1 : 0,
        animation: inView ? `paraReveal 0.65s ease ${delay}s both` : 'none',
        borderLeft: inView ? '2px solid transparent' : '2px solid transparent',
        paddingLeft: '0',
        transition: 'border-color 0.3s, padding-left 0.3s',
      }}
    >
      {parseHighlight(para).map((part, j) =>
        typeof part === 'string' ? (
          <span key={j} dangerouslySetInnerHTML={{ __html: part }} />
        ) : (
          <span key={j}>{part}</span>
        )
      )}
    </p>
  )
}

function AboutCard({ card, index, visible }: {
  card: { label: string; value: string; sub: string }
  index: number
  visible: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [glowing, setGlowing] = useState(false)
  const delay = 0.2 + index * 0.15

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          setInView(true)
          setTimeout(() => setGlowing(true), 600)
          setTimeout(() => setGlowing(false), 1800)
        }, delay * 1000)
        obs.disconnect()
      }
    }, { threshold: 0.15 })
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
        border: `1px solid ${hovered ? 'rgba(201,168,76,0.4)' : 'var(--border)'}`,
        padding: '1.75rem',
        position: 'relative',
        overflow: 'hidden',
        opacity: inView ? 1 : 0,
        animationName: inView ? 'cardEntry' : 'none',
        animationDuration: '0.65s',
        animationTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
        animationDelay: `${delay}s`,
        animationFillMode: 'both',
        transform: hovered ? 'translateX(6px)' : 'translateX(0)',
        transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.3s, background 0.4s',
      } as React.CSSProperties}
    >
      {/* Left accent bar — grows down on entry */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '3px',
        height: inView ? '100%' : '0%',
        background: hovered
          ? 'linear-gradient(to bottom, var(--gold), rgba(201,168,76,0.4))'
          : 'var(--gold)',
        transition: `height 0.6s ease ${delay + 0.2}s, background 0.3s`,
      }} />

      {/* Top-right corner accent on hover */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: hovered ? '25px' : '0px', height: '2px',
        background: 'var(--gold)',
        transition: 'width 0.3s ease',
      }} />
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '2px', height: hovered ? '25px' : '0px',
        background: 'var(--gold)',
        transition: 'height 0.3s ease 0.05s',
      }} />

      {/* Radial glow on hover */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 100% 0%, rgba(201,168,76,0.07) 0%, transparent 60%)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
      }} />

      {/* Label */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem', letterSpacing: '0.2em',
        textTransform: 'uppercase', color: 'var(--gold)',
        marginBottom: '0.6rem',
        opacity: inView ? 1 : 0,
        transition: `opacity 0.5s ease ${delay + 0.15}s`,
        paddingLeft: '0.75rem',
      }}>{card.label}</div>

      {/* Value with shimmer on hover */}
      <div style={{
        fontFamily: 'var(--font-cormorant)',
        fontSize: '1.4rem', fontWeight: 500,
        lineHeight: 1.2, marginBottom: '0.35rem',
        paddingLeft: '0.75rem',
        background: hovered
          ? 'linear-gradient(90deg, var(--text) 0%, var(--gold) 50%, var(--text) 100%)'
          : 'none',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: hovered ? 'text' : 'unset',
        WebkitTextFillColor: hovered ? 'transparent' : 'var(--text)',
        backgroundClip: hovered ? 'text' : 'unset',
        color: hovered ? 'transparent' : 'var(--text)',
        animation: hovered ? 'shimmer 2.5s linear infinite' : 'none',
        opacity: inView ? 1 : 0,
        transition: `opacity 0.5s ease ${delay + 0.2}s`,
      }}>{card.value}</div>

      {/* Divider */}
      <div style={{
        height: '1px',
        background: hovered ? 'var(--border-gold)' : 'var(--border)',
        margin: '0.6rem 0 0.6rem 0.75rem',
        width: inView ? 'calc(100% - 0.75rem)' : '0%',
        transition: `width 0.7s ease ${delay + 0.3}s, background 0.3s`,
      }} />

      {/* Sub */}
      <div style={{
        fontSize: '0.85rem', color: 'var(--text-muted)',
        paddingLeft: '0.75rem',
        opacity: inView ? 1 : 0,
        animation: inView ? `subReveal 0.5s ease ${delay + 0.35}s both` : 'none',
        transform: hovered ? 'translateX(3px)' : 'translateX(0)',
        transition: 'transform 0.3s ease',
      }}>{card.sub}</div>
    </div>
  )
}
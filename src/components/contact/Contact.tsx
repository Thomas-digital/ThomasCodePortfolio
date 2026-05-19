'use client'
import { useEffect, useRef, useState } from 'react'

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(30px)',
    transition: `opacity 0.7s ${delay}s ease, transform 0.7s ${delay}s ease`,
  })

  const socials = [
    { label: 'LinkedIn', href: 'https://linkedin.com/in/thomas-ozichukwu' },
    { label: 'GitHub', href: 'https://github.com/ThomasCode' },
    { label: 'Twitter / X', href: '#' },
  ]

  return (
    <section id="contact" ref={ref} style={{
      minHeight: '70vh',
      display: 'flex', alignItems: 'center',
      position: 'relative', overflow: 'hidden',
      background: 'var(--bg)',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.04), transparent)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        textAlign: 'center', width: '100%',
        padding: '6rem 4rem',
      }}>
        <div style={{
          ...fadeUp(0),
          fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
          letterSpacing: '0.25em', textTransform: 'uppercase',
          color: 'var(--gold)', marginBottom: '1.5rem',
        }}>
          Let's Build Together
        </div>

        <h2 style={{
          ...fadeUp(0.1),
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 600, color: 'var(--text)',
          lineHeight: 1.1, marginBottom: '1rem',
        }}>
          Have a project in mind?<br />
          <em style={{ color: 'var(--gold)' }}>Let's make it real.</em>
        </h2>

        <p style={{
          ...fadeUp(0.2),
          fontSize: '1rem', color: 'var(--text-dim)',
          maxWidth: '480px', margin: '0 auto 2.5rem',
          lineHeight: 1.8,
        }}>
          Open to remote opportunities, freelance projects, and collaborations
          in software architecture, full-stack development, and Web3.
        </p>

        <a
          href="mailto:thomasozichukwu@gmail.com"
          style={{
            ...fadeUp(0.3),
            fontFamily: 'var(--font-cormorant)',
            fontSize: '1.5rem', color: 'var(--gold)',
            textDecoration: 'none',
            borderBottom: '1px solid var(--gold-dim)',
            paddingBottom: '0.2rem',
            display: 'inline-block', marginBottom: '3rem',
            transition: 'border-color 0.3s',
          } as React.CSSProperties}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.borderColor = 'var(--gold)')}
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.borderColor = 'var(--gold-dim)')}
        >
          thomasozichukwu@gmail.com
        </a>

        <div style={{
          ...fadeUp(0.4),
          display: 'flex', justifyContent: 'center',
          gap: '1.5rem', flexWrap: 'wrap',
        }}>
          {socials.map(s => <SocialLink key={s.label} {...s} />)}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'var(--bg2)',
        borderTop: '1px solid var(--border)',
        padding: '1.5rem 4rem',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: '1rem', color: 'var(--gold)',
          letterSpacing: '0.1em',
        }}>Thomas Ozichukwu</span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem', letterSpacing: '0.1em',
          color: 'var(--text-muted)',
        }}>© 2026 — Crafted with intention</span>
      </div>
    </section>
  )
}

function SocialLink({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      target={href !== '#' ? '_blank' : undefined}
      rel="noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.7rem', letterSpacing: '0.15em',
        textTransform: 'uppercase', textDecoration: 'none',
        color: hovered ? 'var(--gold)' : 'var(--text-muted)',
        border: `1px solid ${hovered ? 'var(--gold)' : 'var(--border)'}`,
        background: hovered ? 'var(--gold-glow)' : 'transparent',
        padding: '0.6rem 1.2rem',
        transition: 'all 0.3s',
      }}
    >{label}</a>
  )
}
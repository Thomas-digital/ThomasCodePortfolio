'use client'
import { useEffect, useRef, useState } from 'react'
import { getContact } from '@/lib/firestore'
import type { ContactData } from '@/types'

const defaults: ContactData = {
  email: 'thomasozichukwu@gmail.com',
  linkedin: 'https://linkedin.com/in/thomas-ozichukwu',
  github: 'https://github.com/ThomasCode',
  twitter: 'https://x.com/ThomasCode',
  subtext: 'Open to remote opportunities, freelance projects, and collaborations in software architecture, full-stack development, and Web3.',
}

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState<ContactData>(defaults)

  useEffect(() => {
    getContact().then(d => {
      if (d) setData(d)
    })
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.08 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const [emailHovered, setEmailHovered] = useState(false)
  const [copied, setCopied] = useState(false)

  const socials = [
    { label: 'LinkedIn', href: data.linkedin },
    { label: 'GitHub', href: data.github },
    { label: 'Twitter / X', href: data.twitter },
  ]

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(data.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contact" ref={ref} style={{
      minHeight: '75vh',
      display: 'flex', alignItems: 'center',
      flexDirection: 'column', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      background: 'var(--bg)',
      paddingBottom: '80px',
    }}>

      {/* Animated background rings */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px',
        pointerEvents: 'none',
      }}>
        {[600, 450, 300].map((size, i) => (
          <div key={size} style={{
            position: 'absolute',
            left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${size}px`, height: `${size}px`,
            borderRadius: '50%',
            border: '1px solid rgba(201,168,76,0.06)',
            opacity: visible ? 1 : 0,
            transition: `opacity 1s ease ${0.3 + i * 0.2}s`,
            animation: visible ? `ringPulse ${4 + i}s ease-in-out ${i * 0.8}s infinite` : 'none',
          }} />
        ))}
      </div>

      {/* Radial glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(201,168,76,0.05), transparent)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 1.2s ease 0.2s',
        pointerEvents: 'none',
      }} />

      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 1s ease 0.4s',
        pointerEvents: 'none',
      }} />

      {/* Main content */}
      <div style={{
        position: 'relative', zIndex: 1,
        textAlign: 'center', width: '100%',
        padding: '6rem 4rem 4rem',
      }}>

        {/* Label */}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
          letterSpacing: '0.25em', textTransform: 'uppercase',
          color: 'var(--gold)', marginBottom: '1.5rem',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '1rem',
        }}>
          <span style={{
            width: visible ? '30px' : '0px', height: '1px',
            background: 'var(--gold)', display: 'inline-block',
            transition: 'width 0.6s ease 0.4s',
          }} />
          Let's Build Together
          <span style={{
            width: visible ? '30px' : '0px', height: '1px',
            background: 'var(--gold)', display: 'inline-block',
            transition: 'width 0.6s ease 0.4s',
          }} />
        </div>

        {/* Heading */}
        <h2 style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 600, lineHeight: 1.1, marginBottom: '1rem',
        }}>
          <span style={{
            display: 'inline-block', color: 'var(--text)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.2s',
          }}>Have a project in mind?</span>
          <br />
          <em style={{
            display: 'inline-block', color: 'var(--gold)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.35s',
          }}>Let's make it real.</em>
        </h2>

        {/* Subtext */}
        <p style={{
          fontSize: '1rem', color: 'var(--text-dim)',
          maxWidth: '460px', margin: '0 auto 3rem',
          lineHeight: 1.85,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s ease 0.45s, transform 0.7s ease 0.45s',
        }}>
          {data.subtext}
        </p>

        {/* Email block */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
          transition: 'opacity 0.7s ease 0.55s, transform 0.7s ease 0.55s',
          marginBottom: '3rem',
          display: 'inline-block',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: '1rem', justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            {/* Email link */}
            <a
              href={`mailto:${data.email}`}
              onMouseEnter={() => setEmailHovered(true)}
              onMouseLeave={() => setEmailHovered(false)}
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                color: 'var(--gold)',
                textDecoration: 'none',
                position: 'relative',
                display: 'inline-block',
                paddingBottom: '4px',
                transition: 'all 0.3s ease',
                letterSpacing: emailHovered ? '0.04em' : '0',
              }}
            >
              {data.email}
              {/* Underline draws on hover */}
              <span style={{
                position: 'absolute', bottom: 0, left: 0,
                width: emailHovered ? '100%' : '30%',
                height: '1px',
                background: 'var(--gold)',
                transition: 'width 0.4s ease',
              }} />
            </a>

            {/* Copy button */}
            <button
              onClick={handleCopyEmail}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem', letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: copied ? 'var(--bg)' : 'var(--gold)',
                background: copied ? 'var(--gold)' : 'transparent',
                border: '1px solid var(--gold)',
                padding: '0.4rem 0.9rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: copied ? 'scale(0.96)' : 'scale(1)',
              }}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Social links */}
        <div style={{
          display: 'flex', justifyContent: 'center',
          gap: '1rem', flexWrap: 'wrap',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.7s ease 0.65s',
        }}>
          {socials.map((s, i) => (
            <SocialLink
              key={s.label}
              label={s.label}
              href={s.href}
              delay={0.7 + i * 0.1}
              visible={visible}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'var(--bg2)',
        borderTop: '1px solid var(--border)',
        padding: '1.25rem 4rem',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease 0.9s',
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

      <style>{`
        @keyframes ringPulse {
          0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.6; }
          50%  { transform: translate(-50%, -50%) scale(1.04); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1);   opacity: 0.6; }
        }
        @keyframes socialEntry {
          from { opacity: 0; transform: translateY(12px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </section>
  )
}

function SocialLink({ label, href, delay, visible }: {
  label: string
  href: string
  delay: number
  visible: boolean
}) {
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
        position: 'relative', overflow: 'hidden',
        color: hovered ? 'var(--bg)' : 'var(--text-dim)',
        border: `1px solid ${hovered ? 'var(--gold)' : 'var(--border)'}`,
        padding: '0.65rem 1.4rem',
        display: 'inline-block',
        opacity: visible ? 1 : 0,
        animation: visible ? `socialEntry 0.5s ease ${delay}s both` : 'none',
        transition: 'color 0.3s ease, border-color 0.3s ease',
      }}
    >
      {/* Fill sweep on hover */}
      <span style={{
        position: 'absolute', inset: 0,
        background: 'var(--gold)',
        transform: hovered ? 'translateX(0)' : 'translateX(-101%)',
        transition: 'transform 0.35s cubic-bezier(0.23, 1, 0.32, 1)',
        zIndex: 0,
      }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
    </a>
  )
}
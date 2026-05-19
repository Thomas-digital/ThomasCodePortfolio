'use client'
import { useEffect, useState } from 'react'
import { parseHighlight } from '@/lib/highlights'

const fallbackRoles = [
  'Full-Stack Software Engineer',
  'Flutter & Mobile Specialist',
  'Software Architect',
  'Building Scalable SaaS Solutions',
  'Web3 & Blockchain Developer',
]

const mockHeroData = {
  name: 'Thomas Ozichukwu',
  bio: 'I architect and build scalable digital products — from luxury e-commerce platforms to mobile streaming apps to blockchain infrastructure. Clean code, intentional design, shipped with precision.',
  location: 'Lagos, Nigeria',
  availability: 'Available for remote work',
  roles: fallbackRoles,
  yearsExp: 2,
  projectCount: 4,
  techCount: 20,
}

export default function Hero() {
  const [typed, setTyped] = useState('')
  const [roleIndex, setRoleIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  const name = mockHeroData.name
  const bio = mockHeroData.bio
  const location = mockHeroData.location
  const availability = mockHeroData.availability
  const roles = mockHeroData.roles
  const yearsExp = mockHeroData.yearsExp
  const projectCount = mockHeroData.projectCount
  const techCount = mockHeroData.techCount

  useEffect(() => {
    const current = roles[roleIndex]
    let speed = 80
    if (isDeleting) speed = 40

    const timer = setTimeout(() => {
      if (isPaused) return

      // Just finished typing - pause before deleting
      if (!isDeleting && typed === current) {
        setIsPaused(true)
        setTimeout(() => {
          setIsPaused(false)
          setIsDeleting(true)
        }, 2000)
        return
      }

      // Just finished deleting - move to next role
      if (isDeleting && typed === '') {
        setIsDeleting(false)
        setRoleIndex(prev => (prev + 1) % roles.length)
        return
      }

      // Continue typing or deleting
      if (!isDeleting) {
        setTyped(current.slice(0, typed.length + 1))
      } else {
        setTyped(current.slice(0, typed.length - 1))
      }
    }, speed)

    return () => clearTimeout(timer)
  }, [typed, isDeleting, isPaused, roleIndex, roles])

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.8s ${delay}s ease, transform 0.8s ${delay}s ease`,
  })

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      position: 'relative', overflow: 'hidden',
      padding: '8rem 4rem 4rem',
      background: 'var(--bg)',
    }}>
      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
      }} />

      {/* Glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 70% 60% at 65% 40%, rgba(201,168,76,0.05) 0%, transparent 60%),
          radial-gradient(ellipse 50% 70% at 10% 80%, rgba(201,168,76,0.03) 0%, transparent 50%)
        `,
      }} />

      {/* Decorative ring */}
      <div style={{
        position: 'absolute', right: '-80px', top: '50%',
        transform: 'translateY(-50%)',
        width: '500px', height: '500px',
        border: '1px solid rgba(201,168,76,0.07)',
        borderRadius: '50%', pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', inset: '50px',
          border: '1px solid rgba(201,168,76,0.04)',
          borderRadius: '50%',
        }} />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
        {/* Label */}
        <div style={{
          ...fadeUp(0.2),
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: 'var(--gold)',
          marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
        }}>
          <span style={{ width: '30px', height: '1px', background: 'var(--gold)', display: 'inline-block' }} />
          {availability} · {location}
        </div>

        {/* Name */}
        <h1 style={{
          ...fadeUp(0.4),
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'clamp(3.5rem, 7vw, 6rem)',
          fontWeight: 600, lineHeight: 1.05,
          color: 'var(--text)', marginBottom: '0.5rem',
        }}>
          {name.split(' ')[0]}{' '}
          <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>
            {name.split(' ').slice(1).join(' ')}
          </span>
        </h1>

        {/* Typewriter */}
        <div style={{
          ...fadeUp(0.6),
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
          fontWeight: 300, color: 'var(--text-dim)',
          marginBottom: '2rem', minHeight: '2.5rem',
        }}>
          {typed}
          <span style={{
            color: 'var(--gold)',
            animation: 'blink 1s infinite',
          }}>|</span>
        </div>

        {/* Bio */}
        <p style={{
          ...fadeUp(0.8),
          fontSize: '1rem', color: 'var(--text-dim)',
          maxWidth: '560px', lineHeight: 1.85,
          marginBottom: '2.5rem',
        }}>
          {parseHighlight(bio).map((part, i) =>
            typeof part === 'string' ? part : <span key={i}>{part}</span>
          )}
        </p>

        {/* Buttons */}
        <div style={{
          ...fadeUp(1.0),
          display: 'flex', gap: '1rem', alignItems: 'center',
          marginBottom: '3rem',
        }}>
          <a href="#projects" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem', letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--bg)', background: 'var(--gold)',
            padding: '0.85rem 2rem', textDecoration: 'none',
            transition: 'all 0.3s', display: 'inline-block',
            fontWeight: 500,
          }}
            onMouseEnter={e => (e.currentTarget.style.background = '#e0b84e')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--gold)')}
          >
            View Projects
          </a>
          <a href="#contact" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem', letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-dim)',
            border: '1px solid var(--border)',
            padding: '0.85rem 2rem', textDecoration: 'none',
            transition: 'all 0.3s', display: 'inline-block',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--gold)'
              e.currentTarget.style.color = 'var(--gold)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text-dim)'
            }}
          >
            Get In Touch
          </a>
        </div>

        {/* Stats */}
        <div style={{
          ...fadeUp(1.1),
          display: 'flex', gap: '3rem',
        }}>
          {[
            { num: `${yearsExp}+`, label: 'Years Experience' },
            { num: `${projectCount}+`, label: 'Major Projects' },
            { num: `${techCount}+`, label: 'Technologies' },
          ].map(s => (
            <div key={s.label}>
              <div style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '2.5rem', fontWeight: 600,
                color: 'var(--gold)', lineHeight: 1,
              }} data-count={s.num}>{s.num}</div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem', letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--text-muted)',
                marginTop: '0.25rem',
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        ...fadeUp(1.4),
        position: 'absolute', bottom: '2rem', left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '0.5rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem', letterSpacing: '0.15em',
        textTransform: 'uppercase', color: 'var(--text-muted)',
      }}>
        <span>Scroll</span>
        <div style={{
          width: '1px', height: '40px',
          background: 'linear-gradient(to bottom, var(--text-muted), transparent)',
          animation: 'scrollPulse 1.8s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }
      `}</style>
    </section>
  )
}
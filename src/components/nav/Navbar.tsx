'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const navLinks = ['About', 'Skills', 'Experience', 'Projects', 'Education', 'Contact']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogoClick = () => {
    const next = clickCount + 1
    setClickCount(next)
    if (next >= 8) {
      setClickCount(0)
      router.push('/admin/login')
    } else {
      setTimeout(() => setClickCount(0), 3000)
    }
  }

  const handleNavClick = () => {
    setMenuOpen(false)
  }

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: scrolled ? '1rem 4rem' : '1.5rem 4rem',
        transition: 'all 0.4s ease',
        background: scrolled ? 'rgba(7,7,14,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      }}>
        {/* Logo */}
        <button
          onClick={handleLogoClick}
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '1.3rem',
            fontWeight: 600,
            color: 'var(--gold)',
            letterSpacing: '0.05em',
            background: 'none',
            border: 'none',
            cursor: 'default',
            userSelect: 'none',
            padding: 0,
          }}
        >
          T.O.
        </button>

        {/* Desktop Links */}
        <ul
          style={{
            display: 'flex',
            gap: '2.5rem',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
          className="nav-desktop"
        >
          {navLinks.map(link => (
            <li key={link}>
              <Link
                href={`#${link.toLowerCase()}`}
                onClick={handleNavClick}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--text-dim)',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
              >
                {link}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <a
          href="mailto:thomasozichukwu@gmail.com"
          className="nav-cta"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            border: '1px solid var(--border-gold)',
            padding: '0.5rem 1.2rem',
            textDecoration: 'none',
            transition: 'all 0.3s',
            background: 'transparent',
            fontWeight: 500,
            display: 'inline-block',
          } as React.CSSProperties}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--gold-glow)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          Hire Me
        </a>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="burger"
          aria-label="Menu"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            gap: '5px',
            flexDirection: 'column',
            zIndex: 101,
          }}
        >
          <span style={{
            width: '24px',
            height: '1px',
            background: 'var(--text-dim)',
            transition: 'all 0.3s',
            transformOrigin: 'center',
          }} />
          <span style={{
            width: '24px',
            height: '1px',
            background: 'var(--text-dim)',
            transition: 'all 0.3s',
          }} />
          <span style={{
            width: '24px',
            height: '1px',
            background: 'var(--text-dim)',
            transition: 'all 0.3s',
            transformOrigin: 'center',
          }} />
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            style={{
              position: 'fixed',
              top: 60,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(7,7,14,0.95)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '2rem',
              zIndex: 99,
            }}
          >
            {navLinks.map(link => (
              <Link
                key={link}
                href={`#${link.toLowerCase()}`}
                onClick={handleNavClick}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text)')}
              >
                {link}
              </Link>
            ))}
            <a
              href="mailto:thomasozichukwu@gmail.com"
              onClick={handleNavClick}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                border: '1px solid var(--border-gold)',
                padding: '0.75rem 1.5rem',
                textDecoration: 'none',
                marginTop: '1rem',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--gold-glow)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Hire Me
            </a>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 900px) {
          .burger {
            display: flex !important;
          }
          .nav-desktop {
            display: none !important;
          }
          .nav-cta {
            display: none !important;
          }
        }
        
        @media (min-width: 901px) {
          .burger {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}
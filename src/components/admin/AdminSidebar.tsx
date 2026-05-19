'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const sections = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

interface Props {
  active: string
  setActive: (s: string) => void
}

export default function AdminSidebar({ active, setActive }: Props) {
  const { logout } = useAuth()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    router.push('/')
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside style={{
        width: '240px', minHeight: '100vh',
        background: 'var(--bg2)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        padding: '2rem 0',
        position: 'fixed', top: 0, left: 0, bottom: 0,
      }} className="admin-sidebar-desktop">
        {/* Logo */}
        <div style={{
          padding: '0 1.5rem 2rem',
          borderBottom: '1px solid var(--border)',
          marginBottom: '1.5rem',
        }}>
          <div style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '1.5rem', fontWeight: 600,
            color: 'var(--gold)', letterSpacing: '0.1em',
          }}>T.O.</div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--text-muted)',
            marginTop: '0.2rem',
          }}>Admin Panel</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0 1rem' }}>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              style={{
                width: '100%', textAlign: 'left',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem', letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: active === s.id ? 'var(--gold)' : 'var(--text-muted)',
                background: active === s.id ? 'var(--gold-glow)' : 'transparent',
                border: 'none',
                borderLeft: `2px solid ${active === s.id ? 'var(--gold)' : 'transparent'}`,
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: '0.25rem',
              }}
            >{s.label}</button>
          ))}
        </nav>

        {/* View Site + Logout */}
        <div style={{ padding: '1.5rem 1rem 0', borderTop: '1px solid var(--border)' }}>
          <a
            href="/"
            target="_blank"
            style={{
              display: 'block', textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem', letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--text-dim)',
              border: '1px solid var(--border)',
              padding: '0.6rem',
              textDecoration: 'none',
              marginBottom: '0.75rem',
              transition: 'all 0.2s',
            } as React.CSSProperties}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.borderColor = 'var(--gold)')}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.borderColor = 'var(--border)')}
          >↗ View Site</a>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              width: '100%',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem', letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#e05555', background: 'transparent',
              border: '1px solid rgba(224,85,85,0.3)',
              padding: '0.6rem', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >{loggingOut ? 'Signing out...' : 'Sign Out'}</button>
        </div>
      </aside>

      {/* Mobile/Tablet Horizontal Tabs */}
      <div style={{
        width: '100%', background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        overflowX: 'auto',
        padding: '0 1rem',
      }} className="admin-tabs-mobile">
        <nav style={{
          display: 'flex', gap: '0.5rem',
          minWidth: 'min-content',
          padding: '0.75rem 0',
        }}>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem', letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: active === s.id ? 'var(--gold)' : 'var(--text-muted)',
                background: active === s.id ? 'var(--gold-glow)' : 'transparent',
                border: `1px solid ${active === s.id ? 'var(--gold)' : 'var(--border)'}`,
                padding: '0.6rem 1rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >{s.label}</button>
          ))}
        </nav>

        {/* Mobile action buttons */}
        <div style={{
          display: 'flex', gap: '0.5rem',
          padding: '0.75rem 0',
          borderTop: '1px solid var(--border)',
          marginTop: '0.75rem',
        }}>
          <a
            href="/"
            target="_blank"
            style={{
              flex: 1, textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem', letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-dim)',
              border: '1px solid var(--border)',
              padding: '0.5rem',
              textDecoration: 'none',
              transition: 'all 0.2s',
            } as React.CSSProperties}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.borderColor = 'var(--gold)')}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.borderColor = 'var(--border)')}
          >View Site</a>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              flex: 1,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem', letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#e05555', background: 'transparent',
              border: '1px solid rgba(224,85,85,0.3)',
              padding: '0.5rem', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >{loggingOut ? 'Signing...' : 'Sign Out'}</button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop {
            display: none !important;
          }
        }
        
        @media (min-width: 769px) {
          .admin-tabs-mobile {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}
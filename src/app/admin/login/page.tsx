'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) router.push('/admin/dashboard')
  }, [user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      router.push('/admin/dashboard')
    } catch {
      setError('Invalid credentials. Access denied.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '2rem',
    }}>
      {/* Grid bg */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '420px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '2.5rem', fontWeight: 600,
            color: 'var(--gold)', letterSpacing: '0.1em',
            marginBottom: '0.5rem',
          }}>T.O.</div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--text-muted)',
          }}>Admin Access</div>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border-gold)',
          padding: '2.5rem',
          position: 'relative',
        }}>
          {/* Gold corner accents */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '20px', height: '1px', background: 'var(--gold)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '20px', background: 'var(--gold)' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '20px', height: '1px', background: 'var(--gold)' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '1px', height: '20px', background: 'var(--gold)' }} />

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', color: 'var(--gold)',
                display: 'block', marginBottom: '0.6rem',
              }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)', padding: '0.8rem 1rem',
                  fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
                  outline: 'none', transition: 'border-color 0.3s',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', color: 'var(--gold)',
                display: 'block', marginBottom: '0.6rem',
              }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)', padding: '0.8rem 1rem',
                  fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
                  outline: 'none', transition: 'border-color 0.3s',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem', color: '#e05555',
                border: '1px solid rgba(224,85,85,0.3)',
                padding: '0.75rem 1rem',
                marginBottom: '1.5rem',
              }}>{error}</div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem', letterSpacing: '0.15em',
                textTransform: 'uppercase', fontWeight: 500,
                color: loading ? 'var(--text-muted)' : 'var(--bg)',
                background: loading ? 'var(--gold-dim)' : 'var(--gold)',
                border: 'none', padding: '0.9rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
              }}
            >
              {loading ? 'Verifying...' : 'Enter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
'use client'
import { useEffect, useState } from 'react'
import { getContact, setContact } from '@/lib/firestore'
import type { ContactData } from '@/types'

const defaults: ContactData = {
  email: 'thomasozichukwu@gmail.com',
  linkedin: 'https://linkedin.com/in/thomas-ozichukwu',
  github: 'https://github.com/ThomasCode',
  twitter: 'https://x.com/ThomasCode',
  subtext: 'Open to remote opportunities, freelance projects, and collaborations in software architecture, full-stack development, and Web3.',
}

export default function AdminContact() {
  const [data, setData] = useState<ContactData>(defaults)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    getContact().then(d => {
      if (d) setData(d)
      setLoading(false)
    })
  }, [])

  const save = async () => {
    setSaving(true)
    setMsg('')
    try {
      await setContact(data)
      setMsg('Contact section saved successfully.')
    } catch {
      setMsg('Error saving. Try again.')
    } finally {
      setSaving(false)
    }
  }

  const set = (key: keyof ContactData, value: string) =>
    setData(prev => ({ ...prev, [key]: value }))

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-dim)' }}>Loading...</div>

  return (
    <div style={{ padding: '2rem' }}>
      <h3 style={{
        fontFamily: 'var(--font-cormorant)',
        fontSize: '1.8rem', color: 'var(--text)',
        marginBottom: '2rem',
      }}>Contact Section</h3>

      {/* Email */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block', fontSize: '0.85rem',
          color: 'var(--gold)', marginBottom: '0.5rem',
          fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>Email Address</label>
        <input
          type="email"
          value={data.email}
          onChange={e => set('email', e.target.value)}
          style={{
            width: '100%', padding: '0.75rem 1rem',
            background: 'var(--bg3)', border: '1px solid var(--border)',
            color: 'var(--text)', fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
          }}
        />
      </div>

      {/* LinkedIn */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block', fontSize: '0.85rem',
          color: 'var(--gold)', marginBottom: '0.5rem',
          fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>LinkedIn URL</label>
        <input
          type="url"
          value={data.linkedin}
          onChange={e => set('linkedin', e.target.value)}
          style={{
            width: '100%', padding: '0.75rem 1rem',
            background: 'var(--bg3)', border: '1px solid var(--border)',
            color: 'var(--text)', fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
          }}
        />
      </div>

      {/* GitHub */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block', fontSize: '0.85rem',
          color: 'var(--gold)', marginBottom: '0.5rem',
          fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>GitHub URL</label>
        <input
          type="url"
          value={data.github}
          onChange={e => set('github', e.target.value)}
          style={{
            width: '100%', padding: '0.75rem 1rem',
            background: 'var(--bg3)', border: '1px solid var(--border)',
            color: 'var(--text)', fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
          }}
        />
      </div>

      {/* Twitter */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block', fontSize: '0.85rem',
          color: 'var(--gold)', marginBottom: '0.5rem',
          fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>Twitter / X URL</label>
        <input
          type="url"
          value={data.twitter}
          onChange={e => set('twitter', e.target.value)}
          style={{
            width: '100%', padding: '0.75rem 1rem',
            background: 'var(--bg3)', border: '1px solid var(--border)',
            color: 'var(--text)', fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
          }}
        />
      </div>

      {/* Subtext */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{
          display: 'block', fontSize: '0.85rem',
          color: 'var(--gold)', marginBottom: '0.5rem',
          fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>Subtitle / Description</label>
        <textarea
          value={data.subtext}
          onChange={e => set('subtext', e.target.value)}
          style={{
            width: '100%', padding: '0.75rem 1rem',
            background: 'var(--bg3)', border: '1px solid var(--border)',
            color: 'var(--text)', fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem', minHeight: '80px', resize: 'vertical',
          }}
        />
      </div>

      {/* Save Button */}
      <button
        onClick={save}
        disabled={saving}
        style={{
          padding: '0.75rem 2rem',
          background: 'var(--gold)',
          color: 'var(--bg)',
          border: 'none',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          cursor: saving ? 'not-allowed' : 'pointer',
          opacity: saving ? 0.6 : 1,
        }}
      >
        {saving ? 'Saving...' : 'Save Contact'}
      </button>

      {msg && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: msg.includes('success') ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
          color: msg.includes('success') ? '#4CAF50' : '#F44336',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          borderLeft: `3px solid ${msg.includes('success') ? '#4CAF50' : '#F44336'}`,
        }}>
          {msg}
        </div>
      )}
    </div>
  )
}

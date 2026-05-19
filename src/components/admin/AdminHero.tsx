'use client'
import { useEffect, useState } from 'react'
import { getHero, setHero } from '@/lib/firestore'
import { parseHighlight } from '@/lib/highlights'
import type { HeroData } from '@/types'

const defaults: HeroData = {
  name: 'Thomas Ozichukwu',
  roles: [
    'Full-Stack Software Engineer',
    'Flutter & Mobile Specialist',
    'Software Architect',
    'Building Scalable SaaS Solutions',
    'Web3 & Blockchain Developer',
  ],
  bio: 'I architect and build scalable digital products — from luxury e-commerce platforms to mobile streaming apps to blockchain infrastructure. Clean code, intentional design, shipped with precision.',
  location: 'Lagos, Nigeria',
  availability: 'Available for remote work',
  yearsExp: 2,
  projectCount: 4,
  techCount: 20,
}

export default function AdminHero() {
  const [data, setData] = useState<HeroData>(defaults)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    getHero().then(d => {
      if (d) setData(d)
      setLoading(false)
    })
  }, [])

  const save = async () => {
    setSaving(true)
    setMsg('')
    try {
      await setHero(data)
      setMsg('Hero section saved successfully.')
    } catch {
      setMsg('Error saving. Try again.')
    } finally {
      setSaving(false)
    }
  }

  const set = (key: keyof HeroData, value: unknown) =>
    setData(prev => ({ ...prev, [key]: value }))

  if (loading) return (
    <div style={mono}>Loading hero data...</div>
  )

  return (
    <div>
      {msg && (
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
          color: msg.includes('Error') ? '#e05555' : '#4caf82',
          border: `1px solid ${msg.includes('Error') ? 'rgba(224,85,85,0.3)' : 'rgba(76,175,130,0.3)'}`,
          padding: '0.75rem 1rem', marginBottom: '1.5rem',
        }}>{msg}</div>
      )}

      <div style={editorBox}>
        {/* Row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input style={inputStyle} value={data.name}
              onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Location</label>
            <input style={inputStyle} value={data.location}
              onChange={e => set('location', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Availability Label</label>
            <input style={inputStyle} value={data.availability}
              onChange={e => set('availability', e.target.value)} />
          </div>
        </div>

        {/* Bio */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>Hero Bio (use \word\ to highlight)</label>
          <textarea
            style={{ ...inputStyle, resize: 'vertical' }}
            rows={3}
            value={data.bio}
            onChange={e => set('bio', e.target.value)}
            placeholder='e.g. I architect and build scalable \digital products\ with precision.'
          />
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            color: 'var(--text-muted)', marginTop: '0.4rem',
          }}>
            Wrap words in backslashes \like this\ to highlight them in gold.
          </div>
        </div>

        {/* Roles */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>Typewriter Roles (one per line, use \word\ to highlight)</label>
          <textarea
            style={{ ...inputStyle, resize: 'vertical' }}
            rows={6}
            value={data.roles.join('\n')}
            onChange={e => set('roles', e.target.value.split('\n').filter(Boolean))}
            placeholder='e.g. \Full-Stack\ Software Engineer'
          />
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            color: 'var(--text-muted)', marginTop: '0.4rem',
          }}>
            Each line cycles through the typewriter animation on the hero. Use \word\ to highlight key skills.
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
          <div>
            <label style={labelStyle}>Years Experience</label>
            <input style={inputStyle} type="number" value={data.yearsExp}
              onChange={e => set('yearsExp', Number(e.target.value))} />
          </div>
          <div>
            <label style={labelStyle}>Project Count</label>
            <input style={inputStyle} type="number" value={data.projectCount}
              onChange={e => set('projectCount', Number(e.target.value))} />
          </div>
          <div>
            <label style={labelStyle}>Technologies Count</label>
            <input style={inputStyle} type="number" value={data.techCount}
              onChange={e => set('techCount', Number(e.target.value))} />
          </div>
        </div>

        <button onClick={save} disabled={saving} style={btnGold}>
          {saving ? 'Saving...' : 'Save Hero Section'}
        </button>
      </div>
    </div>
  )
}

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--gold)',
}
const editorBox: React.CSSProperties = {
  background: 'var(--surface)', border: '1px solid var(--border-gold)', padding: '2rem',
}
const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
  letterSpacing: '0.2em', textTransform: 'uppercase' as const,
  color: 'var(--gold)', display: 'block', marginBottom: '0.5rem',
}
const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)',
  border: '1px solid var(--border)', color: 'var(--text)',
  padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)',
  fontSize: '0.85rem', outline: 'none',
}
const btnGold: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
  letterSpacing: '0.12em', textTransform: 'uppercase' as const,
  color: 'var(--bg)', background: 'var(--gold)',
  border: 'none', padding: '0.75rem 1.5rem',
  cursor: 'pointer', fontWeight: 500,
}
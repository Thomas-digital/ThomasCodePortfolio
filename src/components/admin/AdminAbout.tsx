'use client'
import { useEffect, useState } from 'react'
import { getAbout, setAbout } from '@/lib/firestore'
import { parseHighlight } from '@/lib/highlights'
import type { AboutData } from '@/types'

const defaults: AboutData = {
  paragraphs: [
    'I am a <strong>Full-Stack Software Developer and Architect</strong> with over 2 years of hands-on experience designing and building dynamic, scalable applications across web and mobile platforms.',
    'While I have deep expertise in crafting seamless mobile experiences with <strong>Flutter</strong>, my core strength lies in end-to-end software engineering — from system architecture decisions to the final pixel.',
    'I build robust backends using <strong>Python and Node.js</strong>, design efficient REST and GraphQL APIs, and manage both SQL and NoSQL databases. On the frontend, I focus on mobile-first, responsive design using Tailwind, React, and Next.js.',
    'I thrive in fast-paced environments — <strong>SaaS, e-commerce, fintech</strong> — and excel at asynchronous communication that keeps remote teams aligned. Whether architecting a platform from scratch or integrating complex flows, I focus on writing <strong>clean, maintainable, purposeful code.</strong>',
  ],
  focus: 'Software Architecture',
  focusSub: 'Platform design, scalable systems, Web3 infrastructure',
  stack: 'Full-Stack + Mobile',
  stackSub: 'Next.js · Flutter · Node.js · Python · Supabase',
  domains: 'SaaS · Fintech · E-Commerce',
  domainsSub: 'Building systems that scale with the business',
}

export default function AdminAbout() {
  const [data, setData] = useState<AboutData>(defaults)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    getAbout().then(d => {
      if (d) setData(d)
      setLoading(false)
    })
  }, [])

  const save = async () => {
    setSaving(true)
    setMsg('')
    try {
      await setAbout(data)
      setMsg('About section saved successfully.')
    } catch {
      setMsg('Error saving. Try again.')
    } finally {
      setSaving(false)
    }
  }

  const set = (key: keyof AboutData, value: unknown) =>
    setData(prev => ({ ...prev, [key]: value }))

  if (loading) return (
    <div style={mono}>Loading about data...</div>
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
        {/* Paragraphs */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={labelStyle}>Bio Paragraphs (one per line, HTML allowed, use \word\ to highlight)</label>
          <textarea
            style={{ ...inputStyle, resize: 'vertical' }}
            rows={10}
            value={data.paragraphs.join('\n\n')}
            onChange={e => set('paragraphs',
              e.target.value.split('\n\n').map(p => p.trim()).filter(Boolean)
            )}
          />
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            color: 'var(--text-muted)', marginTop: '0.4rem',
          }}>Separate paragraphs with a blank line. Use &lt;strong&gt; tags for bold or \word\ for highlighted text.</div>
        </div>

        {/* Highlight cards */}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: 'var(--gold)', marginBottom: '1.25rem',
          paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)',
        }}>Highlight Cards</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
          {([
            ['Focus Title', 'focus'],
            ['Focus Subtitle', 'focusSub'],
            ['Stack Title', 'stack'],
            ['Stack Subtitle', 'stackSub'],
            ['Domains Title', 'domains'],
            ['Domains Subtitle', 'domainsSub'],
          ] as [string, keyof AboutData][]).map(([label, key]) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <input
                style={inputStyle}
                value={String(data[key])}
                onChange={e => set(key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <button onClick={save} disabled={saving} style={btnGold}>
          {saving ? 'Saving...' : 'Save About Section'}
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
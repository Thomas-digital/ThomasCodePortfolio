'use client'
import { useEffect, useState } from 'react'
import { getExperience, addExperience, updateExperience, deleteExperience } from '@/lib/firestore'
import { parseHighlight } from '@/lib/highlights'
import { mono, successBox, editorBox, sectionLabel, labelStyle, inputStyle, btnGold, btnOutline, card } from './styles'
import type { Experience } from '@/types'

const empty: Experience = {
  role: '', company: '', type: '', period: '',
  location: '', bullets: [], stack: [], order: 0,
}

export default function AdminExperience() {
  const [items, setItems] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Experience | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [newBullet, setNewBullet] = useState('')

  const load = async () => {
    setLoading(true)
    setItems(await getExperience())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    if (!editing) return
    setSaving(true)
    try {
      isNew
        ? await addExperience(editing)
        : await updateExperience(editing.id!, editing)
      setMsg('Saved.'); setEditing(null); setIsNew(false)
      await load()
    } catch { setMsg('Error saving.') }
    finally { setSaving(false) }
  }

  if (loading) return <div style={mono}>Loading experience...</div>

  return (
    <div>
      {msg && <div style={successBox}>{msg}</div>}

      {editing ? (
        <div style={editorBox}>
          <div style={sectionLabel}>{isNew ? 'New Role' : 'Edit Role'}</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            {([
              ['Role / Title', 'role'],
              ['Company', 'company'],
              ['Type (e.g. Contract · Remote)', 'type'],
              ['Period (e.g. Dec 2025 — Present)', 'period'],
              ['Location', 'location'],
              ['Order', 'order'],
            ] as [string, keyof Experience][]).map(([label, key]) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input
                  style={inputStyle}
                  type={key === 'order' ? 'number' : 'text'}
                  value={String(editing[key] ?? '')}
                  onChange={e => setEditing({
                    ...editing,
                    [key]: key === 'order' ? Number(e.target.value) : e.target.value,
                  })}
                />
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Bullet Points (use \word\ to highlight)</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                style={inputStyle}
                type="text"
                value={newBullet}
                onChange={e => setNewBullet(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    if (newBullet.trim()) {
                      setEditing({ ...editing, bullets: [...editing.bullets, newBullet] })
                      setNewBullet('')
                    }
                  }
                }}
                placeholder='e.g. Designed a \feature\ that increased engagement by 40%'
              />
              <button
                onClick={() => {
                  if (newBullet.trim()) {
                    setEditing({ ...editing, bullets: [...editing.bullets, newBullet] })
                    setNewBullet('')
                  }
                }}
                style={btnGold}
              >
                Add
              </button>
            </div>
            
            {editing.bullets.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {editing.bullets.map((bullet, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      borderRadius: '4px',
                      borderLeft: '3px solid var(--accent-gold)',
                    }}
                  >
                    <span style={{ flex: 1, color: 'var(--text-dim)' }}>• {parseHighlight(bullet)}</span>
                    <button
                      onClick={() => {
                        setEditing({
                          ...editing,
                          bullets: editing.bullets.filter((_, i) => i !== idx),
                        })
                      }}
                      style={{ ...btnOutline, color: '#e05555', borderColor: 'rgba(224,85,85,0.3)', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              color: 'var(--text-muted)', marginTop: '0.4rem',
            }}>
              Wrap words in backslashes to highlight them (e.g., \highlighted text\)
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={labelStyle}>Stack (comma separated)</label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
              value={editing.stack.join(', ')}
              onChange={e => setEditing({
                ...editing,
                stack: e.target.value
                  .split(',')
                  .map(s => s.trim())
                  .filter(s => s.length > 0),
              })}
              placeholder="e.g. Next.js, TypeScript, Supabase"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={save} disabled={saving} style={btnGold}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setEditing(null); setIsNew(false) }} style={btnOutline}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <button onClick={() => { setEditing({ ...empty, order: items.length }); setIsNew(true) }} style={btnGold}>
            + Add Role
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            {items.map(item => (
              <div key={item.id} style={card}>
                <div style={{ flex: 1 }}>
                  <div style={sectionLabel}>{item.period}</div>
                  <div style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '1.3rem', fontWeight: 600,
                    color: 'var(--text)', marginBottom: '0.2rem',
                  }}>{item.role}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                    {item.company} · {item.type}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => { setEditing({ ...item }); setIsNew(false) }} style={btnOutline}>Edit</button>
                  <button onClick={async () => {
                    if (confirm(`Delete "${item.role}"?`)) {
                      await deleteExperience(item.id!); await load()
                    }
                  }} style={{ ...btnOutline, color: '#e05555', borderColor: 'rgba(224,85,85,0.3)' }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
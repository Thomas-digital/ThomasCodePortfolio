'use client'
import { useEffect, useState } from 'react'
import { getEducation, addEducation, updateEducation, deleteEducation } from '@/lib/firestore'
import { parseHighlight } from '@/lib/highlights'
import { mono, successBox, editorBox, sectionLabel, labelStyle, inputStyle, btnGold, btnOutline, card } from './styles'
import type { Education } from '@/types'

const empty: Education = { degree: '', school: '', period: '', grade: '', notes: '', order: 0 }

export default function AdminEducation() {
  const [items, setItems] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Education | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const load = async () => {
    setLoading(true)
    setItems(await getEducation())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    if (!editing) return
    setSaving(true)
    try {
      isNew
        ? await addEducation(editing)
        : await updateEducation(editing.id!, editing)
      setMsg('Saved.'); setEditing(null); setIsNew(false)
      await load()
    } catch { setMsg('Error saving.') }
    finally { setSaving(false) }
  }

  if (loading) return <div style={mono}>Loading education...</div>

  return (
    <div>
      {msg && <div style={successBox}>{msg}</div>}

      {editing ? (
        <div style={editorBox}>
          <div style={sectionLabel}>{isNew ? 'New Entry' : 'Edit Entry'}</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            {([
              ['Degree / Certification', 'degree'],
              ['School', 'school'],
              ['Period', 'period'],
              ['Grade (optional)', 'grade'],
              ['Order', 'order'],
            ] as [string, keyof Education][]).map(([label, key]) => (
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

          <div style={{ marginBottom: '2rem' }}>
            <label style={labelStyle}>Notes (activities, highlights, use \word\ to highlight)</label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical' }}
              rows={3}
              value={editing.notes ?? ''}
              onChange={e => setEditing({ ...editing, notes: e.target.value })}
              placeholder="e.g. President of \Debate Club\, organized \3 national competitions\"
            />
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              color: 'var(--text-muted)', marginTop: '0.4rem',
            }}>
              Use \word\ to highlight important achievements or activities.
            </div>
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
            + Add Education
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            {items.map(item => (
              <div key={item.id} style={card}>
                <div style={{ flex: 1 }}>
                  <div style={sectionLabel}>{item.period}</div>
                  <div style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '1.3rem', fontWeight: 600, color: 'var(--text)',
                  }}>{item.degree}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                    {item.school}
                  </div>
                  {item.notes && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                      {parseHighlight(item.notes)}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => { setEditing({ ...item }); setIsNew(false) }} style={btnOutline}>Edit</button>
                  <button onClick={async () => {
                    if (confirm(`Delete "${item.degree}"?`)) {
                      await deleteEducation(item.id!); await load()
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
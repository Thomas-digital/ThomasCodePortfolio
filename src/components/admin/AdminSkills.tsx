'use client'
import { useEffect, useState } from 'react'
import { getSkills, addSkill, updateSkill, deleteSkill } from '@/lib/firestore'
import { parseHighlight } from '@/lib/highlights'
import type { Skill } from '@/types'

const empty: Skill = { category: '', tags: [], order: 0 }

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Skill | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const load = async () => {
    setLoading(true)
    setSkills(await getSkills())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    if (!editing) return
    setSaving(true)
    try {
      isNew
        ? await addSkill(editing)
        : await updateSkill(editing.id!, editing)
      setMsg('Saved successfully.')
      setEditing(null)
      setIsNew(false)
      await load()
    } catch {
      setMsg('Error saving. Try again.')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string, category: string) => {
    if (!confirm(`Delete "${category}"?`)) return
    await deleteSkill(id)
    await load()
  }

  if (loading) return (
    <div style={mono}>Loading skills...</div>
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

      {editing ? (
        <div style={editorBox}>
          <div style={sectionLabel}>
            {isNew ? 'New Skill Category' : 'Edit Skill Category'}
          </div>

          {/* Category name */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Category Name</label>
            <input
              style={inputStyle}
              value={editing.category}
              placeholder="e.g. Frontend, Backend, Mobile..."
              onChange={e => setEditing({ ...editing, category: e.target.value })}
            />
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Tags (comma separated, use \word\ to highlight)</label>
            <input
              style={inputStyle}
              value={editing.tags.join(', ')}
              placeholder="e.g. React.js, \Next.js\, Tailwind CSS"
              onChange={e => setEditing({
                ...editing,
                tags: e.target.value
                  .split(',')
                  .map(t => t.trim())
                  .filter(Boolean),
              })}
            />
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              color: 'var(--text-muted)', marginTop: '0.4rem',
            }}>
              Separate each skill with a comma. Use \word\ to highlight important skills.
            </div>
          </div>

          {/* Preview */}
          {editing.tags.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ ...labelStyle, marginBottom: '0.75rem' }}>Preview</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {editing.tags.map(t => (
                  <span key={t} style={tagStyle}>{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Order */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={labelStyle}>Display Order (0 = first)</label>
            <input
              style={{ ...inputStyle, maxWidth: '120px' }}
              type="number"
              value={editing.order}
              onChange={e => setEditing({ ...editing, order: Number(e.target.value) })}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={save} disabled={saving} style={btnGold}>
              {saving ? 'Saving...' : isNew ? 'Add Category' : 'Save Changes'}
            </button>
            <button
              onClick={() => { setEditing(null); setIsNew(false) }}
              style={btnOutline}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <button
            onClick={() => {
              setEditing({ ...empty, order: skills.length })
              setIsNew(true)
              setMsg('')
            }}
            style={btnGold}
          >
            + Add Skill Category
          </button>

          {skills.length === 0 && (
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
              color: 'var(--text-muted)', marginTop: '1.5rem',
            }}>
              No skill categories yet. Add your first one.
            </div>
          )}

          <div style={{
            display: 'flex', flexDirection: 'column',
            gap: '1rem', marginTop: '1.5rem',
          }}>
            {skills.map(s => (
              <div key={s.id} style={card}>
                <div style={{ flex: 1 }}>
                  {/* Category label */}
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem', letterSpacing: '0.2em',
                    textTransform: 'uppercase', color: 'var(--gold)',
                    marginBottom: '0.6rem',
                  }}>{parseHighlight(s.category)}</div>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {s.tags.map(t => (
                      <span key={t} style={tagStyle}>{parseHighlight(t)}</span>
                    ))}
                  </div>

                  {/* Order badge */}
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                    color: 'var(--text-muted)', marginTop: '0.75rem',
                  }}>Order: {s.order} · {s.tags.length} tags</div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '80px' }}>
                  <button
                    onClick={() => { setEditing({ ...s }); setIsNew(false); setMsg('') }}
                    style={btnOutline}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(s.id!, s.category)}
                    style={{ ...btnOutline, color: '#e05555', borderColor: 'rgba(224,85,85,0.3)' }}
                  >
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

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--gold)',
}
const editorBox: React.CSSProperties = {
  background: 'var(--surface)', border: '1px solid var(--border-gold)', padding: '2rem',
}
const sectionLabel: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
  letterSpacing: '0.2em', textTransform: 'uppercase' as const,
  color: 'var(--gold)', marginBottom: '1.5rem',
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
const btnOutline: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
  letterSpacing: '0.12em', textTransform: 'uppercase' as const,
  color: 'var(--text-dim)', background: 'transparent',
  border: '1px solid var(--border)',
  padding: '0.75rem 1.5rem', cursor: 'pointer',
}
const card: React.CSSProperties = {
  background: 'var(--surface)', border: '1px solid var(--border)',
  padding: '1.5rem', display: 'flex',
  alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem',
}
const tagStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
  color: 'var(--text-muted)', border: '1px solid var(--border)',
  padding: '0.2rem 0.6rem',
}
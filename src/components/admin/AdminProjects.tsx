'use client'
import { useEffect, useState } from 'react'
import {
  getProjects, addProject, updateProject, deleteProject
} from '@/lib/firestore'
import { parseHighlight } from '@/lib/highlights'
import type { Project } from '@/types'

const empty: Project = {
  title: '', tag: '', description: '',
  stack: [], link: '', linkLabel: '',
  order: 0, visible: true,
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Project | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const load = async () => {
    setLoading(true)
    const data = await getProjects()
    setProjects(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew = () => {
    setEditing({ ...empty, order: projects.length })
    setIsNew(true)
    setMsg('')
  }

  const openEdit = (p: Project) => {
    setEditing({ ...p })
    setIsNew(false)
    setMsg('')
  }

  const cancel = () => { setEditing(null); setIsNew(false) }

  const save = async () => {
    if (!editing) return
    setSaving(true)
    try {
      if (isNew) {
        await addProject(editing)
      } else {
        await updateProject(editing.id!, editing)
      }
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

  const remove = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    await deleteProject(id)
    await load()
  }

  const toggle = async (p: Project) => {
    await updateProject(p.id!, { visible: !p.visible })
    await load()
  }

  if (loading) return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--gold)' }}>
      Loading projects...
    </div>
  )

  return (
    <div>
      {msg && (
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
          color: '#4caf82', border: '1px solid rgba(76,175,130,0.3)',
          padding: '0.75rem 1rem', marginBottom: '1.5rem',
        }}>{msg}</div>
      )}

      {/* Editor */}
      {editing ? (
        <Editor
          data={editing}
          isNew={isNew}
          saving={saving}
          onChange={setEditing}
          onSave={save}
          onCancel={cancel}
        />
      ) : (
        <>
          {/* Add button */}
          <button onClick={openNew} style={btnGold}>
            + Add Project
          </button>

          {/* Project list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            {projects.length === 0 && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                No projects yet. Add your first one.
              </div>
            )}
            {projects.map(p => (
              <div key={p.id} style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                padding: '1.5rem',
                display: 'flex', alignItems: 'flex-start',
                justifyContent: 'space-between', gap: '1rem',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: 'var(--gold)', marginBottom: '0.4rem',
                  }}>{p.tag}</div>
                  <div style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '1.3rem', fontWeight: 600,
                    color: p.visible ? 'var(--text)' : 'var(--text-muted)',
                    marginBottom: '0.4rem',
                  }}>{p.title}</div>
                  <div style={{
                    fontSize: '0.85rem', color: 'var(--text-muted)',
                    marginBottom: '0.75rem', lineHeight: 1.5,
                  }}>{parseHighlight(p.description.slice(0, 100))}...</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {p.stack.map(t => (
                      <span key={t} style={stackTag}>{t}</span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '100px' }}>
                  <button onClick={() => openEdit(p)} style={btnOutline}>Edit</button>
                  <button onClick={() => toggle(p)} style={{
                    ...btnOutline,
                    color: p.visible ? '#4caf82' : 'var(--text-muted)',
                    borderColor: p.visible ? 'rgba(76,175,130,0.4)' : 'var(--border)',
                  }}>
                    {p.visible ? 'Visible' : 'Hidden'}
                  </button>
                  <button onClick={() => remove(p.id!, p.title)} style={{
                    ...btnOutline, color: '#e05555',
                    borderColor: 'rgba(224,85,85,0.3)',
                  }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function Editor({ data, isNew, saving, onChange, onSave, onCancel }: {
  data: Project
  isNew: boolean
  saving: boolean
  onChange: (p: Project) => void
  onSave: () => void
  onCancel: () => void
}) {
  const set = (key: keyof Project, value: unknown) =>
    onChange({ ...data, [key]: value })

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border-gold)',
      padding: '2rem',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'var(--gold)', marginBottom: '2rem',
      }}>{isNew ? 'New Project' : 'Edit Project'}</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <Field label="Title" value={data.title}
          onChange={v => set('title', v)} />
        <Field label="Tag (e.g. E-Commerce · Web)" value={data.tag}
          onChange={v => set('tag', v)} />
        <Field label="Link URL" value={data.link}
          onChange={v => set('link', v)} />
        <Field label="Link Label (e.g. View Live)" value={data.linkLabel}
          onChange={v => set('linkLabel', v)} />
        <Field label="Order (0 = first)" value={String(data.order)}
          onChange={v => set('order', Number(v))} type="number" />
      </div>

      <div style={{ marginTop: '1.25rem' }}>
        <label style={labelStyle}>Description (use \word\ to highlight)</label>
        <textarea
          value={data.description}
          onChange={e => set('description', e.target.value)}
          rows={4}
          style={{ ...inputStyle, resize: 'vertical' }}
          placeholder="e.g. Built a \real-time\ dashboard for \live analytics\"
        />
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          color: 'var(--text-muted)', marginTop: '0.4rem',
        }}>
          Use \word\ to highlight key features.
        </div>
      </div>

      <div style={{ marginTop: '1.25rem' }}>
        <label style={labelStyle}>Stack (comma separated)</label>
        <textarea
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'var(--font-mono)', minHeight: '80px' }}
          value={data.stack.join(', ')}
          onChange={e => {
            const items = e.target.value
              .split(',')
              .map(s => s.trim())
              .filter(s => s.length > 0)
            set('stack', items)
          }}
          placeholder="e.g. Next.js, TypeScript, Supabase, Tailwind"
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button onClick={onSave} disabled={saving} style={btnGold}>
          {saving ? 'Saving...' : isNew ? 'Add Project' : 'Save Changes'}
        </button>
        <button onClick={onCancel} style={btnOutline}>Cancel</button>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }: {
  label: string; value: string
  onChange: (v: string) => void; type?: string
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
  letterSpacing: '0.2em', textTransform: 'uppercase',
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
  letterSpacing: '0.12em', textTransform: 'uppercase',
  color: 'var(--bg)', background: 'var(--gold)',
  border: 'none', padding: '0.75rem 1.5rem',
  cursor: 'pointer', fontWeight: 500,
}
const btnOutline: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
  letterSpacing: '0.12em', textTransform: 'uppercase',
  color: 'var(--text-dim)', background: 'transparent',
  border: '1px solid var(--border)',
  padding: '0.75rem 1.5rem', cursor: 'pointer',
}
const stackTag: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
  color: 'var(--text-muted)', border: '1px solid var(--border)',
  padding: '0.2rem 0.5rem',
}
import React from 'react'

export const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--gold)',
}
export const successBox: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
  color: '#4caf82', border: '1px solid rgba(76,175,130,0.3)',
  padding: '0.75rem 1rem', marginBottom: '1.5rem',
}
export const editorBox: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border-gold)',
  padding: '2rem',
}
export const sectionLabel: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
  letterSpacing: '0.2em', textTransform: 'uppercase' as const,
  color: 'var(--gold)', marginBottom: '0.5rem',
}
export const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
  letterSpacing: '0.2em', textTransform: 'uppercase' as const,
  color: 'var(--gold)', display: 'block', marginBottom: '0.5rem',
}
export const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)',
  border: '1px solid var(--border)', color: 'var(--text)',
  padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)',
  fontSize: '0.85rem', outline: 'none',
}
export const btnGold: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
  letterSpacing: '0.12em', textTransform: 'uppercase' as const,
  color: 'var(--bg)', background: 'var(--gold)',
  border: 'none', padding: '0.75rem 1.5rem',
  cursor: 'pointer', fontWeight: 500,
}
export const btnOutline: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
  letterSpacing: '0.12em', textTransform: 'uppercase' as const,
  color: 'var(--text-dim)', background: 'transparent',
  border: '1px solid var(--border)',
  padding: '0.75rem 1.5rem', cursor: 'pointer',
}
export const card: React.CSSProperties = {
  background: 'var(--surface)', border: '1px solid var(--border)',
  padding: '1.5rem', display: 'flex',
  alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem',
}
export const tag: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
  color: 'var(--text-muted)', border: '1px solid var(--border)',
  padding: '0.2rem 0.5rem',
}
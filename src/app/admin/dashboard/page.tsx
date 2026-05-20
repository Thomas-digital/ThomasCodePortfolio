'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHero from '@/components/admin/AdminHero'
import AdminAbout from '@/components/admin/AdminAbout'
import AdminSkills from '@/components/admin/AdminSkills'
import AdminExperience from '@/components/admin/AdminExperience'
import AdminProjects from '@/components/admin/AdminProjects'
import AdminEducation from '@/components/admin/AdminEducation'
import AdminContact from '@/components/admin/AdminContact'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [active, setActive] = useState('projects')

  useEffect(() => {
    if (!loading && !user) router.push('/admin/login')
  }, [user, loading, router])

  if (loading || !user) return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
      letterSpacing: '0.15em', color: 'var(--gold)',
    }}>Verifying access...</div>
  )

  const panels: Record<string, React.ReactNode> = {
    hero: <AdminHero />,
    about: <AdminAbout />,
    skills: <AdminSkills />,
    experience: <AdminExperience />,
    projects: <AdminProjects />,
    education: <AdminEducation />,
    contact: <AdminContact />,
  }

  return (
    <>
      <div style={{
        minHeight: '100vh', background: 'var(--bg)',
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        gridTemplateRows: 'auto 1fr',
      }}>
        <AdminSidebar active={active} setActive={setActive} />

        {/* Main content */}
        <main style={{
          padding: '3rem', minHeight: '100vh',
          overflowY: 'auto',
          gridColumn: '2',
          gridRow: '1 / -1',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem', letterSpacing: '0.25em',
            textTransform: 'uppercase', color: 'var(--gold)',
            marginBottom: '0.5rem',
          }}>Managing</div>
          <h1 style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '2.5rem', fontWeight: 600,
            color: 'var(--text)', marginBottom: '2.5rem',
            textTransform: 'capitalize',
          }}>{active}</h1>

          {panels[active]}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          main {
            grid-column: 1 !important;
            grid-row: 2 !important;
            padding: 1.5rem !important;
          }
          main h1 {
            font-size: 1.75rem !important;
            margin-bottom: 1.5rem !important;
          }
        }
      `}</style>
    </>
  )
}
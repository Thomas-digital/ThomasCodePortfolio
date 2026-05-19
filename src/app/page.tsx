import Navbar from '@/components/nav/Navbar'
import Hero from '@/components/hero/Hero'
import About from '@/components/about/About'
import Skills from '@/components/skills/Skills'
import Experience from '@/components/experience/Experience'
import Projects from '@/components/projects/Projects'
import Education from '@/components/education/Education'
import Contact from '@/components/contact/Contact'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Education />
      <Contact />
    </main>
  )
}
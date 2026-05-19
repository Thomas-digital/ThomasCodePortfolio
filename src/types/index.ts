export interface Project {
  id?: string
  title: string
  tag: string
  description: string
  stack: string[]
  link: string
  linkLabel: string
  order: number
  visible: boolean
}

export interface Skill {
  id?: string
  category: string
  tags: string[]
  order: number
}

export interface Experience {
  id?: string
  role: string
  company: string
  type: string
  period: string
  location: string
  bullets: string[]
  stack: string[]
  order: number
}

export interface Education {
  id?: string
  degree: string
  school: string
  period: string
  field?: string
  grade?: string
  notes?: string
  order: number
}

export interface HeroData {
  id?: string
  name: string
  roles: string[]
  bio: string
  location: string
  availability: string
  yearsExp: number
  projectCount: number
  techCount: number
}

export interface AboutData {
  id?: string
  paragraphs: string[]
  focus: string
  focusSub: string
  stack: string
  stackSub: string
  domains: string
  domainsSub: string
}

export interface ContactData {
  id?: string
  email: string
  linkedin: string
  github: string
  twitter: string
  subtext: string
}
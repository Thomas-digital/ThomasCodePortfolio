import {
  collection, doc, getDocs, getDoc,
  setDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy
} from 'firebase/firestore'
import { db } from './firebase'
import type {
  Project, Skill, Experience,
  Education, HeroData, AboutData, ContactData
} from '@/types'

// ── PROJECTS ──────────────────────────────────────
export const getProjects = async (): Promise<Project[]> => {
  const q = query(collection(db, 'projects'), orderBy('order'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Project))
}
export const addProject = (data: Project) => addDoc(collection(db, 'projects'), data)
export const updateProject = (id: string, data: Partial<Project>) => updateDoc(doc(db, 'projects', id), data)
export const deleteProject = (id: string) => deleteDoc(doc(db, 'projects', id))

// ── SKILLS ────────────────────────────────────────
export const getSkills = async (): Promise<Skill[]> => {
  const q = query(collection(db, 'skills'), orderBy('order'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Skill))
}
export const addSkill = (data: Skill) => addDoc(collection(db, 'skills'), data)
export const updateSkill = (id: string, data: Partial<Skill>) => updateDoc(doc(db, 'skills', id), data)
export const deleteSkill = (id: string) => deleteDoc(doc(db, 'skills', id))

// ── EXPERIENCE ────────────────────────────────────
export const getExperience = async (): Promise<Experience[]> => {
  const q = query(collection(db, 'experience'), orderBy('order'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Experience))
}
export const addExperience = (data: Experience) => addDoc(collection(db, 'experience'), data)
export const updateExperience = (id: string, data: Partial<Experience>) => updateDoc(doc(db, 'experience', id), data)
export const deleteExperience = (id: string) => deleteDoc(doc(db, 'experience', id))

// ── EDUCATION ─────────────────────────────────────
export const getEducation = async (): Promise<Education[]> => {
  const q = query(collection(db, 'education'), orderBy('order'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Education))
}
export const addEducation = (data: Education) => addDoc(collection(db, 'education'), data)
export const updateEducation = (id: string, data: Partial<Education>) => updateDoc(doc(db, 'education', id), data)
export const deleteEducation = (id: string) => deleteDoc(doc(db, 'education', id))

// ── HERO ──────────────────────────────────────────
export const getHero = async (): Promise<HeroData | null> => {
  const snap = await getDoc(doc(db, 'siteData', 'hero'))
  return snap.exists() ? { id: snap.id, ...snap.data() } as HeroData : null
}
export const setHero = (data: HeroData) => setDoc(doc(db, 'siteData', 'hero'), data)

// ── ABOUT ─────────────────────────────────────────
export const getAbout = async (): Promise<AboutData | null> => {
  const snap = await getDoc(doc(db, 'siteData', 'about'))
  return snap.exists() ? { id: snap.id, ...snap.data() } as AboutData : null
}
export const setAbout = (data: AboutData) => setDoc(doc(db, 'siteData', 'about'), data)

// ── CONTACT ───────────────────────────────────────
export const getContact = async (): Promise<ContactData | null> => {
  const snap = await getDoc(doc(db, 'siteData', 'contact'))
  return snap.exists() ? { id: snap.id, ...snap.data() } as ContactData : null
}
export const setContact = (data: ContactData) => setDoc(doc(db, 'siteData', 'contact'), data)
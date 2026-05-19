'use client'
import { useCustomCursor, useRevealOnScroll, useCounterAnimation } from '@/hooks/useAnimations'

export default function AnimationProvider({ children }: { children: React.ReactNode }) {
  useCustomCursor()
  useRevealOnScroll()
  useCounterAnimation()

  return (
    <>
      <div className="cursor" id="cursor"></div>
      <div className="cursor-ring" id="cursor-ring"></div>
      {children}
    </>
  )
}

import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import AnimationProvider from '@/components/AnimationProvider'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
})
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})
const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-mono',
})

export const metadata: Metadata = {
  title: 'Thomas Ozichukwu — Software Architect',
  description: 'Full-Stack Software Engineer & Architect. Building scalable SaaS, fintech, and Web3 solutions.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable}`}>
        <AuthProvider>
          <AnimationProvider>
            {children}
          </AnimationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
'use client'
import { useEffect } from 'react'

// Cache animation state in localStorage to prevent delays on revisits
const ANIMATION_CACHE_KEY = 'portfolio-animations-cache'

function getAnimationCache() {
  if (typeof window === 'undefined') return null
  try {
    const cached = localStorage.getItem(ANIMATION_CACHE_KEY)
    return cached ? JSON.parse(cached) : null
  } catch {
    return null
  }
}

function saveAnimationCache(data: any) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(ANIMATION_CACHE_KEY, JSON.stringify(data))
  } catch {
    // Silently fail if localStorage unavailable
  }
}

export function useCustomCursor() {
  useEffect(() => {
    const cursor = document.getElementById('cursor')
    const ring = document.getElementById('cursor-ring')
    let mx = 0, my = 0, rx = 0, ry = 0

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      if (cursor) {
        cursor.style.left = mx + 'px'
        cursor.style.top = my + 'px'
      }
    }

    const animateRing = () => {
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      if (ring) {
        ring.style.left = rx + 'px'
        ring.style.top = ry + 'px'
      }
      requestAnimationFrame(animateRing)
    }

    document.addEventListener('mousemove', handleMouseMove)
    animateRing()

    // Cursor scale on interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, .skill-tag, .project-card, input, textarea'
    )
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (ring) {
          ring.style.transform = 'translate(-50%,-50%) scale(1.5)'
          ring.style.borderColor = 'rgba(201,168,76,0.8)'
        }
      })
      el.addEventListener('mouseleave', () => {
        if (ring) {
          ring.style.transform = 'translate(-50%,-50%) scale(1)'
          ring.style.borderColor = 'rgba(201,168,76,0.5)'
        }
      })
    })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
}

export function useRevealOnScroll() {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal, .timeline-item')
    const cache = getAnimationCache() || { visibleElements: [] }
    
    // Enable animations on all reveal elements
    reveals.forEach((el, idx) => {
      el.classList.add('animate')
      // Assign a data-reveal-id if not present
      if (!el.hasAttribute('data-reveal-id')) {
        el.setAttribute('data-reveal-id', `reveal-${idx}`)
      }
    })
    
    // Restore cached visible state immediately (no delay)
    const visibleSet = new Set(cache.visibleElements)
    reveals.forEach(el => {
      const revealId = el.getAttribute('data-reveal-id')
      if (revealId && visibleSet.has(revealId)) {
        el.classList.add('visible')
      }
    })
    
    const observer = new IntersectionObserver(
      entries => {
        let updated = false
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            const revealId = entry.target.getAttribute('data-reveal-id')
            if (revealId && !visibleSet.has(revealId)) {
              visibleSet.add(revealId)
              updated = true
            }
            observer.unobserve(entry.target)
          }
        })
        // Save updated cache
        if (updated) {
          saveAnimationCache({ ...cache, visibleElements: Array.from(visibleSet) })
        }
      },
      { threshold: 0.12 }
    )

    reveals.forEach(el => {
      const revealId = el.getAttribute('data-reveal-id')
      if (!revealId || !visibleSet.has(revealId)) {
        observer.observe(el)
      }
    })

    return () => {
      reveals.forEach(el => observer.unobserve(el))
    }
  }, [])
}

export function useCounterAnimation() {
  useEffect(() => {
    const counters = document.querySelectorAll('[data-count]')
    const cache = getAnimationCache() || { counters: {} }
    
    // Assign IDs to counters
    counters.forEach((el, idx) => {
      if (!el.hasAttribute('data-counter-id')) {
        el.setAttribute('data-counter-id', `counter-${idx}`)
      }
    })
    
    // Restore cached counter values immediately (no animation delay)
    counters.forEach(el => {
      const counterId = el.getAttribute('data-counter-id')
      if (counterId && cache.counters[counterId]) {
        (el as HTMLElement).textContent = cache.counters[counterId]
      }
    })
    
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const counterId = entry.target.getAttribute('data-counter-id')
            // Only animate if not already cached
            if (!counterId || !cache.counters[counterId]) {
              const target = parseInt((entry.target as HTMLElement).dataset.count || '0')
              let current = 0
              const step = target / 50
              const interval = setInterval(() => {
                current = Math.min(current + step, target)
                const finalValue = Math.round(current) + '+'
                ;(entry.target as HTMLElement).textContent = finalValue
                if (current >= target) {
                  clearInterval(interval)
                  // Cache the final value
                  if (counterId) {
                    cache.counters[counterId] = finalValue
                    saveAnimationCache(cache)
                  }
                }
              }, 30)
            }
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 }
    )

    counters.forEach(el => observer.observe(el))

    return () => {
      counters.forEach(el => observer.unobserve(el))
    }
  }, [])
}

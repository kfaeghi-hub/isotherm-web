'use client'

// Client component boundary required for next/dynamic with ssr:false.
// Also owns the scroll-progress tracker so the canvas component stays pure.

import { useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { ENABLE_SCROLL_STORY, STORY_HEIGHT_VH } from '@/lib/scrollStoryConfig'

const HomepageCanvas = dynamic(
  () => import('./HomepageCanvas').then(m => ({ default: m.HomepageCanvas })),
  { ssr: false },
)

export function HomepageCanvasWrapper() {
  // Ref updated on every scroll event — no re-render, the canvas reads it in useFrame
  const scrollProgressRef = useRef(0)

  useEffect(() => {
    if (!ENABLE_SCROLL_STORY) return

    function update() {
      // The story plays while the outer hero wrapper is the active scroll container.
      // Progress = scrollY / (wrapperHeight - viewport) which maps [0 → 1] as the
      // user scrolls through the full (STORY_HEIGHT_VH - 100)vh story range.
      const wrapper = document.getElementById('hero-scroll-wrapper')
      if (!wrapper) { scrollProgressRef.current = 0; return }

      const storyScrollPx = wrapper.offsetHeight - window.innerHeight
      if (storyScrollPx <= 0) { scrollProgressRef.current = 0; return }

      scrollProgressRef.current = Math.min(1, Math.max(0, window.scrollY / storyScrollPx))
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  // STORY_HEIGHT_VH is consumed in page.tsx (server side) for the wrapper height.
  // Exporting here keeps it co-located with the scroll logic that uses it.
  void STORY_HEIGHT_VH

  return <HomepageCanvas scrollProgressRef={scrollProgressRef} />
}

'use client'

// Client component boundary — required because next/dynamic with ssr:false
// cannot be used directly in Server Components (page.tsx).
// This wrapper is imported as a normal client component from the server page;
// the actual Three.js canvas is dynamically loaded in a separate JS chunk.

import dynamic from 'next/dynamic'

const HeroBuildingCanvas = dynamic(
  () => import('./HeroBuildingCanvas').then(m => ({ default: m.HeroBuildingCanvas })),
  { ssr: false },
)

export function HeroBuildingWrapper() {
  return <HeroBuildingCanvas />
}

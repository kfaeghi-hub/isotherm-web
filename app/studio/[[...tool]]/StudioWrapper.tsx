'use client'

import dynamic from 'next/dynamic'

// Sanity Studio calls createContext at module load — must be excluded from SSR
const StudioClient = dynamic(() => import('./StudioClient'), { ssr: false })

export default function StudioWrapper() {
  return <StudioClient />
}

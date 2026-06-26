'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion, animate } from 'motion/react'
import { cn } from '@/lib/utils'

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const
export const REVEAL_TRANSITION = { duration: 0.5, ease: EASE_OUT_EXPO } as const
const HIDDEN  = { opacity: 0, y: 14 } as const
const VISIBLE = { opacity: 1, y: 0  } as const

// FadeUp — fade + translate 14px on scroll-into-view, fires once.
// SSR safety: always uses initial={HIDDEN} so server and client produce
// identical HTML. For reduced-motion users, animate={VISIBLE} with
// duration:0 shows content instantly after hydration (no whileInView).
export function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      className={cn(className)}
      initial={HIDDEN}
      animate={shouldReduce ? VISIBLE : undefined}
      whileInView={shouldReduce ? undefined : VISIBLE}
      viewport={shouldReduce ? undefined : { once: true, amount: 0.12 }}
      transition={shouldReduce ? { duration: 0 } : { ...REVEAL_TRANSITION, delay }}
    >
      {children}
    </motion.div>
  )
}

// StatCounter — animates numeric stat values (e.g. "280+") on first view.
// SSR safety: always initializes display to 0 so server and client match.
// For reduced-motion users, useEffect immediately sets the final value.
function parseStatValue(raw: string): { num: number; suffix: string } {
  const m = raw.match(/^(\d+(?:\.\d+)?)(.*)/)
  return m ? { num: parseFloat(m[1]), suffix: m[2] } : { num: 0, suffix: raw }
}

export function StatCounter({ value }: { value: string }) {
  const ref          = useRef<HTMLSpanElement>(null)
  const isInView     = useInView(ref, { once: true })
  const shouldReduce = useReducedMotion()
  const { num, suffix } = parseStatValue(value)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (shouldReduce) {
      setDisplay(num)
      return
    }
    if (!isInView) return
    const controls = animate(0, num, {
      duration:  1.8,
      ease:      'easeOut',
      onUpdate(v) { setDisplay(Math.round(v)) },
    })
    return controls.stop
  }, [isInView, num, shouldReduce])

  return <span ref={ref}>{display}{suffix}</span>
}

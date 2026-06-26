'use client'

/**
 * Shared motion primitives for the Isotherm site.
 * All animations follow spec §6: fade + small upward translate only,
 * ≤60ms stagger, fires once, disabled for prefers-reduced-motion.
 *
 * Patterns:
 *   <FadeUp>block content</FadeUp>
 *   <FadeUp delay={i * 0.06} className="flex flex-col">grid item</FadeUp>
 *   <StatCounter value="280+" />
 */

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion, animate } from 'motion/react'
import { cn } from '@/lib/utils'

// ─── Shared transition ────────────────────────────────────────────────────────

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

/** Apply to every reveal — duration 500ms, expo-ease-out, no bounce. */
export const REVEAL_TRANSITION = {
  duration: 0.5,
  ease:     EASE_OUT_EXPO,
} as const

const HIDDEN  = { opacity: 0, y: 14 } as const
const VISIBLE = { opacity: 1, y: 0  } as const

// ─── FadeUp ───────────────────────────────────────────────────────────────────

/**
 * Fades + translates upward 14px on scroll-into-view, once.
 * Pass `delay={i * 0.06}` for ≤60ms stagger within a grid.
 * Pass `className` for layout control (e.g. "flex flex-col" for grid cells).
 */
export function FadeUp({
  children,
  delay = 0,
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  delay?:   number
  className?: string
  as?: 'div' | 'section' | 'article' | 'li'
}) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      className={cn(className)}
      initial={shouldReduce ? false : HIDDEN}
      whileInView={shouldReduce ? {} : VISIBLE}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ ...REVEAL_TRANSITION, delay }}
    >
      {children}
    </motion.div>
  )
}

// ─── StatCounter ──────────────────────────────────────────────────────────────

function parseStatValue(raw: string): { num: number; suffix: string } {
  const m = raw.match(/^(\d+(?:\.\d+)?)(.*)/)
  return m ? { num: parseFloat(m[1]), suffix: m[2] } : { num: 0, suffix: raw }
}

/**
 * Animates a stat value (e.g. "280+") by counting up from 0 when first viewed.
 * The numeric portion counts; any suffix ("+", "M+", "years") appears immediately.
 * With prefers-reduced-motion, shows the final value statically.
 */
export function StatCounter({ value }: { value: string }) {
  const ref          = useRef<HTMLSpanElement>(null)
  const isInView     = useInView(ref, { once: true })
  const shouldReduce = useReducedMotion()
  const { num, suffix } = parseStatValue(value)
  const [display, setDisplay] = useState(shouldReduce ? num : 0)

  useEffect(() => {
    if (!isInView || shouldReduce) return
    const controls = animate(0, num, {
      duration:  1.8,
      ease:      'easeOut',
      onUpdate(v) { setDisplay(Math.round(v)) },
    })
    return controls.stop
  }, [isInView, num, shouldReduce])

  return <span ref={ref}>{display}{suffix}</span>
}

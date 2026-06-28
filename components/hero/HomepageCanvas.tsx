'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'
import { ENABLE_SCROLL_STORY } from '@/lib/scrollStoryConfig'

// ─── Tuning constants ─────────────────────────────────────────────────────────
//
//  ROTATION_SPEED    rad/s. 0.055 ≈ 114 s/revolution. Lower = slower.
//  FLOORS / BAYS_*   Building dimensions. More floors = taller building.
//  FLOOR_HEIGHT      Floor-to-floor height in model units.
//  BAY_WIDTH         Bay span in model units.
//  SLAB_SUBDIVISIONS Interior grid lines per bay (decking grid density).
//  FOG_DENSITY       Exponential fog. Higher = building fades faster at depth.
//
// Camera keyframes, MEP opacity, and highlight curves live below the geometry.
// ─────────────────────────────────────────────────────────────────────────────

const ROTATION_SPEED    = 0.055
const FLOORS            = 5
const BAYS_X            = 3
const BAYS_Z            = 3
const FLOOR_HEIGHT      = 0.44
const BAY_WIDTH         = 0.52
const SLAB_SUBDIVISIONS = 3
const FOG_DENSITY       = 0.28
const TOTAL_H           = FLOORS * FLOOR_HEIGHT

// Brand colours (design tokens §5)
const C_FRAME = new THREE.Color(0x2e6db4)   // steel — primary structural lines
const C_SLAB  = new THREE.Color(0x1c559a)   // mid-blue — slab interior grid
const C_MEP   = new THREE.Color(0x4d8fc7)   // light blue — MEP/systems overlay

// ─── Camera keyframes ─────────────────────────────────────────────────────────
// [scrollProgress (0–1), cameraX, cameraY, cameraZ]
// Scene always looks at (0, 0, 0). Adjust positions to change framing.
//
//  0.00  Hero:     classic 3/4 architectural view
//  0.18  Services: pulled back slightly, building fully readable
//  0.40  Approach step 1: lower angle — structure emphasis
//  0.58  Approach step 3: elevated overview — verification perspective
//  0.75  Stats:    stable mid-distance, calm engineering confidence
//  1.00  CTA:      wide receded view — scene gives way to content
//
const CAM_KEYS: [number, number, number, number][] = [
  [0.00, 2.8, 1.2, 2.8],
  [0.18, 3.2, 1.6, 3.0],
  [0.40, 2.4, 0.7, 3.2],
  [0.58, 3.0, 2.2, 2.4],
  [0.75, 3.3, 1.8, 3.3],
  [1.00, 4.2, 2.2, 4.2],
]

// Ease-in-out (smoothstep) for segment interpolation
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t)
}

function lerpCamPos(p: number): [number, number, number] {
  let lo = CAM_KEYS[0]
  let hi = CAM_KEYS[CAM_KEYS.length - 1]
  for (let i = 0; i < CAM_KEYS.length - 1; i++) {
    if (p >= CAM_KEYS[i][0] && p <= CAM_KEYS[i + 1][0]) {
      lo = CAM_KEYS[i]
      hi = CAM_KEYS[i + 1]
      break
    }
  }
  const raw = hi[0] === lo[0] ? 0 : (p - lo[0]) / (hi[0] - lo[0])
  const t   = smoothstep(Math.min(1, Math.max(0, raw)))
  return [
    lo[1] + (hi[1] - lo[1]) * t,
    lo[2] + (hi[2] - lo[2]) * t,
    lo[3] + (hi[3] - lo[3]) * t,
  ]
}

// MEP lines opacity curve:
//   0 → 0.15  invisible (structural frame only)
//   0.15 → 0.35  fade in to full
//   0.35 → 0.88  full opacity
//   0.88 → 1.0   fade out (scene recedes at CTA)
//
// Raise the peak value (0.42) for heavier MEP lines.
function getMEPOpacity(p: number): number {
  const PEAK = 0.42
  if (p < 0.15) return 0
  if (p < 0.35) return ((p - 0.15) / 0.20) * PEAK
  if (p > 0.88) return PEAK * (1 - (p - 0.88) / 0.12)
  return PEAK
}

// Structural frame opacity — gentle sin pulse during Stats section (0.62–0.80)
function getStructOpacity(p: number, time: number): number {
  const base = 0.88
  if (p < 0.62 || p > 0.80) return base
  const zone  = (p - 0.62) / (0.80 - 0.62)
  const pulse = zone * (1 - zone) * 4   // 0 at edges, peaks at mid-zone
  return base + pulse * 0.14 * Math.sin(time * 2.2)
}

// ─── Geometry builders ────────────────────────────────────────────────────────
// Run once on mount. Output: BufferGeometry with position + optional color attrs.

function pushSeg(
  pos: number[], col: number[],
  x1: number, y1: number, z1: number,
  x2: number, y2: number, z2: number,
  c: THREE.Color,
) {
  pos.push(x1, y1, z1, x2, y2, z2)
  col.push(c.r, c.g, c.b, c.r, c.g, c.b)
}

function buildStructureGeo(): THREE.BufferGeometry {
  const pos: number[] = []
  const col: number[] = []
  const W  = BAYS_X * BAY_WIDTH
  const D  = BAYS_Z * BAY_WIDTH
  const ox = -W / 2
  const oz = -D / 2

  for (let f = 0; f <= FLOORS; f++) {
    const y = f * FLOOR_HEIGHT
    // Primary slab grid (column lines — steel colour)
    for (let iz = 0; iz <= BAYS_Z; iz++)
      pushSeg(pos, col, ox, y, oz + iz * BAY_WIDTH, ox + W, y, oz + iz * BAY_WIDTH, C_FRAME)
    for (let ix = 0; ix <= BAYS_X; ix++)
      pushSeg(pos, col, ox + ix * BAY_WIDTH, y, oz, ox + ix * BAY_WIDTH, y, oz + D, C_FRAME)
    // Interior slab sub-grid (decking / formwork grid — mid-blue)
    for (let ix = 0; ix < BAYS_X; ix++)
      for (let s = 1; s < SLAB_SUBDIVISIONS; s++) {
        const x = ox + ix * BAY_WIDTH + (s / SLAB_SUBDIVISIONS) * BAY_WIDTH
        pushSeg(pos, col, x, y, oz, x, y, oz + D, C_SLAB)
      }
    for (let iz = 0; iz < BAYS_Z; iz++)
      for (let s = 1; s < SLAB_SUBDIVISIONS; s++) {
        const z = oz + iz * BAY_WIDTH + (s / SLAB_SUBDIVISIONS) * BAY_WIDTH
        pushSeg(pos, col, ox, y, z, ox + W, y, z, C_SLAB)
      }
  }

  // Columns — full height at every bay intersection
  for (let ix = 0; ix <= BAYS_X; ix++)
    for (let iz = 0; iz <= BAYS_Z; iz++)
      pushSeg(pos, col,
        ox + ix * BAY_WIDTH, 0,      oz + iz * BAY_WIDTH,
        ox + ix * BAY_WIDTH, TOTAL_H, oz + iz * BAY_WIDTH, C_FRAME)

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('color',    new THREE.Float32BufferAttribute(col, 3))
  return geo
}

function buildMEPGeo(): THREE.BufferGeometry {
  const pos: number[] = []
  const W  = BAYS_X * BAY_WIDTH
  const D  = BAYS_Z * BAY_WIDTH
  const ox = -W / 2
  const oz = -D / 2

  for (let f = 0; f < FLOORS; f++) {
    const y = f * FLOOR_HEIGHT + FLOOR_HEIGHT * 0.65  // upper-third of each floor zone
    // Main header duct along X at mid-depth
    pos.push(ox, y, oz + D * 0.5,  ox + W, y, oz + D * 0.5)
    // Branch runs along Z at internal column lines
    for (let ix = 1; ix < BAYS_X; ix++) {
      const x = ox + ix * BAY_WIDTH
      pos.push(x, y, oz,  x, y, oz + D)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  return geo
}

// ─── Scene (must be child of <Canvas>) ───────────────────────────────────────

// Pre-allocated to avoid per-frame garbage collection
const _camTarget  = new THREE.Vector3()
const _lookOrigin = new THREE.Vector3(0, 0, 0)

interface SceneProps {
  scrollProgressRef: { current: number }
  isInViewRef:       { current: boolean }
  reducedMotion:     boolean
}

function Scene({ scrollProgressRef, isInViewRef, reducedMotion }: SceneProps) {
  const { scene, camera } = useThree()
  const groupRef    = useRef<THREE.Group>(null)
  const mepMatRef   = useRef<THREE.LineBasicMaterial>(null)
  const structMatRef = useRef<THREE.LineBasicMaterial>(null)

  const structGeo = useMemo(buildStructureGeo, [])
  const mepGeo    = useMemo(buildMEPGeo, [])

  useEffect(() => {
    scene.background = new THREE.Color(0x0e2243)
    scene.fog        = new THREE.FogExp2(0x0e2243, FOG_DENSITY)
    return () => { scene.background = null; scene.fog = null }
  }, [scene])

  useEffect(() => () => { structGeo.dispose(); mepGeo.dispose() }, [structGeo, mepGeo])

  useFrame((state, delta) => {
    if (!isInViewRef.current) return

    const p             = scrollProgressRef.current
    const clampedDelta  = Math.min(delta, 0.1)

    // Rotate building continuously (capped delta prevents jump after tab restore)
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y += clampedDelta * ROTATION_SPEED
    }

    if (!ENABLE_SCROLL_STORY) return

    // ── Camera position ──────────────────────────────────────────────────────
    // lerp factor 0.03 → ~0.97 closed per second at 60fps. Slow, inevitable.
    const [cx, cy, cz] = lerpCamPos(p)
    _camTarget.set(cx, cy, cz)
    camera.position.lerp(_camTarget, 0.03)
    camera.lookAt(_lookOrigin)

    // ── MEP lines ────────────────────────────────────────────────────────────
    if (mepMatRef.current) {
      const target = getMEPOpacity(p)
      mepMatRef.current.opacity += (target - mepMatRef.current.opacity) * 0.05
      mepMatRef.current.needsUpdate = true
    }

    // ── Structural highlight ─────────────────────────────────────────────────
    if (structMatRef.current) {
      const target = getStructOpacity(p, state.clock.elapsedTime)
      structMatRef.current.opacity += (target - structMatRef.current.opacity) * 0.08
      structMatRef.current.needsUpdate = true
    }
  })

  const mepInitialOpacity = ENABLE_SCROLL_STORY ? 0 : 0.38

  return (
    <group
      ref={groupRef}
      position={[0.15, -TOTAL_H / 2, 0]}
      rotation={[0.08, Math.PI / 6, 0]}
    >
      {/* Structural frame — vertex colours: steel primary, mid-blue sub-grid */}
      <lineSegments geometry={structGeo}>
        <lineBasicMaterial ref={structMatRef} vertexColors transparent opacity={0.88} />
      </lineSegments>

      {/* MEP systems overlay — lighter blue, more transparent */}
      <lineSegments geometry={mepGeo}>
        <lineBasicMaterial
          ref={mepMatRef}
          color={`#${C_MEP.getHexString()}`}
          transparent
          opacity={mepInitialOpacity}
        />
      </lineSegments>
    </group>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

interface HomepageCanvasProps {
  scrollProgressRef: { current: number }
}

export function HomepageCanvas({ scrollProgressRef }: HomepageCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInViewRef  = useRef(true)

  const [isMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
  )
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [frameloop, setFrameloop] = useState<'always' | 'demand'>(
    () => typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'demand'
      : 'always',
  )

  // Pause the render loop when the hero section is fully scrolled past
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting
        if (!reducedMotion) setFrameloop(entry.isIntersecting ? 'always' : 'demand')
      },
      { threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reducedMotion])

  // Mobile: CSS blueprint grid handles the background; no WebGL
  if (isMobile) return null

  return (
    <div ref={containerRef} aria-hidden="true" className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [2.8, 1.2, 2.8], fov: 48, near: 0.1, far: 25 }}
        dpr={[1, 1.5]}
        frameloop={frameloop}
        gl={{ antialias: false }}
      >
        <AdaptiveDpr pixelated />
        <Scene
          scrollProgressRef={scrollProgressRef}
          isInViewRef={isInViewRef}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  )
}

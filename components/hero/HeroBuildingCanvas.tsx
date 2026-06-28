'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────────────────────
// Tuning constants — adjust these to change the look without touching geometry
//
//   Rotation:  ROTATION_SPEED (rad/s). 0.065 ≈ 97 s/revolution.
//   Density:   FLOORS, BAYS_X, BAYS_Z, SLAB_SUBDIVISIONS
//   Scale:     FLOOR_HEIGHT, BAY_WIDTH
//   Depth fade: FOG_DENSITY (higher = building fades faster at distance)
//   Intensity:  opacity values in the <lineBasicMaterial> props below (~line 140)
// ─────────────────────────────────────────────────────────────────────────────

/** Rotation in rad/s. Lower = slower. 0.065 ≈ 97 s/revolution. */
const ROTATION_SPEED    = 0.065
const FLOORS            = 5       // structural floor levels (above ground)
const BAYS_X            = 3       // column bays along X
const BAYS_Z            = 3       // column bays along Z
const FLOOR_HEIGHT      = 0.44   // floor-to-floor height (model units)
const BAY_WIDTH         = 0.52   // bay span in X and Z (model units)
const SLAB_SUBDIVISIONS = 3       // sub-grid lines per bay within each slab
const FOG_DENSITY       = 0.28   // exponential fog — higher = heavier fade

// Brand colours from design tokens
const C_FRAME = new THREE.Color(0x2e6db4)  // steel — primary structural lines
const C_SLAB  = new THREE.Color(0x1c559a)  // mid-blue — slab inner grid
const C_MEP   = new THREE.Color(0x4d8fc7)  // lighter blue — MEP/systems overlay

// ─────────────────────────────────────────────────────────────────────────────
// Geometry builders — run once on mount, zero per-frame cost
// ─────────────────────────────────────────────────────────────────────────────

function pushSeg(
  pos: number[], col: number[],
  x1: number, y1: number, z1: number,
  x2: number, y2: number, z2: number,
  c: THREE.Color,
) {
  pos.push(x1, y1, z1, x2, y2, z2)
  col.push(c.r, c.g, c.b, c.r, c.g, c.b)
}

/** Structural frame: floor slabs + columns + slab sub-grid. */
function buildStructureGeo(): THREE.BufferGeometry {
  const pos: number[] = []
  const col: number[] = []
  const W  = BAYS_X * BAY_WIDTH
  const D  = BAYS_Z * BAY_WIDTH
  const H  = FLOORS * FLOOR_HEIGHT
  const ox = -W / 2
  const oz = -D / 2

  // Floor slabs — one per level including ground and roof
  for (let f = 0; f <= FLOORS; f++) {
    const y = f * FLOOR_HEIGHT

    // Primary slab edge lines (column grid perimeter)
    for (let iz = 0; iz <= BAYS_Z; iz++)
      pushSeg(pos, col, ox, y, oz + iz * BAY_WIDTH, ox + W, y, oz + iz * BAY_WIDTH, C_FRAME)
    for (let ix = 0; ix <= BAYS_X; ix++)
      pushSeg(pos, col, ox + ix * BAY_WIDTH, y, oz, ox + ix * BAY_WIDTH, y, oz + D, C_FRAME)

    // Interior slab sub-grid (suggests decking/formwork grid)
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
        ox + ix * BAY_WIDTH, 0,  oz + iz * BAY_WIDTH,
        ox + ix * BAY_WIDTH, H, oz + iz * BAY_WIDTH, C_FRAME)

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('color',    new THREE.Float32BufferAttribute(col, 3))
  return geo
}

/** MEP overlay — horizontal duct/pipe runs suggesting building systems. */
function buildMEPGeo(): THREE.BufferGeometry {
  const pos: number[] = []
  const W  = BAYS_X * BAY_WIDTH
  const D  = BAYS_Z * BAY_WIDTH
  const ox = -W / 2
  const oz = -D / 2

  for (let f = 0; f < FLOORS; f++) {
    // Runs at upper-third of each floor zone (above finished floor)
    const y = f * FLOOR_HEIGHT + FLOOR_HEIGHT * 0.65

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

// ─────────────────────────────────────────────────────────────────────────────
// Scene components (must be children of <Canvas>)
// ─────────────────────────────────────────────────────────────────────────────

function SceneSetup() {
  const { scene } = useThree()
  useEffect(() => {
    scene.background = new THREE.Color(0x0e2243)
    scene.fog        = new THREE.FogExp2(0x0e2243, FOG_DENSITY)
    return () => {
      scene.background = null
      scene.fog        = null
    }
  }, [scene])
  return null
}

interface BuildingProps {
  isInViewRef:   React.MutableRefObject<boolean>
  reducedMotion: boolean
}

function Building({ isInViewRef, reducedMotion }: BuildingProps) {
  const groupRef  = useRef<THREE.Group | null>(null)
  const structGeo = useMemo(buildStructureGeo, [])
  const mepGeo    = useMemo(buildMEPGeo, [])

  useEffect(() => () => { structGeo.dispose(); mepGeo.dispose() }, [structGeo, mepGeo])

  useFrame((_, delta) => {
    if (!groupRef.current || !isInViewRef.current || reducedMotion) return
    // Cap delta to prevent large jump after tab focus or scroll-back
    groupRef.current.rotation.y += Math.min(delta, 0.1) * ROTATION_SPEED
  })

  const totalH = FLOORS * FLOOR_HEIGHT

  return (
    <group
      ref={groupRef}
      // Center building vertically in scene; shift slightly right of canvas center
      position={[0.15, -totalH / 2, 0]}
      // Initial orientation: slight X-tilt for 3D depth read, 30° Y for 3/4 view
      rotation={[0.08, Math.PI / 6, 0]}
    >
      {/* Structural frame — vertex colours (steel primary, mid-blue sub-grid) */}
      {/* ↓ Intensity: raise opacity toward 1.0 for heavier look */}
      <lineSegments geometry={structGeo}>
        <lineBasicMaterial vertexColors transparent opacity={0.88} />
      </lineSegments>

      {/* MEP systems overlay — lighter blue, more transparent */}
      {/* ↓ Intensity: raise opacity toward 0.7 for heavier MEP lines */}
      <lineSegments geometry={mepGeo}>
        <lineBasicMaterial color={`#${C_MEP.getHexString()}`} transparent opacity={0.38} />
      </lineSegments>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export — dynamically imported with ssr:false from page.tsx
// ─────────────────────────────────────────────────────────────────────────────

export function HeroBuildingCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  // Tracks hero visibility without triggering re-renders on every scroll tick
  const isInViewRef  = useRef(true)

  // Mobile: skip WebGL entirely — CSS blueprint grid serves as background
  const [isMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
  )

  // Detect prefers-reduced-motion synchronously (component is client-only)
  const [reducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  // frameloop="demand": no frames rendered unless invalidate() is called.
  // frameloop="always": continuous render loop.
  // Switching dynamically pauses/resumes the GPU work when hero leaves viewport.
  const [frameloop, setFrameloop] = useState<'always' | 'demand'>(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'demand'   // reduced-motion: one static frame rendered on mount, then stop
        : 'always',  // animated: continuous rotation
  )

  // Pause the render loop when the hero section is scrolled out of view
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting
        // Only toggle frameloop when not in reduced-motion mode
        if (!reducedMotion) {
          setFrameloop(entry.isIntersecting ? 'always' : 'demand')
        }
      },
      { threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reducedMotion])

  // Mobile fallback — CSS blueprint grid already handles the background
  if (isMobile) return null

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
    >
      <Canvas
        // Camera: upper-right position gives classic 3/4 architectural view
        camera={{ position: [2.8, 1.2, 2.8], fov: 48, near: 0.1, far: 25 }}
        // DPR cap: [min, max]. AdaptiveDpr will lower within this range under load.
        dpr={[1, 1.5]}
        frameloop={frameloop}
        // antialias: false saves ~15-20% GPU cost; thin lines look fine without it
        gl={{ antialias: false }}
      >
        {/* Automatically reduces DPR when frame rate drops below target */}
        <AdaptiveDpr pixelated />
        {/* Sets scene.background (navy) and scene.fog (exponential depth fade) */}
        <SceneSetup />
        <Building isInViewRef={isInViewRef} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  )
}

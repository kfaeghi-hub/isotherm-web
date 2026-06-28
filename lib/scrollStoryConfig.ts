// ─── Scroll-story feature flag ────────────────────────────────────────────────
//
// ENABLE_SCROLL_STORY = true
//   Hero section becomes a 300vh-tall sticky container. The 3D scene evolves
//   as you scroll through it (MEP fade-in, camera moves, highlight pulse).
//   After the story, normal content sections follow.
//
// ENABLE_SCROLL_STORY = false
//   Hero returns to its normal single-viewport height. The 3D scene just
//   rotates. No layout changes, no scroll tracking.
//
// No other code changes are needed to toggle this flag.
// ─────────────────────────────────────────────────────────────────────────────

export const ENABLE_SCROLL_STORY = true

// Total height of the sticky hero container (viewport-heights).
// The scroll story plays over (STORY_HEIGHT_VH - 100)vh of actual scroll.
// Raise if the story feels too rushed; lower if too slow.
// Default: 400vh → 300vh of scroll distance for the full story.
export const STORY_HEIGHT_VH = 400

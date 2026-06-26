import { ImageResponse } from 'next/og'

export const runtime     = 'edge'
export const alt         = 'Isotherm Engineering — Your Advocate for High Performance Buildings'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px 90px',
          background: '#0E2243',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Geometric accent circles — engineering drawing motif */}
        <div style={{
          position: 'absolute',
          right: -160,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 700,
          height: 700,
          borderRadius: '50%',
          border: '1px solid rgba(46,109,180,0.25)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute',
          right: -60,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 500,
          height: 500,
          borderRadius: '50%',
          border: '1px solid rgba(46,109,180,0.18)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute',
          right: 80,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 280,
          height: 280,
          borderRadius: '50%',
          border: '1px solid rgba(46,109,180,0.12)',
          display: 'flex',
        }} />

        {/* Steel accent rule */}
        <div style={{
          width: 52,
          height: 4,
          background: '#2E6DB4',
          marginBottom: 36,
          display: 'flex',
        }} />

        {/* Company name */}
        <div style={{
          fontSize: 60,
          fontWeight: 700,
          color: '#FFFFFF',
          lineHeight: 1.1,
          marginBottom: 20,
          display: 'flex',
          letterSpacing: '-0.5px',
        }}>
          Isotherm Engineering
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 26,
          color: 'rgba(255,255,255,0.60)',
          marginBottom: 56,
          display: 'flex',
          fontWeight: 400,
        }}>
          Your Advocate for High Performance Buildings
        </div>

        {/* Domain pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#2E6DB4',
            display: 'flex',
          }} />
          <div style={{
            fontSize: 20,
            color: '#2E6DB4',
            fontWeight: 500,
            display: 'flex',
          }}>
            isothermengineering.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}

import { ImageResponse } from 'next/og'

export const size        = { width: 32, height: 32 }
export const contentType = 'image/png'

// Branded favicon — I-beam mark (engineering reference)
// Top/bottom caps: steel blue  |  Vertical stem: white  |  Background: navy
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width:          '100%',
          height:         '100%',
          background:     '#0E2243',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Top cap */}
          <div style={{ width: 22, height: 3, background: '#2E6DB4', display: 'flex' }} />
          {/* Stem */}
          <div style={{ width: 3,  height: 11, background: '#ffffff', display: 'flex' }} />
          {/* Bottom cap */}
          <div style={{ width: 22, height: 3, background: '#2E6DB4', display: 'flex' }} />
        </div>
      </div>
    ),
    { ...size },
  )
}

import { OrbState } from '../types'

interface OrbConfig {
  color: string
  colorLight: string
  glow: string
  shadow: string
  animation: string
  duration: number
  ringDuration: number
  label: string
}

const ORB: Record<OrbState, OrbConfig> = {
  idle: {
    color: '#7c3aed', colorLight: '#a855f7', glow: 'rgba(124,58,237,0.5)', shadow: '0 0 40px rgba(124,58,237,0.4)',
    animation: 'orb-idle', duration: 3, ringDuration: 12, label: 'Ready when you are',
  },
  listening: {
    color: '#06b6d4', colorLight: '#22d3ee', glow: 'rgba(6,182,212,0.6)', shadow: '0 0 50px rgba(6,182,212,0.5)',
    animation: 'orb-listen', duration: 1, ringDuration: 4, label: 'Listening…',
  },
  thinking: {
    color: '#9f55ff', colorLight: '#c084fc', glow: 'rgba(159,85,255,0.55)', shadow: '0 0 45px rgba(159,85,255,0.45)',
    animation: 'orb-think', duration: 2, ringDuration: 3, label: 'Thinking…',
  },
  working: {
    color: '#6366f1', colorLight: '#818cf8', glow: 'rgba(99,102,241,0.55)', shadow: '0 0 45px rgba(99,102,241,0.45)',
    animation: 'orb-work', duration: 1.5, ringDuration: 2, label: 'Working…',
  },
  confirming: {
    color: '#f97316', colorLight: '#fb923c', glow: 'rgba(249,115,22,0.55)', shadow: '0 0 40px rgba(249,115,22,0.4)',
    animation: 'orb-idle', duration: 2, ringDuration: 6, label: 'Confirmation required',
  },
  success: {
    color: '#22c55e', colorLight: '#4ade80', glow: 'rgba(34,197,94,0.55)', shadow: '0 0 45px rgba(34,197,94,0.4)',
    animation: 'orb-idle', duration: 2.5, ringDuration: 8, label: 'Task completed',
  },
  error: {
    color: '#ef4444', colorLight: '#f87171', glow: 'rgba(239,68,68,0.55)', shadow: '0 0 40px rgba(239,68,68,0.4)',
    animation: 'orb-idle', duration: 1.5, ringDuration: 8, label: 'Something went wrong',
  },
}

interface MavixOrbProps {
  state: OrbState
  size?: number
  showLabel?: boolean
  labelOverride?: string
}

export function MavixOrb({ state, size = 120, showLabel = true, labelOverride }: MavixOrbProps) {
  const c = ORB[state]
  const core = size * 0.6
  const ring1 = size * 0.85
  const ring2 = size * 1.0
  const glowBg = size * 1.8

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        {/* Ambient glow */}
        <div style={{
          position: 'absolute',
          width: glowBg, height: glowBg,
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${c.glow} 0%, transparent 65%)`,
          animation: `glow-pulse ${c.duration}s ease-in-out infinite`,
          pointerEvents: 'none',
        }} />

        {/* Outer dashed ring */}
        <div style={{
          position: 'absolute',
          width: ring2, height: ring2,
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          borderRadius: '50%',
          border: `1px dashed ${c.color}50`,
          animation: `ring-rotate ${c.ringDuration}s linear infinite`,
        }} />

        {/* Inner ring */}
        <div style={{
          position: 'absolute',
          width: ring1, height: ring1,
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          borderRadius: '50%',
          border: `1px solid ${c.color}30`,
          animation: `ring-reverse ${c.ringDuration * 1.5}s linear infinite`,
        }} />

        {/* Core orb */}
        <div style={{
          width: core, height: core,
          borderRadius: '50%',
          background: `radial-gradient(circle at 38% 35%, ${c.colorLight}, ${c.color} 55%, ${c.color}90 100%)`,
          boxShadow: `${c.shadow}, inset 0 0 ${core * 0.25}px rgba(255,255,255,0.12)`,
          animation: `${c.animation} ${c.duration}s ease-in-out infinite`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <MIcon size={core * 0.46} />
        </div>

        {/* Listening audio bars */}
        {state === 'listening' && (
          <div style={{
            position: 'absolute', bottom: -8, left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', gap: 3, alignItems: 'flex-end', height: 18,
          }}>
            {[5, 10, 16, 12, 7, 14, 9].map((h, i) => (
              <div key={i} style={{
                width: 3, height: h,
                background: c.color,
                borderRadius: 3,
                transformOrigin: 'bottom',
                animation: `audio-bar 0.7s ease-in-out ${i * 0.1}s infinite`,
              }} />
            ))}
          </div>
        )}

        {/* Thinking dots */}
        {state === 'thinking' && (
          <div style={{
            position: 'absolute', bottom: -10, left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', gap: 5,
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: c.color,
                animation: `dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        )}
      </div>

      {showLabel && (
        <span style={{
          fontSize: size < 80 ? 11 : 13,
          fontWeight: 500,
          color: c.color,
          letterSpacing: '0.02em',
          textAlign: 'center',
        }}>
          {labelOverride ?? c.label}
        </span>
      )}
    </div>
  )
}

/** Abstract M-shaped logo mark */
function MIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* M shape */}
      <path d="M5 38V12L22 26L39 12V38" stroke="rgba(255,255,255,0.9)" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Neural node at top */}
      <circle cx="22" cy="15" r="4.5" fill="rgba(255,255,255,0.3)" />
      <circle cx="22" cy="15" r="2.5" fill="rgba(255,255,255,0.9)" />
      {/* Small connector dots */}
      <circle cx="5" cy="38" r="2" fill="rgba(255,255,255,0.5)" />
      <circle cx="39" cy="38" r="2" fill="rgba(255,255,255,0.5)" />
    </svg>
  )
}

/** Compact inline orb badge for sidebar / header */
export function OrbBadge({ state, size = 36 }: { state: OrbState; size?: number }) {
  const c = ORB[state]
  const core = size * 0.7
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <div style={{
        position: 'absolute',
        width: size * 1.5, height: size * 1.5,
        top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${c.glow} 0%, transparent 70%)`,
        animation: `glow-pulse ${c.duration}s ease-in-out infinite`,
        pointerEvents: 'none',
      }} />
      <div style={{
        width: core, height: core,
        borderRadius: '50%',
        background: `radial-gradient(circle at 38% 35%, ${c.colorLight}, ${c.color})`,
        boxShadow: c.shadow,
        animation: `${c.animation} ${c.duration}s ease-in-out infinite`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <MIcon size={core * 0.52} />
      </div>
    </div>
  )
}

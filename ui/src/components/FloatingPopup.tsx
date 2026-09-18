import { useState, useEffect } from 'react'
import { OrbState } from '../types'
import { OrbBadge } from './MavixOrb'

interface FloatingPopupProps {
  onClose: () => void
  onComplete?: (text: string) => void
}

type PopupPhase = 'listening' | 'thinking' | 'working' | 'observing' | 'verifying' | 'done'

const DEMO_TRANSCRIPT = 'Open Chrome and search operating system scheduling'

const PHASES: Array<{ phase: PopupPhase; label: string; orbState: OrbState; duration: number }> = [
  { phase: 'listening', label: 'Listening…', orbState: 'listening', duration: 3000 },
  { phase: 'thinking', label: 'Thinking…', orbState: 'thinking', duration: 2000 },
  { phase: 'working', label: 'Working…', orbState: 'working', duration: 2500 },
  { phase: 'observing', label: 'Observing…', orbState: 'working', duration: 1500 },
  { phase: 'verifying', label: 'Verifying…', orbState: 'thinking', duration: 1200 },
  { phase: 'done', label: 'Done ✓', orbState: 'success', duration: 0 },
]

export function FloatingPopup({ onClose, onComplete }: FloatingPopupProps) {
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [charIdx, setCharIdx] = useState(0)

  const current = PHASES[phaseIdx]

  // Type out the transcript while listening
  useEffect(() => {
    if (phaseIdx !== 0) return
    if (charIdx >= DEMO_TRANSCRIPT.length) return
    const t = setTimeout(() => {
      setTranscript(DEMO_TRANSCRIPT.slice(0, charIdx + 1))
      setCharIdx(c => c + 1)
    }, 55)
    return () => clearTimeout(t)
  }, [charIdx, phaseIdx])

  // Advance through phases
  useEffect(() => {
    if (phaseIdx >= PHASES.length - 1) return
    const dur = PHASES[phaseIdx].duration
    const t = setTimeout(() => setPhaseIdx(i => i + 1), dur)
    return () => clearTimeout(t)
  }, [phaseIdx])

  const done = phaseIdx === PHASES.length - 1

  return (
    <div style={{
      position: 'fixed',
      bottom: 80,
      right: 32,
      zIndex: 1000,
      animation: 'popup-in 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
    }}>
      <div style={{
        width: 340,
        background: 'rgba(10,10,22,0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: `1px solid ${current.orbState === 'listening' ? 'rgba(6,182,212,0.35)' : current.orbState === 'success' ? 'rgba(34,197,94,0.35)' : 'rgba(124,58,237,0.3)'}`,
        borderRadius: 18,
        padding: '16px 18px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(124,58,237,0.15)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <OrbBadge state={current.orbState} size={32} />
            <div>
              <div className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#eeeef5', letterSpacing: '0.04em' }}>MAVIX AI</div>
              <div style={{ fontSize: 11, color: current.orbState === 'listening' ? '#06b6d4' : current.orbState === 'success' ? '#22c55e' : '#7c3aed', fontWeight: 500 }}>
                {current.label}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#5c5c7a', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 4 }}
          >
            ✕
          </button>
        </div>

        {/* Transcript */}
        {(transcript || phaseIdx > 0) && (
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 10,
            padding: '10px 12px',
            marginBottom: 12,
            fontSize: 13,
            color: '#eeeef5',
            lineHeight: 1.5,
            minHeight: 40,
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            {phaseIdx === 0 ? (
              <>
                <span style={{ color: '#8b8ba7', fontSize: 11, display: 'block', marginBottom: 4 }}>Recognized:</span>
                "{transcript}<span style={{ animation: 'dot-bounce 0.8s infinite' }}>|</span>"
              </>
            ) : (
              <>
                <span style={{ color: '#8b8ba7', fontSize: 11, display: 'block', marginBottom: 4 }}>Task:</span>
                "{DEMO_TRANSCRIPT}"
              </>
            )}
          </div>
        )}

        {/* Progress steps */}
        {phaseIdx > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
            {PHASES.map((p, i) => {
              const isDone = i < phaseIdx
              const isCurrent = i === phaseIdx
              const isPending = i > phaseIdx
              return (
                <div key={p.phase} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  opacity: isPending ? 0.35 : 1,
                  animation: isCurrent ? 'step-in 0.3s ease-out' : 'none',
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9,
                    background: isDone ? '#22c55e' : isCurrent ? '#7c3aed' : 'rgba(255,255,255,0.08)',
                    boxShadow: isCurrent ? '0 0 10px rgba(124,58,237,0.5)' : 'none',
                  }}>
                    {isDone ? '✓' : isCurrent ? <SpinDot /> : '○'}
                  </div>
                  <span style={{ fontSize: 12, color: isDone ? '#8b8ba7' : isCurrent ? '#eeeef5' : '#5c5c7a', fontWeight: isCurrent ? 500 : 400 }}>
                    {p.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Done state */}
        {done && (
          <div style={{ marginTop: 4 }}>
            <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 500, textAlign: 'center', marginBottom: 10 }}>
              Chrome opened · Search completed
            </div>
            <button
              onClick={() => { onComplete?.(DEMO_TRANSCRIPT); onClose() }}
              style={{
                width: '100%', padding: '9px', borderRadius: 10,
                background: 'rgba(34,197,94,0.15)', color: '#22c55e',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                border: '1px solid rgba(34,197,94,0.25)',
              }}
            >
              View in Chat
            </button>
          </div>
        )}

        {/* Microphone indicator when listening */}
        {phaseIdx === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#06b6d4',
              boxShadow: '0 0 8px rgba(6,182,212,0.8)',
              animation: 'glow-fast 1s ease-in-out infinite',
            }} />
            <span style={{ fontSize: 11, color: '#06b6d4' }}>Microphone active</span>
          </div>
        )}
      </div>
    </div>
  )
}

function SpinDot() {
  return (
    <div style={{
      width: 6, height: 6, borderRadius: '50%',
      border: '1.5px solid rgba(255,255,255,0.3)',
      borderTopColor: '#fff',
      animation: 'ring-rotate 0.6s linear infinite',
    }} />
  )
}

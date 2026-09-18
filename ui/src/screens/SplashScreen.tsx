import { useEffect, useState } from 'react'

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 400),   // orb appears
      setTimeout(() => setStage(2), 1200),  // title appears
      setTimeout(() => setStage(3), 1900),  // tagline appears
      setTimeout(() => setStage(4), 2500),  // subtitle appears
      setTimeout(() => onComplete(), 4000), // transition out
    ]
    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(124,58,237,0.12) 0%, #08080f 65%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
      }} />

      {/* Faint particle rings */}
      <div style={{
        position: 'absolute', width: 600, height: 600,
        top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        borderRadius: '50%',
        border: '1px solid rgba(124,58,237,0.08)',
        animation: 'ring-rotate 20s linear infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 800, height: 800,
        top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        borderRadius: '50%',
        border: '1px solid rgba(124,58,237,0.05)',
        animation: 'ring-reverse 30s linear infinite',
        pointerEvents: 'none',
      }} />

      {/* Orb */}
      <div style={{
        opacity: stage >= 1 ? 1 : 0,
        transform: stage >= 1 ? 'scale(1)' : 'scale(0.4)',
        transition: 'opacity 0.8s cubic-bezier(0.34,1.56,0.64,1), transform 0.8s cubic-bezier(0.34,1.56,0.64,1)',
        marginBottom: 32,
      }}>
        <SplashOrb />
      </div>

      {/* MAVIX AI */}
      <div style={{
        opacity: stage >= 2 ? 1 : 0,
        transform: stage >= 2 ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
        textAlign: 'center',
        marginBottom: 12,
      }}>
        <h1 className="font-display" style={{
          fontSize: 52,
          fontWeight: 800,
          letterSpacing: '0.12em',
          background: 'linear-gradient(135deg, #fff 40%, #a855f7 70%, #7c3aed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0,
          lineHeight: 1,
        }}>
          MAVIX AI
        </h1>
      </div>

      {/* Tagline */}
      <div style={{
        opacity: stage >= 3 ? 1 : 0,
        transform: stage >= 3 ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        textAlign: 'center',
        marginBottom: 8,
      }}>
        <p className="font-display" style={{
          fontSize: 18,
          fontWeight: 400,
          color: '#7c3aed',
          letterSpacing: '0.18em',
          margin: 0,
          textTransform: 'uppercase',
        }}>
          From Intent to Action
        </p>
      </div>

      {/* Subtitle */}
      <div style={{
        opacity: stage >= 4 ? 1 : 0,
        transform: stage >= 4 ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        textAlign: 'center',
        marginBottom: 48,
      }}>
        <p style={{
          fontSize: 14,
          color: '#5c5c7a',
          letterSpacing: '0.06em',
          margin: 0,
        }}>
          Your context-aware desktop AI assistant
        </p>
      </div>

      {/* Loading bar */}
      <div style={{
        opacity: stage >= 2 ? 1 : 0,
        transition: 'opacity 0.5s ease',
        position: 'absolute', bottom: 60,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      }}>
        <div style={{ width: 200, height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
            borderRadius: 1,
            animation: 'progress-fill 3.2s ease-out forwards',
            width: 0,
          }} />
        </div>
        <span style={{ fontSize: 11, color: '#5c5c7a', letterSpacing: '0.1em' }}>Initializing systems…</span>
      </div>
    </div>
  )
}

function SplashOrb() {
  return (
    <div style={{ position: 'relative', width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', width: 300, height: 300,
        top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 65%)',
        animation: 'glow-pulse 3s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      {/* Outer ring */}
      <div style={{
        position: 'absolute', width: 160, height: 160,
        top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        borderRadius: '50%',
        border: '1px dashed rgba(124,58,237,0.4)',
        animation: 'ring-rotate 12s linear infinite',
      }} />
      {/* Middle ring */}
      <div style={{
        position: 'absolute', width: 130, height: 130,
        top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        borderRadius: '50%',
        border: '1px solid rgba(124,58,237,0.2)',
        animation: 'ring-reverse 18s linear infinite',
      }} />
      {/* Core */}
      <div style={{
        width: 100, height: 100,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 38% 35%, #a855f7, #7c3aed 55%, #4c1d95 100%)',
        boxShadow: '0 0 50px rgba(124,58,237,0.6), 0 0 100px rgba(124,58,237,0.25), inset 0 0 25px rgba(255,255,255,0.1)',
        animation: 'orb-idle 3s ease-in-out infinite',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="46" height="46" viewBox="0 0 44 44" fill="none">
          <path d="M5 38V12L22 26L39 12V38" stroke="rgba(255,255,255,0.9)" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="22" cy="15" r="4.5" fill="rgba(255,255,255,0.3)" />
          <circle cx="22" cy="15" r="2.5" fill="rgba(255,255,255,0.9)" />
          <circle cx="5" cy="38" r="2" fill="rgba(255,255,255,0.5)" />
          <circle cx="39" cy="38" r="2" fill="rgba(255,255,255,0.5)" />
        </svg>
      </div>
    </div>
  )
}

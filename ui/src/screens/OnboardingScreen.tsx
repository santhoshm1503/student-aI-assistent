import { useState } from 'react'
import { UserData } from '../types'
import { OrbBadge } from '../components/MavixOrb'

interface OnboardingScreenProps {
  onComplete: (user: UserData) => void
}

type Step = 'welcome' | 'account' | 'permissions' | 'done'

interface Permission {
  id: string
  label: string
  description: string
  icon: string
  granted: boolean
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState<Step>('welcome')
  const [mode, setMode] = useState<'signin' | 'create'>('create')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [autocorrect, setAutocorrect] = useState('')
  const [permissions, setPermissions] = useState<Permission[]>([
    { id: 'mic', label: 'Microphone', description: 'Allow MAVIX to listen for voice commands and "Hey MAVIX" wake word', icon: '🎙', granted: false },
    { id: 'screen', label: 'Screen Context', description: 'Allow MAVIX to capture your screen to understand and explain visible content', icon: '🖥', granted: false },
    { id: 'files', label: 'File Access', description: 'Allow MAVIX to read, create, and organize files in your student workspace', icon: '📁', granted: false },
    { id: 'browser', label: 'Browser & Apps', description: 'Allow MAVIX to open applications and perform browser automation on your behalf', icon: '🌐', granted: false },
  ])

  const togglePermission = (id: string) => {
    setPermissions(prev => prev.map(p => p.id === id ? { ...p, granted: !p.granted } : p))
  }

  const allPermissionsSet = permissions.every(p => p.granted !== undefined)

  const handleFinish = () => {
    onComplete({ name: name || 'Student', email: email || '' })
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(124,58,237,0.08) 0%, #08080f 70%)',
      padding: 32,
      overflow: 'auto',
    }}>
      {/* Step indicator */}
      <div style={{ position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
        {(['welcome', 'account', 'permissions', 'done'] as Step[]).map((s, i) => (
          <div key={s} style={{
            width: s === step ? 24 : 8, height: 8,
            borderRadius: 4,
            background: s === step ? '#7c3aed' : i < (['welcome','account','permissions','done'] as Step[]).indexOf(step) ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.1)',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      <div style={{
        width: '100%', maxWidth: 440,
        background: 'rgba(13,13,28,0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: '36px 40px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 40px rgba(124,58,237,0.1)',
        animation: 'fade-in 0.4s ease-out',
      }}>
        {/* Welcome step */}
        {step === 'welcome' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <OrbBadge state="idle" size={72} />
            </div>
            <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#eeeef5', margin: '0 0 8px', letterSpacing: '0.04em' }}>
              Welcome to MAVIX AI
            </h1>
            <p style={{ fontSize: 14, color: '#8b8ba7', margin: '0 0 8px', lineHeight: 1.6 }}>
              Your context-aware desktop AI assistant.
            </p>
            <p style={{ fontSize: 13, color: '#5c5c7a', margin: '0 0 32px', lineHeight: 1.6 }}>
              MAVIX helps you understand your coursework, organize files, and automate repetitive tasks — all through natural voice and text commands.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => { setMode('create'); setStep('account') }}
                style={{ ...btnStyle('#7c3aed', '#6d28d9') }}
              >
                Create Account
              </button>
              <button
                onClick={() => { setMode('signin'); setStep('account') }}
                style={{ ...ghostBtnStyle }}
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* Account step */}
        {step === 'account' && (
          <div>
            <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: '#eeeef5', margin: '0 0 6px' }}>
              {mode === 'create' ? 'Create your account' : 'Sign in to MAVIX'}
            </h2>
            <p style={{ fontSize: 13, color: '#8b8ba7', margin: '0 0 28px' }}>
              {mode === 'create' ? 'Set up your personal AI workspace.' : 'Welcome back. Pick up where you left off.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field
                label="Your name"
                placeholder="e.g. Mohamed, Santhosh, Alex…"
                value={name}
                onChange={setName}
                required
              />
              <Field label="Email" type="email" placeholder="student@university.edu" value={email} onChange={setEmail} />
              <Field label="Password" type="password" placeholder="••••••••" value={password} onChange={setPassword} />
            </div>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => name.trim() && setStep('permissions')}
                disabled={!name.trim()}
                style={name.trim() ? btnStyle('#7c3aed', '#6d28d9') : disabledBtnStyle}
              >
                {mode === 'create' ? 'Create Account' : 'Sign In'} →
              </button>
              <button onClick={() => setStep('welcome')} style={ghostBtnStyle}>
                ← Back
              </button>
            </div>
          </div>
        )}

        {/* Permissions step */}
        {step === 'permissions' && (
          <div>
            <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: '#eeeef5', margin: '0 0 4px' }}>
              Permissions
            </h2>
            <p style={{ fontSize: 13, color: '#8b8ba7', margin: '0 0 4px' }}>
              MAVIX needs the following to assist you. You can change these later in Settings.
            </p>
            <p style={{ fontSize: 11, color: '#5c5c7a', margin: '0 0 20px', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
              🔒 Data stays on your device. MAVIX does not store screen captures or files externally.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {permissions.map(p => (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '12px 14px',
                  background: p.granted ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${p.granted ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 12,
                  transition: 'all 0.2s',
                }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{p.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#eeeef5', marginBottom: 2 }}>{p.label}</div>
                    <div style={{ fontSize: 11, color: '#5c5c7a', lineHeight: 1.5 }}>{p.description}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginTop: 2 }}>
                    <ToggleBtn active={p.granted} label="Allow" color="#7c3aed" onClick={() => setPermissions(prev => prev.map(pp => pp.id === p.id ? { ...pp, granted: true } : pp))} />
                    <ToggleBtn active={!p.granted} label="Deny" color="#5c5c7a" onClick={() => setPermissions(prev => prev.map(pp => pp.id === p.id ? { ...pp, granted: false } : pp))} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={() => setStep('done')} style={btnStyle('#7c3aed', '#6d28d9')}>
                Continue →
              </button>
              <button onClick={() => setStep('account')} style={ghostBtnStyle}>← Back</button>
            </div>
          </div>
        )}

        {/* Done step */}
        {step === 'done' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(34,197,94,0.15)',
                border: '2px solid rgba(34,197,94,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28,
                animation: 'success-pulse 2s ease-in-out infinite',
              }}>
                ✓
              </div>
            </div>
            <h2 className="font-display" style={{ fontSize: 24, fontWeight: 700, color: '#eeeef5', margin: '0 0 8px' }}>
              Welcome, {name}!
            </h2>
            <p style={{ fontSize: 14, color: '#8b8ba7', margin: '0 0 8px', lineHeight: 1.6 }}>
              MAVIX AI is ready to assist you.
            </p>
            <p style={{ fontSize: 13, color: '#5c5c7a', margin: '0 0 28px', lineHeight: 1.6 }}>
              Say "Hey MAVIX" to get started, or type in the command bar. MAVIX understands your intent and takes action.
            </p>
            <button onClick={handleFinish} style={btnStyle('#7c3aed', '#6d28d9')}>
              Open MAVIX →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, type = 'text', placeholder, value, onChange, required }: {
  label: string; type?: string; placeholder: string; value: string; onChange: (v: string) => void; required?: boolean
}) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 500, color: '#8b8ba7', display: 'block', marginBottom: 6 }}>
        {label}{required && <span style={{ color: '#7c3aed' }}> *</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '10px 14px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10,
          color: '#eeeef5',
          fontSize: 14,
          outline: 'none',
          fontFamily: 'inherit',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.5)'; e.target.style.background = 'rgba(124,58,237,0.05)' }}
        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.04)' }}
      />
    </div>
  )
}

function ToggleBtn({ active, label, color, onClick }: { active: boolean; label: string; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 10px',
        borderRadius: 6,
        border: active ? `1px solid ${color}` : '1px solid rgba(255,255,255,0.1)',
        background: active ? `${color}20` : 'transparent',
        color: active ? color : '#5c5c7a',
        fontSize: 11,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  )
}

const btnStyle = (from: string, to: string): React.CSSProperties => ({
  width: '100%', padding: '12px',
  background: `linear-gradient(135deg, ${from}, ${to})`,
  border: 'none', borderRadius: 12,
  color: '#fff', fontSize: 14, fontWeight: 600,
  cursor: 'pointer', fontFamily: 'inherit',
  boxShadow: '0 0 24px rgba(124,58,237,0.3)',
  transition: 'box-shadow 0.2s',
})

const ghostBtnStyle: React.CSSProperties = {
  width: '100%', padding: '12px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 12,
  color: '#8b8ba7', fontSize: 14, fontWeight: 500,
  cursor: 'pointer', fontFamily: 'inherit',
  transition: 'all 0.15s',
}

const disabledBtnStyle: React.CSSProperties = {
  width: '100%', padding: '12px',
  background: 'rgba(124,58,237,0.15)',
  border: '1px solid rgba(124,58,237,0.2)',
  borderRadius: 12,
  color: 'rgba(255,255,255,0.3)', fontSize: 14, fontWeight: 600,
  cursor: 'not-allowed', fontFamily: 'inherit',
}

import { useState, useRef, useEffect } from 'react'
import { ActiveTask, OrbState } from '../types'
import { MavixOrb } from '../components/MavixOrb'

interface DashboardScreenProps {
  userName: string
  orbState: OrbState
  activeTask: ActiveTask | null
  onOrbClick: () => void
  onSendCommand: (text: string) => void
  onNavigateChat: () => void
  onNavigateTask: () => void
}

const CHIPS = [
  { label: 'Summarize this screen', icon: '🖥' },
  { label: 'Explain this slide', icon: '📊' },
  { label: 'Open Chrome', icon: '🌐' },
  { label: 'Find my OS PDF', icon: '📄' },
  { label: 'Create a folder', icon: '📁' },
]

const STEP_LABELS = ['Understand', 'Plan', 'Execute', 'Observe', 'Verify']

const TOOL_LIST = [
  { id: 'browser', label: 'Browser', icon: '🌐' },
  { id: 'files', label: 'Files', icon: '📁' },
  { id: 'apps', label: 'Applications', icon: '⚙️' },
  { id: 'screen', label: 'Screen', icon: '🖥' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function DashboardScreen({ userName, orbState, activeTask, onOrbClick, onSendCommand, onNavigateChat, onNavigateTask }: DashboardScreenProps) {
  const [input, setInput] = useState('')
  const [correction, setCorrection] = useState<{ original: string; suggested: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (!input.trim()) return
    onSendCommand(input.trim())
    setInput('')
    setCorrection(null)
    onNavigateChat()
  }

  const checkAutocorrect = (val: string) => {
    const corrections: Record<string, string> = {
      'operatng': 'operating', 'teh': 'the', 'scehdule': 'schedule',
      'algortihm': 'algorithm', 'complier': 'compiler', 'programing': 'programming',
    }
    const words = val.split(' ')
    for (const [typo, fix] of Object.entries(corrections)) {
      if (words.includes(typo)) {
        setCorrection({ original: typo, suggested: fix })
        return
      }
    }
    setCorrection(null)
  }

  const acceptCorrection = () => {
    if (!correction) return
    setInput(prev => prev.replace(correction.original, correction.suggested))
    setCorrection(null)
  }

  const completedSteps = activeTask?.steps.filter(s => s.status === 'done').length ?? 0

  return (
    <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* ── Main Column ─────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '28px 32px', gap: 24, overflow: 'auto' }}>

        {/* Greeting */}
        <div className="animate-fade-in">
          <div className="font-display" style={{ fontSize: 28, fontWeight: 700, color: '#eeeef5', marginBottom: 4 }}>
            {getGreeting()}, <span style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{userName}</span>
          </div>
          <div style={{ fontSize: 14, color: '#5c5c7a' }}>What would you like me to do?</div>
        </div>

        {/* Orb + Command Input */}
        <div className="animate-fade-in delay-100" style={{
          background: 'rgba(13,13,28,0.6)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20,
          padding: '28px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}>
          {/* Orb */}
          <div onClick={onOrbClick} style={{ cursor: 'pointer' }}>
            <MavixOrb state={orbState} size={130} showLabel />
          </div>

          {/* Command input */}
          <div style={{ width: '100%' }}>
            {/* Auto-correct suggestion */}
            {correction && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 14px',
                background: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(124,58,237,0.2)',
                borderRadius: 10,
                marginBottom: 8,
                fontSize: 12,
              }}>
                <span style={{ color: '#8b8ba7' }}>Did you mean</span>
                <span style={{ color: '#a855f7', fontWeight: 600 }}>"{correction.suggested}"</span>
                <span style={{ color: '#8b8ba7' }}>instead of</span>
                <span style={{ color: '#ef4444', textDecoration: 'line-through' }}>"{correction.original}"</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                  <SmallBtn label="Accept" onClick={acceptCorrection} color="#7c3aed" />
                  <SmallBtn label="Ignore" onClick={() => setCorrection(null)} color="#5c5c7a" />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => { setInput(e.target.value); checkAutocorrect(e.target.value) }}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask MAVIX anything…"
                  style={{
                    width: '100%',
                    padding: '14px 50px 14px 18px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 14,
                    color: '#eeeef5',
                    fontSize: 15,
                    outline: 'none',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.5)'; e.target.style.boxShadow = '0 0 20px rgba(124,58,237,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                />
                {/* Attach button */}
                <button title="Attach PDF/PPT" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#5c5c7a', fontSize: 16 }}>
                  📎
                </button>
              </div>

              {/* Mic button */}
              <button
                onClick={onOrbClick}
                title="Voice input"
                style={{
                  width: 50, height: 50,
                  borderRadius: 14,
                  background: orbState === 'listening' ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${orbState === 'listening' ? 'rgba(6,182,212,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                🎙
              </button>

              {/* Screen context button */}
              <button
                title="Capture screen context"
                style={{
                  width: 50, height: 50,
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                🖥
              </button>

              {/* Send */}
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                style={{
                  width: 50, height: 50,
                  borderRadius: 14,
                  background: input.trim() ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'rgba(124,58,237,0.15)',
                  border: 'none',
                  cursor: input.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff',
                  fontSize: 18,
                  boxShadow: input.trim() ? '0 0 20px rgba(124,58,237,0.35)' : 'none',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                →
              </button>
            </div>

            {/* Command chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              {CHIPS.map(chip => (
                <button
                  key={chip.label}
                  onClick={() => { setInput(chip.label); onSendCommand(chip.label); onNavigateChat() }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 20,
                    color: '#8b8ba7',
                    fontSize: 12,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.1)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; e.currentTarget.style.color = '#a855f7' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#8b8ba7' }}
                >
                  <span>{chip.icon}</span>
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Status row */}
        <div className="animate-fade-in delay-200" style={{ display: 'flex', gap: 12 }}>
          <StatCard label="Tasks Today" value="4" sub="completed" color="#7c3aed" />
          <StatCard label="Memory Items" value="3" sub="saved" color="#06b6d4" />
          <StatCard label="MAVIX Status" value="Active" sub="ready" color="#22c55e" />
        </div>
      </div>

      {/* ── Right Panel: Current Task ─────────────────── */}
      <div style={{
        width: 280,
        padding: '28px 20px',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', gap: 16,
        overflow: 'auto',
        flexShrink: 0,
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#5c5c7a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Current Task
        </div>

        {activeTask ? (
          <>
            <div style={{
              background: 'rgba(13,13,28,0.6)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14, padding: '14px 16px',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#eeeef5', marginBottom: 6 }}>
                {activeTask.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#7c3aed', animation: 'glow-fast 1.5s infinite' }} />
                <span style={{ fontSize: 12, color: '#7c3aed', fontWeight: 500 }}>
                  {activeTask.status === 'running' ? 'Working' : activeTask.status === 'paused' ? 'Paused' : activeTask.status}
                </span>
              </div>
            </div>

            {/* Progress steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activeTask.steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700,
                    background: step.status === 'done' ? '#22c55e' : step.status === 'running' ? '#7c3aed' : 'rgba(255,255,255,0.06)',
                    color: step.status === 'done' || step.status === 'running' ? '#fff' : '#5c5c7a',
                    boxShadow: step.status === 'running' ? '0 0 10px rgba(124,58,237,0.5)' : 'none',
                    animation: step.status === 'running' ? 'glow-pulse 1.5s infinite' : 'none',
                  }}>
                    {step.status === 'done' ? '✓' : step.status === 'running' ? '→' : '○'}
                  </div>
                  <div style={{ fontSize: 12, color: step.status === 'done' ? '#5c5c7a' : step.status === 'running' ? '#eeeef5' : '#3a3a5c', fontWeight: step.status === 'running' ? 500 : 400 }}>
                    {step.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Tool indicators */}
            <div>
              <div style={{ fontSize: 11, color: '#5c5c7a', marginBottom: 8, letterSpacing: '0.06em' }}>TOOLS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {TOOL_LIST.map(tool => {
                  const isActive = tool.id === activeTask.toolActive
                  return (
                    <div key={tool.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: isActive ? '#22c55e' : 'rgba(255,255,255,0.1)',
                        boxShadow: isActive ? '0 0 8px rgba(34,197,94,0.8)' : 'none',
                        flexShrink: 0,
                      }} />
                      <span style={{ fontSize: 12, color: isActive ? '#eeeef5' : '#3a3a5c' }}>{tool.icon} {tool.label}</span>
                      {isActive && <span style={{ fontSize: 10, color: '#22c55e', marginLeft: 'auto', fontWeight: 600 }}>● Active</span>}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Activity log */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
              <div style={{ fontSize: 11, color: '#5c5c7a', marginBottom: 8, letterSpacing: '0.06em' }}>AI ACTIVITY</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 120, overflow: 'auto' }}>
                {activeTask.activityLog.map((log, i) => (
                  <div key={i} style={{ fontSize: 11, color: i === activeTask.activityLog.length - 1 ? '#a855f7' : '#5c5c7a', display: 'flex', alignItems: 'center', gap: 5, animation: i === activeTask.activityLog.length - 1 ? 'step-in 0.3s ease-out' : 'none' }}>
                    {i === activeTask.activityLog.length - 1 ? '›' : '·'} {log}
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={onNavigateTask} style={{ flex: 1, padding: '8px', borderRadius: 10, border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.1)', color: '#a855f7', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                View Task
              </button>
            </div>
          </>
        ) : (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 12, padding: 24,
            background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.07)', borderRadius: 14,
          }}>
            <div style={{ fontSize: 28, opacity: 0.4 }}>⚡</div>
            <div style={{ fontSize: 13, color: '#5c5c7a', textAlign: 'center', lineHeight: 1.5 }}>
              No active task.<br/>Give MAVIX a command to get started.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div style={{
      flex: 1, padding: '16px', borderRadius: 14,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ fontSize: 11, color: '#5c5c7a', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color, lineHeight: 1, marginBottom: 2 }}>{value}</div>
      <div style={{ fontSize: 11, color: '#5c5c7a' }}>{sub}</div>
    </div>
  )
}

function SmallBtn({ label, onClick, color }: { label: string; onClick: () => void; color: string }) {
  return (
    <button onClick={onClick} style={{ padding: '3px 10px', borderRadius: 6, border: `1px solid ${color}40`, background: `${color}15`, color, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
      {label}
    </button>
  )
}

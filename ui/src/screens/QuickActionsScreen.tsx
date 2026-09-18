import { useState } from 'react'

interface QuickAction {
  id: string
  label: string
  icon: string
  description: string
  color: string
  shortcut?: string
}

const DEFAULT_ACTIONS: QuickAction[] = [
  { id: 'chrome', label: 'Open Chrome', icon: '🌐', description: 'Launch Google Chrome browser', color: '#06b6d4', shortcut: 'Ctrl+1' },
  { id: 'vscode', label: 'Open VS Code', icon: '⚙️', description: 'Launch Visual Studio Code editor', color: '#7c3aed', shortcut: 'Ctrl+2' },
  { id: 'screen', label: 'Summarize Screen', icon: '🖥', description: 'Capture and analyze current screen content', color: '#a855f7', shortcut: 'Ctrl+3' },
  { id: 'find', label: 'Find Files', icon: '🔍', description: 'Search for files in your workspace', color: '#06b6d4', shortcut: 'Ctrl+4' },
  { id: 'folder', label: 'Create Folder', icon: '📁', description: 'Create a new folder in the current directory', color: '#22c55e', shortcut: 'Ctrl+5' },
]

interface QuickActionsScreenProps {
  onExecuteAction: (label: string) => void
}

export function QuickActionsScreen({ onExecuteAction }: QuickActionsScreenProps) {
  const [actions, setActions] = useState<QuickAction[]>(DEFAULT_ACTIONS)
  const [running, setRunning] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)

  const handleRun = (action: QuickAction) => {
    setRunning(action.id)
    setDone(null)
    onExecuteAction(action.label)
    setTimeout(() => {
      setRunning(null)
      setDone(action.id)
      setTimeout(() => setDone(null), 2500)
    }, 1800)
  }

  return (
    <div style={{ flex: 1, padding: '24px 32px', overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div className="font-display" style={{ fontSize: 20, fontWeight: 700, color: '#eeeef5', marginBottom: 4 }}>Quick Actions</div>
          <div style={{ fontSize: 13, color: '#5c5c7a' }}>One-click commands for your most common tasks.</div>
        </div>
        <button style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#8b8ba7', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
          + Add Action
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
        {actions.map((action, i) => {
          const isRunning = running === action.id
          const isDone = done === action.id
          return (
            <button
              key={action.id}
              onClick={() => !isRunning && handleRun(action)}
              style={{
                padding: '20px',
                background: isDone ? 'rgba(34,197,94,0.08)' : isRunning ? `${action.color}12` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isDone ? 'rgba(34,197,94,0.3)' : isRunning ? `${action.color}40` : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 16,
                cursor: isRunning ? 'default' : 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
                transition: 'all 0.25s',
                animation: `fade-in 0.3s ease-out ${i * 0.06}s both`,
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => { if (!isRunning) { e.currentTarget.style.background = `${action.color}10`; e.currentTarget.style.borderColor = `${action.color}40`; e.currentTarget.style.boxShadow = `0 0 24px ${action.color}20` } }}
              onMouseLeave={e => { if (!isRunning && !isDone) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none' } }}
            >
              {/* Glow corner */}
              <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle, ${action.color}25, transparent)`, pointerEvents: 'none' }} />

              {/* Icon */}
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${action.color}15`,
                border: `1px solid ${action.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, marginBottom: 14,
                transition: 'all 0.2s',
              }}>
                {isDone ? '✓' : isRunning ? <SpinRing color={action.color} /> : action.icon}
              </div>

              {/* Label */}
              <div style={{ fontSize: 14, fontWeight: 700, color: '#eeeef5', marginBottom: 4 }}>
                {action.label}
              </div>

              {/* Description */}
              <div style={{ fontSize: 12, color: '#5c5c7a', lineHeight: 1.5, marginBottom: 12 }}>
                {isRunning ? 'Executing…' : isDone ? 'Completed ✓' : action.description}
              </div>

              {/* Shortcut */}
              {action.shortcut && !isRunning && !isDone && (
                <div style={{ display: 'inline-block', fontSize: 10, color: '#3a3a5c', background: 'rgba(255,255,255,0.04)', padding: '2px 7px', borderRadius: 5, border: '1px solid rgba(255,255,255,0.07)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {action.shortcut}
                </div>
              )}

              {/* Running indicator */}
              {isRunning && (
                <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1, overflow: 'hidden', marginTop: 8 }}>
                  <div style={{ height: '100%', background: `linear-gradient(90deg, transparent, ${action.color}, transparent)`, animation: 'shimmer 1.2s ease-in-out infinite', backgroundSize: '200% 100%' }} />
                </div>
              )}
            </button>
          )
        })}

        {/* Add custom action placeholder */}
        <div style={{
          padding: '20px',
          background: 'rgba(255,255,255,0.01)',
          border: '1px dashed rgba(255,255,255,0.08)',
          borderRadius: 16,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 8, minHeight: 160, cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; e.currentTarget.style.background = 'rgba(124,58,237,0.04)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.01)' }}
        >
          <div style={{ fontSize: 28, opacity: 0.3 }}>+</div>
          <div style={{ fontSize: 12, color: '#3a3a5c', textAlign: 'center' }}>Add custom action</div>
        </div>
      </div>

      {/* Info note */}
      <div style={{ marginTop: 24, padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', fontSize: 12, color: '#5c5c7a', lineHeight: 1.6 }}>
        💡 Quick Actions execute immediately with no confirmation needed. For sensitive actions, MAVIX will always ask before proceeding.
      </div>
    </div>
  )
}

function SpinRing({ color }: { color: string }) {
  return (
    <div style={{
      width: 20, height: 20, borderRadius: '50%',
      border: `2px solid ${color}30`,
      borderTopColor: color,
      animation: 'ring-rotate 0.7s linear infinite',
    }} />
  )
}

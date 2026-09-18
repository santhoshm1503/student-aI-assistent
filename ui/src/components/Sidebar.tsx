import { AppScreen, OrbState } from '../types'
import { OrbBadge } from './MavixOrb'

interface SidebarProps {
  active: AppScreen
  orbState: OrbState
  userName: string
  onNavigate: (screen: AppScreen) => void
  onNewTask: () => void
}

const NAV: Array<{ id: AppScreen | 'new'; label: string; icon: React.ReactNode; divider?: boolean }> = [
  { id: 'dashboard', label: 'Dashboard', icon: <GridIcon /> },
  { id: 'chat', label: 'Conversations', icon: <ChatIcon /> },
  { id: 'task', label: 'Live Task', icon: <TaskIcon /> },
  { id: 'history', label: 'Task History', icon: <HistoryIcon />, divider: true },
  { id: 'memory', label: 'Memory', icon: <MemoryIcon /> },
  { id: 'quickactions', label: 'Quick Actions', icon: <BoltIcon />, divider: true },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
]

export function Sidebar({ active, orbState, userName, onNavigate, onNewTask }: SidebarProps) {
  return (
    <aside style={{
      width: 220,
      minWidth: 220,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(8,8,18,0.95)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      padding: '16px 0',
      gap: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 16px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <OrbBadge state={orbState} size={34} />
        <div>
          <div className="font-display" style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.05em', color: '#eeeef5' }}>MAVIX</div>
          <div style={{ fontSize: 10, color: '#7c3aed', fontWeight: 500, letterSpacing: '0.12em' }}>AI</div>
        </div>
      </div>

      {/* New Task button */}
      <div style={{ padding: '0 12px 16px' }}>
        <button
          onClick={onNewTask}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 12px',
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            fontFamily: 'inherit',
            boxShadow: '0 0 20px rgba(124,58,237,0.3)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 30px rgba(124,58,237,0.5)')}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 20px rgba(124,58,237,0.3)')}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
          New Task
        </button>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(item => {
          if (item.id === 'new') return null
          const isActive = active === item.id
          return (
            <div key={item.id}>
              {item.divider && (
                <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '8px 8px' }} />
              )}
              <button
                onClick={() => onNavigate(item.id as AppScreen)}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px',
                  background: isActive ? 'rgba(124,58,237,0.15)' : 'transparent',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  color: isActive ? '#a855f7' : '#8b8ba7',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.color = '#eeeef5'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#8b8ba7'
                  }
                }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute', left: 0, top: '50%',
                    transform: 'translateY(-50%)',
                    width: 3, height: 20,
                    background: '#7c3aed',
                    borderRadius: '0 2px 2px 0',
                  }} />
                )}
                <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                {item.label}
              </button>
            </div>
          )
        })}
      </nav>

      {/* Profile */}
      <div style={{ padding: '12px 12px 4px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 10px',
          borderRadius: 8,
          background: 'rgba(255,255,255,0.03)',
          cursor: 'pointer',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {userName?.[0]?.toUpperCase() || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#eeeef5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userName || 'Student'}
            </div>
            <div style={{ fontSize: 10, color: '#5c5c7a' }}>Student</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

/* ── Icon SVGs ─────────────────────────────────── */

function GridIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9"/></svg>
}
function ChatIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H6l-3 2V3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>
}
function TaskIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
}
function HistoryIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
}
function MemoryIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 2C5.24 2 3 4.24 3 7s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" stroke="currentColor" strokeWidth="1.4"/><path d="M8 7V5M8 7l2 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
}
function BoltIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M9 2L4 9h5l-2 5 7-7H9l2-5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>
}
function SettingsIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
}

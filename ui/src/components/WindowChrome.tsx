interface WindowChromeProps {
  title?: string
}

export function WindowChrome({ title = 'MAVIX AI — From Intent to Action' }: WindowChromeProps) {
  return (
    <div style={{
      height: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      background: '#050509',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      flexShrink: 0,
      userSelect: 'none',
    }}>
      {/* Window controls (Windows style — right side) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 18, height: 18, borderRadius: 4,
          background: 'rgba(124,58,237,0.15)',
          border: '1px solid rgba(124,58,237,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5L5 2L8 5L5 8L2 5Z" fill="#7c3aed" opacity="0.8"/>
          </svg>
        </div>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.02em' }}>{title}</span>
      </div>

      <div style={{ display: 'flex', gap: 0 }}>
        {/* Minimize */}
        <WinButton label="─" hoverColor="rgba(255,255,255,0.1)" />
        {/* Maximize */}
        <WinButton label="□" hoverColor="rgba(255,255,255,0.1)" />
        {/* Close */}
        <WinButton label="✕" hoverColor="rgba(239,68,68,0.8)" />
      </div>
    </div>
  )
}

function WinButton({ label, hoverColor }: { label: string; hoverColor: string }) {
  return (
    <button
      style={{
        width: 46, height: 32,
        background: 'transparent',
        border: 'none',
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'background 0.15s, color 0.15s',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = hoverColor
        e.currentTarget.style.color = 'white'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
      }}
    >
      {label}
    </button>
  )
}

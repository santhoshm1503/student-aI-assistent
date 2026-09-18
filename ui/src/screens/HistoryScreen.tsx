import { HistoryItem } from '../types'

interface HistoryScreenProps {
  history: HistoryItem[]
}

const DEFAULT_HISTORY: HistoryItem[] = [
  { id: '1', title: 'Summarized OS lecture PDF', status: 'success', tools: ['screen', 'files'], completedAt: new Date(Date.now() - 600000), duration: '8s' },
  { id: '2', title: 'Opened Chrome and searched operating system scheduling', status: 'success', tools: ['browser'], completedAt: new Date(Date.now() - 1200000), duration: '4s' },
  { id: '3', title: 'Created OS Notes folder and moved PDF', status: 'success', tools: ['files'], completedAt: new Date(Date.now() - 3600000), duration: '12s' },
  { id: '4', title: 'VTOP login and timetable navigation', status: 'success', tools: ['browser'], completedAt: new Date(Date.now() - 7200000), duration: '18s' },
  { id: '5', title: 'Explained CPU scheduling slide', status: 'success', tools: ['screen'], completedAt: new Date(Date.now() - 86400000), duration: '3s' },
  { id: '6', title: 'Find and open Process Synchronization notes', status: 'error', tools: ['files'], completedAt: new Date(Date.now() - 90000000), duration: '—' },
]

const TOOL_ICONS: Record<string, string> = {
  browser: '🌐', files: '📁', screen: '🖥', apps: '⚙️',
}

function groupByDay(items: HistoryItem[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const groups: Record<string, HistoryItem[]> = {}
  items.forEach(item => {
    const d = new Date(item.completedAt)
    d.setHours(0, 0, 0, 0)
    const label = d >= today ? 'Today' : d >= yesterday ? 'Yesterday' : d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })
    if (!groups[label]) groups[label] = []
    groups[label].push(item)
  })
  return groups
}

export function HistoryScreen({ history }: HistoryScreenProps) {
  const items = history.length > 0 ? history : DEFAULT_HISTORY
  const groups = groupByDay(items)

  return (
    <div style={{ flex: 1, padding: '24px 32px', overflow: 'auto' }}>
      <div style={{ marginBottom: 24 }}>
        <div className="font-display" style={{ fontSize: 20, fontWeight: 700, color: '#eeeef5', marginBottom: 4 }}>Task History</div>
        <div style={{ fontSize: 13, color: '#5c5c7a' }}>A record of every action MAVIX has taken on your behalf.</div>
      </div>

      {/* Filter row */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['All', 'Success', 'Error'].map(f => (
          <button key={f} style={{
            padding: '6px 14px',
            background: f === 'All' ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
            border: f === 'All' ? '1px solid rgba(124,58,237,0.35)' : '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20, color: f === 'All' ? '#a855f7' : '#8b8ba7',
            fontSize: 12, fontWeight: f === 'All' ? 600 : 400,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>{f}</button>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: 13, color: '#5c5c7a', display: 'flex', alignItems: 'center' }}>
          {items.length} tasks
        </div>
      </div>

      {/* Groups */}
      {Object.entries(groups).map(([day, dayItems]) => (
        <div key={day} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#5c5c7a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
            {day}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {dayItems.map((item, i) => (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 18px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
                transition: 'all 0.15s',
                animation: `fade-in 0.3s ease-out ${i * 0.05}s both`,
                cursor: 'default',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.06)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
              >
                {/* Status icon */}
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14,
                  background: item.status === 'success' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                  border: `1px solid ${item.status === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                }}>
                  {item.status === 'success' ? '✓' : '✕'}
                </div>

                {/* Title */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#eeeef5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.title}
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    {item.tools.map(t => (
                      <span key={t} style={{ fontSize: 10, color: '#5c5c7a', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: 4 }}>
                        {TOOL_ICONS[t]} {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Time + duration */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 12, color: '#5c5c7a' }}>
                    {item.completedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ fontSize: 11, color: '#3a3a5c', marginTop: 2 }}>{item.duration}</div>
                </div>

                {/* Status badge */}
                <div style={{
                  padding: '4px 10px', borderRadius: 20, flexShrink: 0,
                  fontSize: 11, fontWeight: 600,
                  background: item.status === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  color: item.status === 'success' ? '#22c55e' : '#ef4444',
                  border: `1px solid ${item.status === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                }}>
                  {item.status === 'success' ? 'Success' : 'Error'}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

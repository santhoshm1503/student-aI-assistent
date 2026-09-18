import { useState } from 'react'
import { MemoryItem } from '../types'

interface MemoryScreenProps {
  memory: MemoryItem[]
  onAdd: (content: string) => void
  onDelete: (id: string) => void
}

const DEFAULT_MEMORY: MemoryItem[] = [
  { id: '1', content: 'Need to revise CPU scheduling algorithms before the exam.', createdAt: new Date(Date.now() - 3600000) },
  { id: '2', content: 'OS PDF is in the Downloads folder — move to OS Notes.', createdAt: new Date(Date.now() - 7200000) },
  { id: '3', content: 'VTOP credentials stored securely in system keychain.', createdAt: new Date(Date.now() - 86400000) },
]

export function MemoryScreen({ memory, onAdd, onDelete }: MemoryScreenProps) {
  const [items, setItems] = useState<MemoryItem[]>(DEFAULT_MEMORY.concat(memory.filter(m => !DEFAULT_MEMORY.find(d => d.id === m.id))))
  const [newContent, setNewContent] = useState('')
  const [adding, setAdding] = useState(false)

  const handleAdd = () => {
    if (!newContent.trim()) return
    const item: MemoryItem = { id: Date.now().toString(), content: newContent.trim(), createdAt: new Date() }
    setItems(prev => [item, ...prev])
    onAdd(newContent.trim())
    setNewContent('')
    setAdding(false)
  }

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
    onDelete(id)
  }

  return (
    <div style={{ flex: 1, padding: '24px 32px', overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div className="font-display" style={{ fontSize: 20, fontWeight: 700, color: '#eeeef5', marginBottom: 4 }}>Memory</div>
          <div style={{ fontSize: 13, color: '#5c5c7a' }}>Context MAVIX remembers across sessions.</div>
        </div>
        <button
          onClick={() => setAdding(true)}
          style={{
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            border: 'none', borderRadius: 10,
            color: '#fff', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 0 20px rgba(124,58,237,0.3)',
          }}
        >
          + Add Memory
        </button>
      </div>

      {/* Privacy note */}
      <div style={{
        padding: '10px 14px', borderRadius: 10,
        background: 'rgba(6,182,212,0.06)',
        border: '1px solid rgba(6,182,212,0.15)',
        marginBottom: 20, fontSize: 12, color: '#8b8ba7',
        display: 'flex', gap: 8, alignItems: 'center',
      }}>
        <span style={{ fontSize: 14 }}>🔒</span>
        Memory is stored locally on your device. You can view, edit, or delete any item at any time.
      </div>

      {/* Add form */}
      {adding && (
        <div style={{
          padding: '16px 18px',
          background: 'rgba(124,58,237,0.08)',
          border: '1px solid rgba(124,58,237,0.25)',
          borderRadius: 14, marginBottom: 16,
          animation: 'fade-in 0.3s ease-out',
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#a855f7', marginBottom: 10 }}>New memory item</div>
          <textarea
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            placeholder="What should MAVIX remember? e.g. 'My exam is on Friday'"
            rows={3}
            style={{
              width: '100%', padding: '10px 14px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, color: '#eeeef5',
              fontSize: 13, outline: 'none',
              fontFamily: 'inherit', resize: 'none',
            }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button onClick={handleAdd} style={{ padding: '8px 16px', background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 8, color: '#a855f7', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Save</button>
            <button onClick={() => { setAdding(false); setNewContent('') }} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#8b8ba7', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Memory list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item, i) => (
          <div key={item.id} style={{
            padding: '16px 18px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14,
            display: 'flex', gap: 14, alignItems: 'flex-start',
            animation: `fade-in 0.3s ease-out ${i * 0.05}s both`,
            transition: 'all 0.15s',
            position: 'relative',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)'; e.currentTarget.style.background = 'rgba(124,58,237,0.04)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
          >
            {/* Icon */}
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
              💡
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: '#eeeef5', lineHeight: 1.5, marginBottom: 6 }}>
                {item.content}
              </div>
              <div style={{ fontSize: 11, color: '#3a3a5c' }}>
                {item.createdAt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            <button
              onClick={() => handleDelete(item.id)}
              style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.15)',
                color: '#ef444480', fontSize: 13,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef444480'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.15)' }}
            >
              ✕
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#5c5c7a' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>💡</div>
            <div style={{ fontSize: 14 }}>No saved memories yet.</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Click "Add Memory" or ask MAVIX to remember something.</div>
          </div>
        )}
      </div>
    </div>
  )
}

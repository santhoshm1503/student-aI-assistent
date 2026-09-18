import { useState, useRef, useEffect } from 'react'
import { Message, OrbState } from '../types'
import { OrbBadge } from '../components/MavixOrb'

interface ChatScreenProps {
  messages: Message[]
  orbState: OrbState
  onSend: (text: string) => void
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1', role: 'user',
    content: 'Summarize the main concept on this screen',
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: '2', role: 'assistant',
    content: 'Based on your screen, the content covers **CPU Scheduling Algorithms** in Operating Systems.\n\nThe key concepts are:\n- **Round Robin** — time-sliced preemptive scheduling\n- **FCFS** — First Come First Served, non-preemptive\n- **SJF** — Shortest Job First, optimal for minimizing average waiting time\n\nThe current slide focuses on comparing Gantt chart representations of these algorithms.',
    timestamp: new Date(Date.now() - 299000),
    workflow: {
      understand: 'Screen context captured — PDF viewer showing OS lecture notes.',
      plan: ['Capture visible text', 'Identify main topic', 'Summarize key points'],
      result: 'Summary generated from screen content.',
    },
  },
  {
    id: '3', role: 'user',
    content: 'Open Chrome and search operating system scheduling',
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: '4', role: 'assistant',
    content: 'I\'ve opened Chrome and searched for "operating system scheduling". The search results are now visible on screen. Would you like me to open any specific result or summarize the top results for you?',
    timestamp: new Date(Date.now() - 118000),
    workflow: {
      understand: 'User wants to browse OS scheduling content in Chrome.',
      plan: ['Open Chrome browser', 'Navigate to Google', 'Search for "operating system scheduling"', 'Verify search results loaded'],
      result: 'Browser opened and search completed successfully.',
    },
  },
]

export function ChatScreen({ messages: externalMessages, orbState, onSend }: ChatScreenProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (externalMessages.length > 0) {
      const last = externalMessages[externalMessages.length - 1]
      setMessages(prev => {
        if (prev.find(m => m.id === last.id)) return prev
        return [...prev, last]
      })
    }
  }, [externalMessages])

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    onSend(input.trim())

    // Simulate MAVIX response
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I've processed your request: "${userMsg.content}". Let me help you with that.`,
        timestamp: new Date(),
        workflow: {
          understand: `Analyzing: "${userMsg.content}"`,
          plan: ['Understand intent', 'Select appropriate capability', 'Execute action', 'Verify result'],
          result: 'Action completed.',
        },
      }
      setMessages(prev => [...prev, aiMsg])
    }, 2200)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: 12,
        flexShrink: 0,
      }}>
        <OrbBadge state={orbState} size={32} />
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#eeeef5' }}>MAVIX Conversations</div>
          <div style={{ fontSize: 11, color: '#5c5c7a' }}>Today · 4 messages</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <HeaderBtn label="📎 Attach" />
          <HeaderBtn label="🖥 Screen" />
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            gap: 10,
            animation: 'fade-in 0.3s ease-out',
          }}>
            {msg.role === 'assistant' && (
              <div style={{ flexShrink: 0, marginTop: 2 }}>
                <OrbBadge state={orbState} size={28} />
              </div>
            )}

            <div style={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {/* Message bubble */}
              <div style={{
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
                  : 'rgba(255,255,255,0.05)',
                border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                color: '#eeeef5',
                fontSize: 14,
                lineHeight: 1.6,
                boxShadow: msg.role === 'user' ? '0 0 20px rgba(124,58,237,0.3)' : 'none',
              }}>
                <FormattedText text={msg.content} />
              </div>

              {/* Workflow expand (for assistant messages) */}
              {msg.role === 'assistant' && msg.workflow && (
                <div>
                  <button
                    onClick={() => setExpandedWorkflow(expandedWorkflow === msg.id ? null : msg.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#5c5c7a', fontSize: 11, padding: '2px 0',
                      fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4,
                    }}
                  >
                    <span style={{ transform: expandedWorkflow === msg.id ? 'rotate(90deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>›</span>
                    View MAVIX reasoning
                  </button>

                  {expandedWorkflow === msg.id && (
                    <div style={{
                      marginTop: 6,
                      background: 'rgba(124,58,237,0.06)',
                      border: '1px solid rgba(124,58,237,0.15)',
                      borderRadius: 12,
                      padding: '12px 14px',
                      animation: 'fade-in 0.2s ease-out',
                    }}>
                      <WorkflowRow icon="🧠" label="Understanding" text={msg.workflow.understand} color="#06b6d4" />
                      <div style={{ margin: '10px 0 6px', fontSize: 11, color: '#5c5c7a', fontWeight: 600 }}>Plan:</div>
                      {msg.workflow.plan.map((p, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff', flexShrink: 0 }}>✓</div>
                          <span style={{ fontSize: 12, color: '#8b8ba7' }}>{p}</span>
                        </div>
                      ))}
                      <WorkflowRow icon="✓" label="Result" text={msg.workflow.result} color="#22c55e" />
                    </div>
                  )}
                </div>
              )}

              {/* Action buttons */}
              {msg.role === 'assistant' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <MsgAction label="🔊 Play" />
                  <MsgAction label="📋 Copy" />
                  <MsgAction label="↻ Regenerate" />
                </div>
              )}

              <div style={{ fontSize: 10, color: '#3a3a5c', padding: '0 4px' }}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, animation: 'fade-in 0.3s ease-out' }}>
            <OrbBadge state="thinking" size={28} />
            <div style={{
              padding: '12px 16px',
              borderRadius: '16px 16px 16px 4px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', gap: 5, alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#7c3aed',
                  animation: `dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Continue the conversation…"
            style={{
              flex: 1, padding: '12px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              color: '#eeeef5', fontSize: 14,
              outline: 'none', fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.4)'; e.target.style.boxShadow = '0 0 16px rgba(124,58,237,0.1)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
          />
          <button onClick={handleSend} disabled={!input.trim()} style={{
            padding: '12px 20px',
            background: input.trim() ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'rgba(124,58,237,0.15)',
            border: 'none', borderRadius: 12,
            color: '#fff', fontSize: 18, cursor: input.trim() ? 'pointer' : 'default',
            boxShadow: input.trim() ? '0 0 20px rgba(124,58,237,0.3)' : 'none',
            transition: 'all 0.2s',
          }}>
            →
          </button>
        </div>
      </div>
    </div>
  )
}

function FormattedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i}>{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </>
  )
}

function WorkflowRow({ icon, label, text, color }: { icon: string; label: string; text: string; color: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
      <span style={{ color, fontSize: 12, flexShrink: 0 }}>{icon}</span>
      <div>
        <span style={{ fontSize: 11, fontWeight: 600, color }}>{label}: </span>
        <span style={{ fontSize: 12, color: '#8b8ba7' }}>{text}</span>
      </div>
    </div>
  )
}

function HeaderBtn({ label }: { label: string }) {
  return (
    <button style={{
      padding: '6px 12px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 8, color: '#8b8ba7',
      fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
    }}>
      {label}
    </button>
  )
}

function MsgAction({ label }: { label: string }) {
  return (
    <button style={{
      padding: '3px 8px',
      background: 'none',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 6, color: '#5c5c7a',
      fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
      transition: 'all 0.15s',
    }}
    onMouseEnter={e => { e.currentTarget.style.color = '#8b8ba7'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
    onMouseLeave={e => { e.currentTarget.style.color = '#5c5c7a'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
    >
      {label}
    </button>
  )
}

import { useState, useRef } from 'react'
import { OrbState, TaskStatus } from '../types'
import { MavixOrb } from '../components/MavixOrb'

interface TaskScreenProps {
  task: { title: string } | null
  orbState: OrbState
  onOrbStateChange: (s: OrbState) => void
  onTaskChange: (t: null) => void
}

type StepStatus = 'pending' | 'running' | 'done' | 'error'

interface DemoStep {
  label: string
  status: StepStatus
}

interface DemoTask {
  title: string
  steps: DemoStep[]
  tools: string[]
  activeTools: string[]
  activityLog: string[]
  toolActive: string
  status: TaskStatus
}

const DEMO_TASK: DemoTask = {
  title: 'Create OS Notes folder and move my OS PDF into it.',
  steps: [
    { label: 'Understand request', status: 'pending' },
    { label: 'Find OS PDF', status: 'pending' },
    { label: 'Create OS Notes folder', status: 'pending' },
    { label: 'Move PDF into folder', status: 'pending' },
    { label: 'Verify result', status: 'pending' },
  ],
  tools: ['files'],
  activeTools: ['files'],
  activityLog: ['Waiting to start…'],
  toolActive: 'files',
  status: 'idle',
}

const ACTIVITY_SEQUENCE = [
  'Understanding request…',
  'Identifying target files…',
  'Found OS_Lecture_Notes.pdf in Downloads',
  'Creating folder "OS Notes"…',
  'Moving OS_Lecture_Notes.pdf → OS Notes/',
  'Verifying folder contents…',
  'Verification complete ✓',
]

const TOOL_LIST = [
  { id: 'browser', label: 'Browser', icon: '🌐' },
  { id: 'files', label: 'Files', icon: '📁' },
  { id: 'apps', label: 'Applications', icon: '⚙️' },
  { id: 'screen', label: 'Screen', icon: '🖥' },
]

const CONFIRMATION_STEP = {
  action: 'Delete OS_Old_Notes.pdf permanently?',
  detail: 'This file will be removed from the filesystem. This action cannot be undone.',
}

export function TaskScreen({ task: externalTask, orbState, onOrbStateChange, onTaskChange }: TaskScreenProps) {
  const [task, setTask] = useState<DemoTask | null>(externalTask ? {
    ...DEMO_TASK, title: externalTask.title,
  } : null)
  const [stepIdx, setStepIdx] = useState(0)
  const [actIdx, setActIdx] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showError, setShowError] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = () => { if (timerRef.current) clearTimeout(timerRef.current) }

  const advance = (currentStep: number, currentAct: number, steps: DemoStep[]) => {
    const newSteps: DemoStep[] = steps.map((s, i) => ({
      ...s,
      status: i < currentStep ? 'done' : i === currentStep ? 'running' : 'pending',
    }))

    setTask(prev => prev ? {
      ...prev,
      steps: newSteps,
      activityLog: ACTIVITY_SEQUENCE.slice(0, currentAct + 1),
      status: 'running' as TaskStatus,
    } : null)

    if (currentStep === 3) {
      // Trigger confirmation before step 4
      timerRef.current = setTimeout(() => {
        setShowConfirm(true)
        onOrbStateChange('confirming')
      }, 1800)
      return
    }

    if (currentStep >= steps.length) {
      setShowSuccess(true)
      onOrbStateChange('success')
      setIsRunning(false)
      return
    }

    timerRef.current = setTimeout(() => {
      advance(currentStep + 1, Math.min(currentAct + 1, ACTIVITY_SEQUENCE.length - 1), newSteps)
    }, 2000)
  }

  const startTask = () => {
    setIsRunning(true)
    setIsPaused(false)
    setShowError(false)
    setShowSuccess(false)
    setShowConfirm(false)
    setStepIdx(0)
    setActIdx(0)
    onOrbStateChange('working')
    setTask(DEMO_TASK)
    timerRef.current = setTimeout(() => advance(0, 0, DEMO_TASK.steps), 600)
  }

  const pauseTask = () => {
    clearTimer()
    setIsPaused(true)
    setIsRunning(false)
    onOrbStateChange('idle')
    setTask(prev => prev ? { ...prev, status: 'paused' } : null)
  }

  const resumeTask = () => {
    setIsPaused(false)
    setIsRunning(true)
    onOrbStateChange('working')
    const doneCount = task?.steps.filter(s => s.status === 'done').length ?? 0
    if (task) advance(doneCount, Math.min(doneCount + 1, ACTIVITY_SEQUENCE.length - 1), task.steps)
  }

  const stopTask = () => {
    clearTimer()
    setIsRunning(false)
    setIsPaused(false)
    setTask(null)
    onOrbStateChange('idle')
  }

  const confirmAction = () => {
    setShowConfirm(false)
    onOrbStateChange('working')
    const doneCount = task?.steps.filter(s => s.status === 'done').length ?? 3
    if (task) advance(doneCount + 1, ACTIVITY_SEQUENCE.length - 1, task.steps)
  }

  const showErrorState = () => {
    clearTimer()
    setShowError(true)
    setIsRunning(false)
    onOrbStateChange('error')
    setTask(prev => prev ? { ...prev, status: 'error' } : null)
  }

  return (
    <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Main task area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 32px', overflow: 'auto', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#eeeef5', marginBottom: 4 }} className="font-display">Live Task Execution</div>
            <div style={{ fontSize: 13, color: '#5c5c7a' }}>Monitor and control MAVIX task execution in real time</div>
          </div>

          {/* Demo controls */}
          <div style={{ display: 'flex', gap: 8 }}>
            {!isRunning && !isPaused && (
              <button onClick={startTask} style={primaryBtn}>▶ Start Demo Task</button>
            )}
            {isRunning && (
              <>
                <button onClick={pauseTask} style={warningBtn}>⏸ Pause</button>
                <button onClick={showErrorState} style={ghostBtn}>⚠ Simulate Error</button>
                <button onClick={stopTask} style={dangerBtn}>■ Stop</button>
              </>
            )}
            {isPaused && (
              <>
                <button onClick={resumeTask} style={primaryBtn}>▶ Resume</button>
                <button onClick={stopTask} style={dangerBtn}>■ Cancel</button>
              </>
            )}
          </div>
        </div>

        {/* Task card */}
        {task ? (
          <div style={{
            background: 'rgba(13,13,28,0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 18, padding: '24px',
            animation: 'fade-in 0.4s ease-out',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
              <MavixOrb state={orbState} size={80} showLabel />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#eeeef5', marginBottom: 6, lineHeight: 1.5 }}>
                  {task.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <StatusBadge status={task.status} isPaused={isPaused} />
                </div>
              </div>
            </div>

            {/* Step progress */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: '#5c5c7a', marginBottom: 12, letterSpacing: '0.08em' }}>PROGRESS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {task.steps.map((step, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    animation: step.status === 'running' ? 'step-in 0.4s ease-out' : 'none',
                  }}>
                    {/* Connector line */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: step.status === 'done' ? 12 : 11,
                        fontWeight: 700,
                        background: step.status === 'done' ? '#22c55e' : step.status === 'running' ? '#7c3aed' : 'rgba(255,255,255,0.06)',
                        color: step.status !== 'pending' ? '#fff' : '#3a3a5c',
                        boxShadow: step.status === 'running' ? '0 0 16px rgba(124,58,237,0.6)' : 'none',
                        animation: step.status === 'running' ? 'glow-pulse 1.5s ease-in-out infinite' : 'none',
                        transition: 'all 0.4s',
                      }}>
                        {step.status === 'done' ? '✓' : step.status === 'running' ? '→' : i + 1}
                      </div>
                      {i < task.steps.length - 1 && (
                        <div style={{ width: 1, height: 16, background: step.status === 'done' ? '#22c55e50' : 'rgba(255,255,255,0.08)' }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: step.status === 'running' ? 600 : 400, color: step.status === 'pending' ? '#3a3a5c' : step.status === 'done' ? '#8b8ba7' : '#eeeef5', transition: 'all 0.3s' }}>
                        {step.label}
                      </div>
                      {step.status === 'running' && (
                        <div style={{ fontSize: 11, color: '#7c3aed', marginTop: 2, animation: 'fade-in 0.3s ease-out' }}>
                          In progress…
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tool indicators */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: '#5c5c7a', marginBottom: 10, letterSpacing: '0.08em' }}>TOOLS</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {TOOL_LIST.map(tool => {
                  const isActive = tool.id === task.toolActive && isRunning
                  return (
                    <div key={tool.id} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '6px 12px',
                      borderRadius: 20,
                      background: isActive ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isActive ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.06)'}`,
                      transition: 'all 0.3s',
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: isActive ? '#22c55e' : 'rgba(255,255,255,0.15)', boxShadow: isActive ? '0 0 8px rgba(34,197,94,0.8)' : 'none', transition: 'all 0.3s' }} />
                      <span style={{ fontSize: 12, color: isActive ? '#eeeef5' : '#5c5c7a' }}>{tool.icon} {tool.label}</span>
                      {isActive && <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 600 }}>Active</span>}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Activity log */}
            <div>
              <div style={{ fontSize: 12, color: '#5c5c7a', marginBottom: 10, letterSpacing: '0.08em' }}>AI ACTIVITY LOG</div>
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10, padding: '12px 14px',
                maxHeight: 140, overflowY: 'auto',
                display: 'flex', flexDirection: 'column', gap: 6,
              }}>
                {(task.activityLog || ['Waiting to start…']).map((log, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    animation: 'step-in 0.3s ease-out',
                  }}>
                    <span style={{ fontSize: 10, color: '#3a3a5c', fontFamily: 'JetBrains Mono, monospace' }}>
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <span style={{ fontSize: 12, color: i === (task.activityLog?.length ?? 1) - 1 ? '#a855f7' : '#8b8ba7' }}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <EmptyTaskState onStart={startTask} />
        )}

        {/* Paused state */}
        {isPaused && (
          <div style={{
            background: 'rgba(249,115,22,0.08)',
            border: '1px solid rgba(249,115,22,0.25)',
            borderRadius: 14, padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            animation: 'fade-in 0.3s ease-out',
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f97316' }}>⏸ Task Paused</div>
              <div style={{ fontSize: 12, color: '#8b8ba7', marginTop: 2 }}>MAVIX is waiting. Resume to continue or cancel to stop.</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={resumeTask} style={primaryBtn}>▶ Resume</button>
              <button onClick={stopTask} style={dangerBtn}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Overlays */}
      {showConfirm && <ConfirmOverlay action={CONFIRMATION_STEP.action} detail={CONFIRMATION_STEP.detail} onConfirm={confirmAction} onCancel={() => { setShowConfirm(false); stopTask() }} />}
      {showError && <ErrorOverlay onRetry={startTask} onCancel={stopTask} />}
      {showSuccess && task && <SuccessOverlay title={task.title} onDone={stopTask} />}
    </div>
  )
}

function StatusBadge({ status, isPaused }: { status: string; isPaused: boolean }) {
  const s = isPaused ? 'paused' : status
  const map: Record<string, { label: string; color: string; bg: string }> = {
    idle: { label: 'Idle', color: '#5c5c7a', bg: 'rgba(255,255,255,0.05)' },
    running: { label: 'Working', color: '#7c3aed', bg: 'rgba(124,58,237,0.12)' },
    paused: { label: 'Paused', color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
    completed: { label: 'Completed', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    error: { label: 'Error', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    confirming: { label: 'Awaiting Confirmation', color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  }
  const { label, color, bg } = map[s] || map.idle
  return (
    <div style={{ padding: '4px 12px', borderRadius: 20, background: bg, fontSize: 12, fontWeight: 600, color, display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}`, animation: s === 'running' ? 'glow-fast 1s infinite' : 'none' }} />
      {label}
    </div>
  )
}

function ConfirmOverlay({ action, detail, onConfirm, onCancel }: { action: string; detail: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
      animation: 'fade-in 0.2s ease-out',
    }}>
      <div style={{
        width: 420,
        background: 'rgba(13,13,28,0.95)',
        border: '1px solid rgba(249,115,22,0.4)',
        borderRadius: 20, padding: '32px 36px',
        textAlign: 'center',
        boxShadow: '0 0 60px rgba(249,115,22,0.2)',
        animation: 'popup-in 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(249,115,22,0.15)',
          border: '2px solid rgba(249,115,22,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, margin: '0 auto 20px',
          animation: 'confirm-pulse 2s ease-in-out infinite',
        }}>⚠</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#f97316', marginBottom: 8 }}>Confirmation Required</div>
        <div style={{ fontSize: 15, color: '#eeeef5', marginBottom: 8, fontWeight: 500 }}>{action}</div>
        <div style={{ fontSize: 13, color: '#8b8ba7', marginBottom: 28, lineHeight: 1.6 }}>{detail}</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#8b8ba7', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '12px', background: 'rgba(249,115,22,0.2)', border: '1px solid rgba(249,115,22,0.4)', borderRadius: 12, color: '#f97316', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

function ErrorOverlay({ onRetry, onCancel }: { onRetry: () => void; onCancel: () => void }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }}>
      <div style={{
        width: 400,
        background: 'rgba(13,13,28,0.95)',
        border: '1px solid rgba(239,68,68,0.35)',
        borderRadius: 20, padding: '32px 36px',
        textAlign: 'center',
        boxShadow: '0 0 60px rgba(239,68,68,0.15)',
        animation: 'popup-in 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>⚠</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#ef4444', marginBottom: 8 }}>Something went wrong</div>
        <div style={{ fontSize: 14, color: '#eeeef5', marginBottom: 6 }}>I couldn't complete this step.</div>
        <div style={{ fontSize: 13, color: '#8b8ba7', marginBottom: 28, lineHeight: 1.6 }}>
          The file operation failed. The folder may not exist or permissions may be restricted.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#8b8ba7', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Cancel
          </button>
          <button onClick={onRetry} style={{ flex: 1, padding: '12px', background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 12, color: '#a855f7', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Retry
          </button>
        </div>
      </div>
    </div>
  )
}

function SuccessOverlay({ title, onDone }: { title: string; onDone: () => void }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }}>
      <div style={{
        width: 420,
        background: 'rgba(13,13,28,0.95)',
        border: '1px solid rgba(34,197,94,0.35)',
        borderRadius: 20, padding: '36px 40px',
        textAlign: 'center',
        boxShadow: '0 0 80px rgba(34,197,94,0.15)',
        animation: 'popup-in 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <MavixOrb state="success" size={100} showLabel />
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#22c55e', marginBottom: 8 }}>✓ Task Completed</div>
          <div style={{ fontSize: 14, color: '#eeeef5', marginBottom: 16, lineHeight: 1.6 }}>
            Your OS Notes folder is ready and the PDF has been moved successfully.
          </div>
          <div style={{ fontSize: 12, color: '#5c5c7a', marginBottom: 24, lineHeight: 1.6 }}>
            Verified: OS_Lecture_Notes.pdf → ~/Documents/OS Notes/
          </div>
          <button onClick={onDone} style={{ padding: '12px 32px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: 12, color: '#22c55e', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

function EmptyTaskState({ onStart }: { onStart: () => void }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 20, padding: 60,
      background: 'rgba(255,255,255,0.02)',
      border: '1px dashed rgba(255,255,255,0.07)',
      borderRadius: 18,
    }}>
      <MavixOrb state="idle" size={90} showLabel />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#eeeef5', marginBottom: 8 }}>No active task</div>
        <div style={{ fontSize: 13, color: '#5c5c7a', lineHeight: 1.6, maxWidth: 320 }}>
          Give MAVIX a command from the Dashboard or start the demo task to see live execution.
        </div>
      </div>
      <button onClick={onStart} style={primaryBtn}>▶ Run Demo Task</button>
    </div>
  )
}

const primaryBtn: React.CSSProperties = { padding: '9px 18px', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 0 20px rgba(124,58,237,0.3)' }
const warningBtn: React.CSSProperties = { padding: '9px 16px', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 10, color: '#f97316', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }
const dangerBtn: React.CSSProperties = { padding: '9px 16px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }
const ghostBtn: React.CSSProperties = { padding: '9px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#8b8ba7', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }

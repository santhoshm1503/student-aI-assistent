import { useState, useCallback } from 'react'
import { Phase, AppScreen, OrbState, UserData, ActiveTask, Message, MemoryItem, HistoryItem } from './types'
import { WindowChrome } from './components/WindowChrome'
import { Sidebar } from './components/Sidebar'
import { FloatingPopup } from './components/FloatingPopup'
import { SplashScreen } from './screens/SplashScreen'
import { OnboardingScreen } from './screens/OnboardingScreen'
import { DashboardScreen } from './screens/DashboardScreen'
import { ChatScreen } from './screens/ChatScreen'
import { TaskScreen } from './screens/TaskScreen'
import { HistoryScreen } from './screens/HistoryScreen'
import { MemoryScreen } from './screens/MemoryScreen'
import { QuickActionsScreen } from './screens/QuickActionsScreen'
import { SettingsScreen } from './screens/SettingsScreen'

const INITIAL_HISTORY: HistoryItem[] = [
  { id: 'h1', title: 'Summarized OS lecture PDF', status: 'success', tools: ['screen', 'files'], completedAt: new Date(Date.now() - 600000), duration: '8s' },
  { id: 'h2', title: 'Opened Chrome for OS scheduling search', status: 'success', tools: ['browser'], completedAt: new Date(Date.now() - 1200000), duration: '4s' },
  { id: 'h3', title: 'Created OS Notes folder', status: 'success', tools: ['files'], completedAt: new Date(Date.now() - 3600000), duration: '12s' },
]

export default function App() {
  const [phase, setPhase] = useState<Phase>('splash')
  const [appScreen, setAppScreen] = useState<AppScreen>('dashboard')
  const [userData, setUserData] = useState<UserData>({ name: '', email: '' })
  const [orbState, setOrbState] = useState<OrbState>('idle')
  const [showPopup, setShowPopup] = useState(false)
  const [activeTask, setActiveTask] = useState<ActiveTask | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [memory, setMemory] = useState<MemoryItem[]>([])
  const [history, setHistory] = useState<HistoryItem[]>(INITIAL_HISTORY)

  const handleSplashComplete = useCallback(() => setPhase('onboarding'), [])

  const handleOnboardingComplete = useCallback((user: UserData) => {
    setUserData(user)
    setPhase('app')
  }, [])

  const handleSendCommand = useCallback((text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setOrbState('thinking')

    // Determine action type
    const isFileTask = /folder|file|move|create|organize/i.test(text)
    const isBrowserTask = /chrome|browser|open|search|navigate/i.test(text)
    const isScreenTask = /screen|slide|page|summarize|explain/i.test(text)

    const task: ActiveTask = {
      title: text,
      status: 'running',
      steps: [
        { label: 'Understand request', status: 'running' },
        { label: 'Plan actions', status: 'pending' },
        { label: 'Execute', status: 'pending' },
        { label: 'Observe result', status: 'pending' },
        { label: 'Verify', status: 'pending' },
      ],
      activeTools: [isFileTask ? 'files' : isBrowserTask ? 'browser' : isScreenTask ? 'screen' : 'apps'],
      activityLog: ['Understanding request…'],
      toolActive: isFileTask ? 'files' : isBrowserTask ? 'browser' : isScreenTask ? 'screen' : 'apps',
    }
    setActiveTask(task)

    // Progress task through states
    setTimeout(() => {
      setOrbState('working')
      setActiveTask(prev => prev ? { ...prev, steps: [{ label: 'Understand request', status: 'done' }, { label: 'Plan actions', status: 'running' }, ...prev.steps.slice(2)], activityLog: [...(prev.activityLog), 'Planning actions…'] } : null)
    }, 1500)

    setTimeout(() => {
      setActiveTask(prev => prev ? { ...prev, steps: [{ label: 'Understand request', status: 'done' }, { label: 'Plan actions', status: 'done' }, { label: 'Execute', status: 'running' }, ...prev.steps.slice(3)], activityLog: [...(prev.activityLog || []), 'Executing…'] } : null)
    }, 3000)

    setTimeout(() => {
      setOrbState('success')
      const aiMsg: Message = {
        id: (Date.now() + 100).toString(),
        role: 'assistant',
        content: generateResponse(text),
        timestamp: new Date(),
        workflow: {
          understand: `Analyzed: "${text}"`,
          plan: ['Select capability', isFileTask ? 'Access file system' : isBrowserTask ? 'Control browser' : 'Analyze screen', 'Execute and verify'],
          result: 'Task completed successfully.',
        },
      }
      setMessages(prev => [...prev, aiMsg])
      setActiveTask(prev => prev ? { ...prev, status: 'completed', steps: prev.steps.map(s => ({ ...s, status: 'done' as const })), activityLog: [...(prev.activityLog || []), 'Verification complete ✓'] } : null)

      // Add to history
      const histItem: HistoryItem = {
        id: Date.now().toString(),
        title: text,
        status: 'success',
        tools: [isFileTask ? 'files' : isBrowserTask ? 'browser' : isScreenTask ? 'screen' : 'apps'],
        completedAt: new Date(),
        duration: '6s',
      }
      setHistory(prev => [histItem, ...prev])

      setTimeout(() => setOrbState('idle'), 3000)
    }, 5000)
  }, [])

  const handleOrbClick = useCallback(() => {
    if (orbState === 'listening') {
      setOrbState('idle')
      setShowPopup(false)
    } else {
      setShowPopup(true)
      setOrbState('listening')
    }
  }, [orbState])

  const handleNewTask = useCallback(() => {
    setAppScreen('dashboard')
    setTimeout(() => document.querySelector('input')?.focus(), 100)
  }, [])

  const handlePopupClose = useCallback(() => {
    setShowPopup(false)
    setOrbState('idle')
  }, [])

  const handleAddMemory = useCallback((content: string) => {
    setMemory(prev => [{ id: Date.now().toString(), content, createdAt: new Date() }, ...prev])
  }, [])

  const handleDeleteMemory = useCallback((id: string) => {
    setMemory(prev => prev.filter(m => m.id !== id))
  }, [])

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#08080f' }}>
      <WindowChrome />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Phase: Splash */}
        {phase === 'splash' && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}

        {/* Phase: Onboarding */}
        {phase === 'onboarding' && (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        )}

        {/* Phase: App */}
        {phase === 'app' && (
          <>
            <Sidebar
              active={appScreen}
              orbState={orbState}
              userName={userData.name}
              onNavigate={setAppScreen}
              onNewTask={handleNewTask}
            />

            <main style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
              {appScreen === 'dashboard' && (
                <DashboardScreen
                  userName={userData.name}
                  orbState={orbState}
                  activeTask={activeTask}
                  onOrbClick={handleOrbClick}
                  onSendCommand={handleSendCommand}
                  onNavigateChat={() => setAppScreen('chat')}
                  onNavigateTask={() => setAppScreen('task')}
                />
              )}
              {appScreen === 'chat' && (
                <ChatScreen
                  messages={messages}
                  orbState={orbState}
                  onSend={handleSendCommand}
                />
              )}
              {appScreen === 'task' && (
                <TaskScreen
                  task={activeTask}
                  orbState={orbState}
                  onOrbStateChange={setOrbState}
                  onTaskChange={setActiveTask}
                />
              )}
              {appScreen === 'history' && (
                <HistoryScreen history={history} />
              )}
              {appScreen === 'memory' && (
                <MemoryScreen
                  memory={memory}
                  onAdd={handleAddMemory}
                  onDelete={handleDeleteMemory}
                />
              )}
              {appScreen === 'quickactions' && (
                <QuickActionsScreen onExecuteAction={handleSendCommand} />
              )}
              {appScreen === 'settings' && (
                <SettingsScreen />
              )}
            </main>
          </>
        )}

        {/* Floating popup overlay */}
        {showPopup && (
          <FloatingPopup
            onClose={handlePopupClose}
            onComplete={(text) => {
              handleSendCommand(text)
              setAppScreen('chat')
            }}
          />
        )}
      </div>
    </div>
  )
}

function generateResponse(text: string): string {
  const t = text.toLowerCase()
  if (/chrome|browser/.test(t)) return "I've opened Chrome and completed your browser request. The browser is now active and ready. Would you like me to do anything else?"
  if (/folder|file|move|organize/.test(t)) return "I've completed the file operation successfully. Your files are now organized as requested. The folder has been created and all relevant files have been moved."
  if (/summarize|explain|screen|slide/.test(t)) return "Based on the content I captured from your screen, here's a summary:\n\nThe visible content covers key concepts in your current study material. The main topic is clearly structured and I can see multiple sub-topics that appear to be part of your coursework.\n\nWould you like me to explain any specific section in more detail?"
  if (/search|find/.test(t)) return "I've searched for the requested content. The results are now visible. I can help you filter or navigate through them if needed."
  return `I've processed your request: "${text}" and completed the action. Everything looks good on my end. Is there anything else you'd like me to help with?`
}

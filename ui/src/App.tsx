import { useState, useCallback } from 'react'
import {
  Phase,
  AppScreen,
  OrbState,
  UserData,
  ActiveTask,
  Message,
  MemoryItem,
  HistoryItem
} from './types'

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
  {
    id: 'h1',
    title: 'Summarized OS lecture PDF',
    status: 'success',
    tools: ['screen', 'files'],
    completedAt: new Date(Date.now() - 600000),
    duration: '8s'
  },
  {
    id: 'h2',
    title: 'Opened Chrome for OS scheduling search',
    status: 'success',
    tools: ['browser'],
    completedAt: new Date(Date.now() - 1200000),
    duration: '4s'
  },
  {
    id: 'h3',
    title: 'Created OS Notes folder',
    status: 'success',
    tools: ['files'],
    completedAt: new Date(Date.now() - 3600000),
    duration: '12s'
  },
]

export default function App() {
  const [phase, setPhase] = useState<Phase>('splash')
  const [appScreen, setAppScreen] = useState<AppScreen>('dashboard')
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: ''
  })

  const [orbState, setOrbState] = useState<OrbState>('idle')
  const [showPopup, setShowPopup] = useState(false)
  const [activeTask, setActiveTask] = useState<ActiveTask | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [memory, setMemory] = useState<MemoryItem[]>([])
  const [history, setHistory] = useState<HistoryItem[]>(INITIAL_HISTORY)

  const handleSplashComplete = useCallback(
    () => setPhase('onboarding'),
    []
  )

  const handleOnboardingComplete = useCallback((user: UserData) => {
    setUserData(user)
    setPhase('app')
  }, [])

  // REAL BACKEND CONNECTION
  const handleSendCommand = useCallback(async (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setOrbState('thinking')

    const isFileTask = /folder|file|move|create|organize/i.test(text)
    const isBrowserTask = /chrome|browser|open|search|navigate/i.test(text)
    const isScreenTask = /screen|slide|page|summarize|explain|pdf/i.test(text)

    const tool =
      isFileTask
        ? 'files'
        : isBrowserTask
          ? 'browser'
          : isScreenTask
            ? 'screen'
            : 'apps'

    const task: ActiveTask = {
      title: text,
      status: 'running',

      steps: [
        {
          label: 'Understand request',
          status: 'running'
        },
        {
          label: 'Plan actions',
          status: 'pending'
        },
        {
          label: 'Execute',
          status: 'pending'
        },
        {
          label: 'Observe result',
          status: 'pending'
        },
        {
          label: 'Verify',
          status: 'pending'
        },
      ],

      activeTools: [tool],

      activityLog: [
        'Understanding request…'
      ],

      toolActive: tool,
    }

    setActiveTask(task)

    try {
      // Call Python FastAPI backend
      const response = await fetch(
        'http://127.0.0.1:8000/command',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            message: text
          }),
        }
      )

      if (!response.ok) {
        throw new Error(
          `Backend error: ${response.status}`
        )
      }

      const data = await response.json()

      // Update task workflow
      setOrbState('working')

      setActiveTask(prev =>
        prev
          ? {
              ...prev,

              steps: [
                {
                  label: 'Understand request',
                  status: 'done'
                },
                {
                  label: 'Plan actions',
                  status: 'done'
                },
                {
                  label: 'Execute',
                  status: 'running'
                },
                {
                  label: 'Observe result',
                  status: 'pending'
                },
                {
                  label: 'Verify',
                  status: 'pending'
                },
              ],

              activityLog: [
                ...(prev.activityLog || []),
                'Planning actions…',
                `Using ${data.capability || tool}…`
              ],
            }
          : null
      )

      // Small delay for UI animation
      await new Promise(resolve =>
        setTimeout(resolve, 500)
      )

      const aiMsg: Message = {
        id: (Date.now() + 100).toString(),
        role: 'assistant',

        content:
          data.reply ||
          'MAVIX completed the request.',

        timestamp: new Date(),

        workflow: {
          understand: `Analyzed: "${text}"`,

          plan: [
            'Select capability',
            `Use ${data.capability || tool}`,
            'Execute and verify'
          ],

          result:
            data.reply ||
            'Task completed successfully.'
        },
      }

      setMessages(prev => [
        ...prev,
        aiMsg
      ])

      setOrbState('success')

      setActiveTask(prev =>
        prev
          ? {
              ...prev,

              status: 'completed',

              steps: [
                {
                  label: 'Understand request',
                  status: 'done'
                },
                {
                  label: 'Plan actions',
                  status: 'done'
                },
                {
                  label: 'Execute',
                  status: 'done'
                },
                {
                  label: 'Observe result',
                  status: 'done'
                },
                {
                  label: 'Verify',
                  status: 'done'
                },
              ],

              activityLog: [
                ...(prev.activityLog || []),
                'Execution complete ✓',
                'Verification complete ✓'
              ],
            }
          : null
      )

      // Add task to history
      const histItem: HistoryItem = {
        id: Date.now().toString(),

        title: text,

        status: 'success',

        tools: [tool],

        completedAt: new Date(),

        duration: '6s',
      }

      setHistory(prev => [
        histItem,
        ...prev
      ])

      setTimeout(() => {
        setOrbState('idle')
      }, 3000)

    } catch (error) {
      console.error(
        'MAVIX backend error:',
        error
      )

      setOrbState('error')

      const errorMsg: Message = {
        id: (Date.now() + 200).toString(),

        role: 'assistant',

        content:
          'Sorry, I could not connect to the MAVIX AI backend. Please make sure the FastAPI server is running.',

        timestamp: new Date(),
      }

      setMessages(prev => [
        ...prev,
        errorMsg
      ])

      setActiveTask(prev =>
        prev
          ? {
              ...prev,

              status: 'failed',

              activityLog: [
                ...(prev.activityLog || []),
                'Backend connection failed.'
              ],
            }
          : null
      )
    }

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

    setTimeout(
      () =>
        document
          .querySelector('input')
          ?.focus(),
      100
    )
  }, [])

  const handlePopupClose = useCallback(() => {
    setShowPopup(false)
    setOrbState('idle')
  }, [])

  const handleAddMemory = useCallback(
    (content: string) => {
      setMemory(prev => [
        {
          id: Date.now().toString(),
          content,
          createdAt: new Date()
        },
        ...prev
      ])
    },
    []
  )

  const handleDeleteMemory = useCallback(
    (id: string) => {
      setMemory(prev =>
        prev.filter(
          m => m.id !== id
        )
      )
    },
    []
  )

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#08080f'
      }}
    >

      <WindowChrome />

      <div
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          position: 'relative'
        }}
      >

        {phase === 'splash' && (
          <SplashScreen
            onComplete={
              handleSplashComplete
            }
          />
        )}

        {phase === 'onboarding' && (
          <OnboardingScreen
            onComplete={
              handleOnboardingComplete
            }
          />
        )}

        {phase === 'app' && (
          <>
            <Sidebar
              active={appScreen}
              orbState={orbState}
              userName={userData.name}
              onNavigate={setAppScreen}
              onNewTask={handleNewTask}
            />

            <main
              style={{
                flex: 1,
                display: 'flex',
                overflow: 'hidden',
                position: 'relative'
              }}
            >

              {appScreen === 'dashboard' && (
                <DashboardScreen
                  userName={userData.name}
                  orbState={orbState}
                  activeTask={activeTask}
                  onOrbClick={handleOrbClick}
                  onSendCommand={
                    handleSendCommand
                  }
                  onNavigateChat={() =>
                    setAppScreen('chat')
                  }
                  onNavigateTask={() =>
                    setAppScreen('task')
                  }
                />
              )}

              {appScreen === 'chat' && (
                <ChatScreen
                  messages={messages}
                  orbState={orbState}
                  onSend={
                    handleSendCommand
                  }
                />
              )}

              {appScreen === 'task' && (
                <TaskScreen
                  task={activeTask}
                  orbState={orbState}
                  onOrbStateChange={
                    setOrbState
                  }
                  onTaskChange={
                    setActiveTask
                  }
                />
              )}

              {appScreen === 'history' && (
                <HistoryScreen
                  history={history}
                />
              )}

              {appScreen === 'memory' && (
                <MemoryScreen
                  memory={memory}
                  onAdd={handleAddMemory}
                  onDelete={
                    handleDeleteMemory
                  }
                />
              )}

              {appScreen === 'quickactions' && (
                <QuickActionsScreen
                  onExecuteAction={
                    handleSendCommand
                  }
                />
              )}

              {appScreen === 'settings' && (
                <SettingsScreen />
              )}

            </main>
          </>
        )}

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
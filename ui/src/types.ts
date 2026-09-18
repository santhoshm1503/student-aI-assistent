export type Phase = 'splash' | 'onboarding' | 'app'
export type AppScreen = 'dashboard' | 'chat' | 'task' | 'history' | 'memory' | 'quickactions' | 'settings'
export type OrbState = 'idle' | 'listening' | 'thinking' | 'working' | 'confirming' | 'success' | 'error'
export type StepStatus = 'pending' | 'running' | 'done' | 'error'
export type TaskStatus = 'idle' | 'running' | 'paused' | 'completed' | 'error' | 'confirming'

export interface UserData {
  name: string
  email: string
}

export interface TaskStep {
  label: string
  status: StepStatus
}

export interface ActiveTask {
  title: string
  status: TaskStatus
  steps: TaskStep[]
  activeTools: string[]
  activityLog: string[]
  toolActive: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  workflow?: { understand: string; plan: string[]; result: string }
  isTyping?: boolean
}

export interface MemoryItem {
  id: string
  content: string
  createdAt: Date
}

export interface HistoryItem {
  id: string
  title: string
  status: 'success' | 'error'
  tools: string[]
  completedAt: Date
  duration: string
}

export interface AppState {
  phase: Phase
  appScreen: AppScreen
  userData: UserData
  orbState: OrbState
  showPopup: boolean
  activeTask: ActiveTask | null
  messages: Message[]
  memory: MemoryItem[]
  history: HistoryItem[]
}

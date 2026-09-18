import { useState } from 'react'

interface ToggleSetting {
  id: string
  label: string
  description: string
  value: boolean
}

interface SelectSetting {
  id: string
  label: string
  description: string
  options: string[]
  value: string
}

type SettingCategory = 'general' | 'voice' | 'wake' | 'background' | 'permissions' | 'privacy' | 'memory' | 'notifications' | 'appearance'

const CATEGORIES: Array<{ id: SettingCategory; label: string; icon: string }> = [
  { id: 'general', label: 'General', icon: '⚙️' },
  { id: 'voice', label: 'Voice', icon: '🎙' },
  { id: 'wake', label: 'Wake Word', icon: '👂' },
  { id: 'background', label: 'Background Mode', icon: '🔄' },
  { id: 'permissions', label: 'Permissions', icon: '🔑' },
  { id: 'privacy', label: 'Privacy & Data', icon: '🔒' },
  { id: 'memory', label: 'Memory', icon: '💡' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'appearance', label: 'Appearance', icon: '🎨' },
]

const SETTINGS_MAP: Record<SettingCategory, Array<ToggleSetting | (SelectSetting & { type: 'select' })>> = {
  general: [
    { id: 'autostart', label: 'Auto-start with Windows', description: 'Launch MAVIX AI when Windows starts up', value: true },
    { id: 'autocorrect', label: 'Smart Auto-Correct', description: 'Automatically suggest corrections for spelling mistakes in your commands', value: true },
    { id: 'taskbar', label: 'Show in taskbar', description: 'Display MAVIX icon in the Windows taskbar', value: true },
  ],
  voice: [
    { id: 'voice_response', label: 'Voice responses', description: 'MAVIX reads responses aloud using text-to-speech', value: false },
    { id: 'voice_speed', label: 'Speech rate', description: 'Adjust how quickly MAVIX speaks', type: 'select', options: ['Slow', 'Normal', 'Fast'], value: 'Normal' } as SelectSetting & { type: 'select' },
    { id: 'noise', label: 'Background noise reduction', description: 'Filter ambient noise during voice input', value: true },
  ],
  wake: [
    { id: 'wake_word', label: 'Wake word ("Hey MAVIX")', description: 'Listen for "Hey MAVIX" to open the floating popup', value: true },
    { id: 'wake_tone', label: 'Play activation tone', description: 'Brief audio cue when wake word is detected', value: false },
  ],
  background: [
    { id: 'bg_mode', label: 'Background mode', description: 'Run MAVIX quietly in the background when not in use', value: true },
    { id: 'bg_floating', label: 'Floating popup mode', description: 'Show compact popup over current app instead of switching windows', value: true },
  ],
  permissions: [
    { id: 'perm_mic', label: 'Microphone access', description: 'Allow MAVIX to receive voice input', value: true },
    { id: 'perm_screen', label: 'Screen context capture', description: 'Allow MAVIX to analyze visible screen content on request', value: true },
    { id: 'perm_files', label: 'File access', description: 'Allow MAVIX to read and organize files in your workspace', value: true },
    { id: 'perm_browser', label: 'Browser automation', description: 'Allow MAVIX to control the browser on your behalf', value: true },
  ],
  privacy: [
    { id: 'local_only', label: 'Local processing only', description: 'Process screen and file data on-device, never uploaded', value: true },
    { id: 'history_save', label: 'Save task history', description: 'Keep a log of completed tasks', value: true },
    { id: 'analytics', label: 'Usage analytics', description: 'Share anonymous usage data to improve MAVIX', value: false },
  ],
  memory: [
    { id: 'memory_enabled', label: 'Enable Memory', description: 'Allow MAVIX to remember context across sessions', value: true },
    { id: 'memory_auto', label: 'Auto-save important info', description: 'MAVIX proactively saves key context it detects', value: false },
  ],
  notifications: [
    { id: 'notif_complete', label: 'Task completion notifications', description: 'Notify when a background task finishes', value: true },
    { id: 'notif_error', label: 'Error notifications', description: 'Alert on task failures', value: true },
    { id: 'notif_tips', label: 'Tips & suggestions', description: 'Occasional tips to use MAVIX more effectively', value: false },
  ],
  appearance: [
    { id: 'theme', label: 'Theme', description: 'Color theme for the MAVIX interface', type: 'select', options: ['Dark (default)', 'Dark Blue', 'AMOLED Black'], value: 'Dark (default)' } as SelectSetting & { type: 'select' },
    { id: 'animations', label: 'Enable animations', description: 'Orb animations and UI transitions', value: true },
    { id: 'compact', label: 'Compact mode', description: 'Reduce spacing for a denser layout', value: false },
  ],
}

export function SettingsScreen() {
  const [activeCategory, setActiveCategory] = useState<SettingCategory>('general')
  const [settings, setSettings] = useState(SETTINGS_MAP)

  const toggleSetting = (category: SettingCategory, id: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: prev[category].map(s => s.id === id && !('type' in s) ? { ...s, value: !s.value } : s),
    }))
  }

  const currentSettings = settings[activeCategory]

  return (
    <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Category sidebar */}
      <div style={{
        width: 200, flexShrink: 0,
        padding: '24px 12px',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        overflow: 'auto',
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#3a3a5c', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12, padding: '0 8px' }}>
          Settings
        </div>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 12px', borderRadius: 8, border: 'none',
              background: activeCategory === cat.id ? 'rgba(124,58,237,0.15)' : 'transparent',
              color: activeCategory === cat.id ? '#a855f7' : '#8b8ba7',
              fontSize: 13, fontWeight: activeCategory === cat.id ? 600 : 400,
              cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
              marginBottom: 2, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (activeCategory !== cat.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#eeeef5' } }}
            onMouseLeave={e => { if (activeCategory !== cat.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8b8ba7' } }}
          >
            <span style={{ fontSize: 14 }}>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Settings content */}
      <div style={{ flex: 1, padding: '24px 32px', overflow: 'auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div className="font-display" style={{ fontSize: 20, fontWeight: 700, color: '#eeeef5', marginBottom: 4 }}>
            {CATEGORIES.find(c => c.id === activeCategory)?.label}
          </div>
          <div style={{ fontSize: 13, color: '#5c5c7a' }}>
            Configure {CATEGORIES.find(c => c.id === activeCategory)?.label.toLowerCase()} preferences.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {currentSettings.map((setting, i) => (
            <div key={setting.id} style={{
              padding: '16px 20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14,
              display: 'flex', alignItems: 'center', gap: 16,
              animation: `fade-in 0.3s ease-out ${i * 0.05}s both`,
              transition: 'all 0.15s',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#eeeef5', marginBottom: 3 }}>{setting.label}</div>
                <div style={{ fontSize: 12, color: '#5c5c7a', lineHeight: 1.5 }}>{setting.description}</div>
              </div>

              {'type' in setting && setting.type === 'select' ? (
                <select
                  value={(setting as SelectSetting).value}
                  style={{
                    padding: '6px 10px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 8, color: '#eeeef5',
                    fontSize: 13, cursor: 'pointer',
                    fontFamily: 'inherit', outline: 'none',
                  }}
                >
                  {(setting as SelectSetting).options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <Toggle
                  on={(setting as ToggleSetting).value}
                  onChange={() => toggleSetting(activeCategory, setting.id)}
                />
              )}
            </div>
          ))}
        </div>

        {/* MAVIX version info */}
        <div style={{ marginTop: 32, padding: '14px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', fontSize: 12, color: '#3a3a5c' }}>
          MAVIX AI · Version 1.0.0-beta · Built for Windows · Hackathon Edition
        </div>
      </div>
    </div>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 44, height: 24, borderRadius: 12, flexShrink: 0,
        background: on ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'rgba(255,255,255,0.1)',
        border: 'none', cursor: 'pointer', padding: 0,
        position: 'relative', transition: 'background 0.25s',
        boxShadow: on ? '0 0 12px rgba(124,58,237,0.4)' : 'none',
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 3,
        left: on ? 23 : 3,
        transition: 'left 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }} />
    </button>
  )
}

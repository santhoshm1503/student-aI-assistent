Design a premium, futuristic Windows desktop AI assistant application called:

MAVIX AI

Tagline:
“From Intent to Action”

PROJECT CONCEPT:
MAVIX AI is a context-aware desktop AI assistant designed for students. It combines voice, text, screen context, AI reasoning, browser automation, file operations, application control, memory, verification and safety into ONE integrated assistant.

The application should feel like one intelligent assistant rather than a collection of separate utilities.

IMPORTANT:
This is a real hackathon prototype. The UI should look technically impressive, professional and realistic, but still usable and achievable.

Do NOT make it look like:
- A generic chatbot
- A mobile app
- A gaming dashboard
- An excessive sci-fi interface
- A collection of unrelated utilities

DESIGN STYLE:

- Premium futuristic desktop software
- Dark modern interface
- Black / deep charcoal background
- Electric violet as the PRIMARY MAVIX brand/AI accent
- Cyan and electric blue used SPARINGLY as secondary interaction accents
- Orange used for warnings and confirmation-required states
- Green used for successful completion
- Red used for errors
- White/light grey for readable text
- Glassmorphism used carefully
- Soft glow effects
- Rounded cards
- Clean modern typography
- Excellent spacing
- Professional enterprise-AI appearance
- Minimal but visually impressive
- Smooth micro-interactions
- High-quality consistent icons
- Strong visual hierarchy
- Responsive desktop layout
- Designed primarily for Windows laptop/PC

Do not overuse gradients, glow or glass effects. Maintain a professional balance between futuristic visuals and usability.

BRANDING / LOGO:

Create a distinctive MAVIX AI visual identity.

The MAVIX logo should be based around:
- An intelligent glowing orb
- An abstract M-shaped neural/AI form
- A visual concept combining intelligence + technology + action

Avoid generic robot logos.

The MAVIX Orb should become the recognizable visual identity throughout the application.

CREATE THESE SCREENS AND STATES:

1. CINEMATIC MAVIX SPLASH SCREEN

When the application opens:

- MAVIX AI logo/orb appears first
- Elegant animated glow around the orb
- Orb smoothly forms/activates
- “MAVIX AI” text fades/slides in
- Tagline: “From Intent to Action”
- Subtitle:
  “Your context-aware desktop AI assistant”
- Premium futuristic animation
- Smooth transition into the application

The animation should feel polished and professional rather than flashy.

2. FIRST-TIME SETUP / ONBOARDING

Create a clean onboarding flow.

Include:

- Welcome to MAVIX AI
- Name
- Sign in
- Create account
- Microphone permission
- Screen-context permission
- File access permission
- Browser/application permission
- Privacy and consent
- Clear Allow / Deny controls

The user's name entered during onboarding/sign-in must be treated as DYNAMIC USER DATA.

Never hardcode a specific person's name.

For example:

“Good evening, [User Name]”

If the user enters Mohamed:
“Good evening, Mohamed”

If another user enters Santhosh:
“Good evening, Santhosh”

3. MAIN MAVIX DASHBOARD

This is the primary application screen.

LEFT SIDEBAR:

- MAVIX AI logo
- New Task
- Chat / Conversations
- Task History
- Memory
- Quick Actions
- Settings
- Profile

MAIN AREA:

Top:

“Good evening, [User Name]”

Small subtitle:

“What would you like me to do?”

IMPORTANT:
[User Name] must dynamically use the name entered during sign-in/onboarding.

Large central command area:

“Ask MAVIX anything…”

Include:

- Text input
- Microphone button
- Send button
- Attach PDF/PPT button
- Screen Context button

The text input should support optional Smart Auto-Correct.

If Smart Auto-Correct is enabled, spelling mistakes can be corrected or suggested automatically.

Example:

“operatng system”
→ “operating system”

Allow the user to:
- Accept correction
- Ignore correction
- Turn Smart Auto-Correct OFF

Suggested command chips:

- Summarize this screen
- Explain this slide
- Open Chrome
- Find my OS PDF
- Create a folder

RIGHT SIDE:

Create a “Current Task” panel.

Show:

Task:
“Organize my OS study files”

Status:
Working

Progress workflow:

✓ Understand
✓ Plan
→ Execute
○ Observe
○ Verify

The progress should update dynamically as MAVIX performs the task.

Tool indicators:

- Browser
- Files
- Applications
- Screen

Only highlight the tool currently being used.

For example, while organizing files:

Files ● Active
Browser ○
Applications ○
Screen ○

Include a small live AI activity log such as:

“Understanding request…”
“Planning actions…”
“Using Files tool…”
“Verifying result…”

This allows a reviewer to clearly understand what MAVIX is doing.

4. MAVIX ORB / AI STATUS

Create a beautiful animated MAVIX Orb.

The Orb represents the presence and state of MAVIX.

Create separate visual states:

IDLE:
- MAVIX is waiting for the user
- Slow gentle violet glow
- Text: “Ready when you are”

LISTENING:
- Active pulsing animation
- Cyan/violet interaction glow
- Microphone indicator
- Text: “Listening…”

THINKING:
- Different animation from Idle
- Faster pulse / subtle rotation
- Represents AI understanding and planning
- Text: “Thinking…”

WORKING:
- Active animated glow
- Represents task execution
- Text: “Working…”

WAITING FOR CONFIRMATION:
- Orange accent
- Clear confirmation indicator
- Text: “Confirmation required”

SUCCESS:
- Green success animation
- Text: “Task completed”

ERROR:
- Red warning animation
- Text: “Something went wrong”

5. FLOATING ASSISTANT POPUP

Very important.

MAVIX should run quietly in the Windows background.

When the user says:

“Hey MAVIX”

a compact floating popup appears above the current application without covering the whole screen.

The popup is a MODE/WINDOW of the SAME MAVIX application, not a separate application.

Popup contains:

- MAVIX Orb
- Listening indicator
- Microphone icon
- Live speech-to-text transcription
- Minimize/close controls

While the user speaks, display their recognized speech live.

Example:

Listening…

“Open Chrome and search operating system scheduling…”

Then transition smoothly:

Listening
↓
Thinking
↓
Working
↓
Observing
↓
Verifying
↓
Done

Show compact progress information inside the popup.

The popup should be small, elegant and unobtrusive, similar to a modern desktop assistant.

6. SCREEN-CONTEXT EXPERIENCE

Design a state where the student is reading:

- PDF
- PowerPoint
- Browser
- VS Code

The user says:

“What is the main topic on this page?”

MAVIX should:

- Show Listening
- Display live transcription
- Capture screen context
- Show a small screen preview
- Show “Analyzing screen…”
- Process the visible content
- Provide an answer
- Show voice response/playback state

Important:

Screen capture should happen only when the user requests screen-context understanding.

Do not design continuous full-screen monitoring.

7. CHAT / CONVERSATION SCREEN

Create a ChatGPT-style interface but with a distinctive MAVIX identity.

Include:

- User messages
- MAVIX responses
- Voice playback button
- Copy
- Regenerate
- Conversation history
- Attach PDF/PPT
- Screen Context
- Task execution cards

MAVIX responses should be able to visually show:

Understanding
Plan
Actions
Verification
Result

Make it clear that MAVIX can both answer questions AND perform actions.

8. TASK EXECUTION SCREEN

Show MAVIX performing a multi-step task.

Example:

“Create OS Notes folder and move my OS PDF into it.”

Show:

✓ Understand request
✓ Find OS PDF
✓ Create OS Notes
→ Move PDF
○ Verify

Show:

- Current action
- Tool being used
- Live activity
- Progress
- Pause button
- Stop/Cancel button

The user must remain in control while MAVIX is working.

9. ERROR RECOVERY STATE

If an action fails, show:

“Something went wrong”

“I couldn't complete this step.”

Buttons:

[ Retry ]
[ Cancel ]

The error state should be calm and professional, not alarming.

10. CONFIRMATION / SAFETY STATE

For sensitive, destructive or irreversible actions:

Show:

“Confirmation required”

Example:

“Delete this file permanently?”

Buttons:

[ Confirm ]
[ Cancel ]

Use ORANGE as the visual warning/confirmation accent.

Make human control extremely clear.

11. TASK HISTORY

Create a clean history page.

Example:

Today

- Summarized OS lecture PDF ✓
- Opened Chrome ✓
- Created OS Notes folder ✓
- VTOP navigation ✓

Show:

- Time
- Task
- Status
- Tools used

Use clear success/error indicators.

12. MEMORY

Create a simple memory screen.

Example:

Saved memory:

“Need to revise CPU scheduling.”

Allow:

- View memory
- Add memory
- Delete memory

Keep the interface simple and privacy-conscious.

13. QUICK ACTIONS

Create a visually attractive Quick Actions panel.

Show these 5 DEFAULT actions:

⚡ Open Chrome
⚡ Open VS Code
⚡ Summarize Screen
⚡ Find Files
⚡ Create Folder

Use professional icons rather than relying on emojis in the final UI.

Design the Quick Actions panel so that users can later:

- Add actions
- Remove actions
- Reorder actions
- Customize shortcuts

The hackathon MVP should use the 5 default actions above.

14. SETTINGS

Create settings categories:

General
Voice
Wake Word
Background Mode
Permissions
Privacy & Data
Memory
Notifications
Appearance

Include controls such as:

Wake Word: ON/OFF
Auto-start: ON/OFF
Screen Context: ON/OFF
Microphone: ON/OFF
Smart Auto-Correct: ON/OFF

Make settings easy to understand.

15. AUTO-CORRECTION UI

Include an optional Smart Auto-Correct setting.

When enabled:

If the user types a spelling mistake, MAVIX can identify the likely intended word.

Example:

“operatng system”

→

“operating system”

Give the user control to:

- Accept
- Ignore
- Turn Auto-Correct OFF

Keep this feature subtle and do not let it dominate the interface.

16. SUCCESS STATE

After completing a task:

Show:

- Large MAVIX Orb
- Green success animation
- ✓ Task completed

Example:

“Your OS Notes folder is ready.”

Show:

- Completed actions
- Verification result
- Done button

17. PAUSE / CANCEL STATE

While MAVIX is executing a task:

Show:

[ Pause ]
[ Stop ]

If paused:

“Task paused”

Buttons:

[ Resume ]
[ Cancel ]

Make it clear that the user can interrupt MAVIX at any time.

18. AI ACTIVITY / TRANSPARENCY

Throughout task execution, provide a compact activity area showing what MAVIX is currently doing.

Examples:

“Understanding request…”
“Selecting Files capability…”
“Finding OS PDF…”
“Creating folder…”
“Verifying folder exists…”

Do not expose technical code or internal model details.

The purpose is to make the AI's actions understandable to the user and reviewer.

19. PRIVACY / SECURITY VISUALS

Create clear visual indicators for:

- Microphone active/inactive
- Screen-context capture
- File access
- Browser access

The interface should make it obvious when MAVIX is listening or accessing screen context.

Do not claim that passwords are stored in plain text.

Do not claim “fully encrypted” unless implemented.

Do not design password/OTP storage.

VTOP authentication should remain under user control.

OVERALL MAVIX WORKFLOW:

The complete UI must communicate this workflow:

Student
↓
Request
↓
Understand
↓
Select Capability
↓
Execute
↓
Observe
↓
Verify
↓
Complete / Retry

Example:

User:
“Open Chrome and search operating system scheduling.”

MAVIX:

Listening
↓
Thinking
↓
Understanding
↓
Planning
↓
Browser execution
↓
Observe
↓
Verify
↓
Success

IMPORTANT DEMO FLOW:

The UI must visually support this 2–3 minute hackathon demonstration:

1. Student is viewing a PDF/PPT.
2. Student says “Hey MAVIX”.
3. Floating popup appears.
4. Live speech transcription appears.
5. MAVIX captures screen context.
6. AI explains the content.
7. Student asks a follow-up question.
8. MAVIX maintains conversation context.
9. Student asks MAVIX to open Chrome and perform a study-related search.
10. MAVIX performs the browser action.
11. Student asks MAVIX to create/organize a study folder.
12. MAVIX performs the file operation.
13. MAVIX verifies the result.
14. Demonstrate controlled VTOP navigation.
15. Demonstrate saved memory and task history.

FINAL UX PRINCIPLE:

MAVIX must feel like ONE intelligent desktop assistant.

It should feel like:

“Talk to your computer, let it understand your context, and turn your intent into action.”

PRIORITIZE:

1. Strong first impression
2. Distinctive MAVIX logo and Orb
3. Beautiful splash animation
4. Clean professional dashboard
5. Floating assistant experience
6. Live voice transcription
7. AI task execution visualization
8. Screen-context experience
9. Verification and error recovery
10. Human control and safety
11. Task history and memory
12. Consistent visual language

DO NOT DESIGN:

- Phone control
- Smart-home control
- Unrestricted autonomous computer control
- Custom-trained LLM
- Large multi-agent architecture
- Continuous full-screen video understanding
- Dozens of integrations
- Complex vector-memory system

FINAL VISUAL GOAL:

When a hackathon reviewer sees MAVIX AI, they should immediately understand:

“This is a serious context-aware desktop AI assistant that understands user intent and turns it into action.”

Create a complete and consistent desktop design system with:

- Reusable components
- Consistent spacing
- Typography
- Buttons
- Cards
- Icons
- Animations
- State variations
- Hover states
- Active states
- Listening states
- Thinking states
- Working states
- Success states
- Error states
- Confirmation states

Make the design visually impressive enough for a hackathon presentation while remaining realistic for a working Windows prototype.
import os
import json
import sqlite3

from dotenv import load_dotenv
from google import genai

from . import tools


# ==========================================
# GEMINI SETUP
# ==========================================

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

MODEL = "gemini-3.5-flash-lite"


# ==========================================
# DATABASE
# ==========================================

DB_PATH = os.path.join(
    os.path.dirname(__file__),
    "memory.db"
)


def init_database():
    connection = sqlite3.connect(DB_PATH)

    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS memories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            note TEXT NOT NULL
        )
    """)

    connection.commit()
    connection.close()


init_database()


# ==========================================
# AI SYSTEM PROMPT
# ==========================================

SYSTEM_PROMPT = """
You are MAVIX AI, a fast desktop AI assistant for students.

Understand natural-language requests and choose exactly ONE capability.

Available capabilities:

general_answer
screen_context
browser_search
file_operation
vtop_action
save_memory
recall_memory

Return ONLY valid JSON.

Format:

{
  "capability": "...",
  "params": {},
  "reply": ""
}

For file_operation, available actions are:

create_folder
create_file
open_app
open_file
move_file
copy
rename
delete
find
list
merge

Examples:

User: What is CPU scheduling?

{
  "capability": "general_answer",
  "params": {},
  "reply": "CPU scheduling is..."
}

User: Create a folder called OS Notes

{
  "capability": "file_operation",
  "params": {
    "action": "create_folder",
    "folder_name": "OS Notes",
    "location": "home"
  },
  "reply": ""
}

User: Create a folder called Hackathon on my desktop

{
  "capability": "file_operation",
  "params": {
    "action": "create_folder",
    "folder_name": "Hackathon",
    "location": "desktop"
  },
  "reply": ""
}

User: Open Chrome

{
  "capability": "file_operation",
  "params": {
    "action": "open_app",
    "name": "chrome"
  },
  "reply": ""
}

User: Open calculator

{
  "capability": "file_operation",
  "params": {
    "action": "open_app",
    "name": "calculator"
  },
  "reply": ""
}

User: Open my presentation

{
  "capability": "file_operation",
  "params": {
    "action": "open_file",
    "path": "presentation"
  },
  "reply": ""
}

User: Search operating system scheduling

{
  "capability": "browser_search",
  "params": {
    "query": "operating system scheduling"
  },
  "reply": ""
}

User: Explain what is on my screen

{
  "capability": "screen_context",
  "params": {},
  "reply": ""
}

User: Remember that I need to revise CPU scheduling

{
  "capability": "save_memory",
  "params": {
    "note": "revise CPU scheduling"
  },
  "reply": ""
}

User: What did I ask you to remember?

{
  "capability": "recall_memory",
  "params": {},
  "reply": ""
}

Rules:

- Understand natural language.
- Do not require exact command wording.
- Keep replies concise.
- Never return markdown.
- Return valid JSON only.
"""


# ==========================================
# CAPABILITY DECISION
# ONE GEMINI CALL ONLY
# ==========================================

def decide_capability(user_message):

    try:

        response = client.models.generate_content(
            model=MODEL,
            contents=SYSTEM_PROMPT + "\n\nUser: " + user_message,
            config={
                "temperature": 0.2,
                "max_output_tokens": 300
            }
        )

        raw = response.text.strip()

        # Remove markdown code fences
        if raw.startswith("```"):
            raw = raw.replace("```json", "")
            raw = raw.replace("```", "")
            raw = raw.strip()

        return json.loads(raw)

    except Exception as error:

        return {
            "capability": "general_answer",
            "params": {},
            "reply": f"Sorry, I couldn't process that request: {error}"
        }


# ==========================================
# MEMORY
# ==========================================

def save_memory(params):

    note = params.get("note", "").strip()

    if not note:
        return "I need something to remember."

    connection = sqlite3.connect(DB_PATH)

    cursor = connection.cursor()

    cursor.execute(
        "INSERT INTO memories (note) VALUES (?)",
        (note,)
    )

    connection.commit()
    connection.close()

    return f"Got it. I'll remember: {note}"


def recall_memory(params):

    connection = sqlite3.connect(DB_PATH)

    cursor = connection.cursor()

    cursor.execute(
        "SELECT note FROM memories ORDER BY id DESC"
    )

    rows = cursor.fetchall()

    connection.close()

    if not rows:
        return "You haven't asked me to remember anything yet."

    notes = [row[0] for row in rows]

    return "I remember: " + "; ".join(notes)


# ==========================================
# CAPABILITY MAP
# ==========================================

CAPABILITY_MAP = {

    "screen_context":
        tools.screen_context,

    "browser_search":
        tools.browser_search,

    "file_operation":
        tools.file_operation,

    "vtop_action":
        tools.vtop_action,

    "save_memory":
        save_memory,

    "recall_memory":
        recall_memory,
}


# ==========================================
# MAIN REQUEST HANDLER
# ==========================================

def handle_request(user_message):

    status = [
        "Understanding request..."
    ]

    # ONE Gemini request
    decision = decide_capability(user_message)

    status.append("Planning actions...")

    capability = decision.get(
        "capability",
        "general_answer"
    )

    params = decision.get(
        "params",
        {}
    )

    reply = decision.get(
        "reply",
        ""
    )

    # ======================================
    # GENERAL QUESTION
    # ======================================

    if capability == "general_answer":

        status.append("Generating answer...")
        status.append("Task completed")

        return {
            "reply": reply,
            "capability": "general_answer",
            "status": status
        }

    # ======================================
    # TOOL CAPABILITY
    # ======================================

    func = CAPABILITY_MAP.get(capability)

    if func:

        status.append(
            f"Using {capability}..."
        )

        try:

            result = func(params)

            status.append("Observing result...")
            status.append("Verifying result...")
            status.append("Task completed")

            return {
                "reply": result,
                "capability": capability,
                "status": status
            }

        except Exception as error:

            status.append("Task failed")

            return {
                "reply": f"Task failed: {error}",
                "capability": capability,
                "status": status
            }

    # ======================================
    # UNKNOWN CAPABILITY
    # ======================================

    return {

        "reply":
            f"Capability '{capability}' is not connected yet.",

        "capability":
            capability,

        "status": [
            "Understanding request...",
            "Capability not connected"
        ]
    }


# ==========================================
# API ENTRY POINT
# ==========================================

def process_user_message(user_message):

    return handle_request(user_message)
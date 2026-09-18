import os
import json
import sqlite3
from dotenv import load_dotenv
from google import genai
from . import tools

# Load API key
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# ---------------- DATABASE ----------------

DB_PATH = os.path.join(os.path.dirname(__file__), "memory.db")


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


# ---------------- AI PROMPT ----------------

SYSTEM_PROMPT = """
You are MAVIX AI, a desktop AI assistant for students.

Choose exactly ONE capability:

general_answer
screen_context
browser_search
file_operation
vtop_action
save_memory
recall_memory

Return ONLY valid JSON:

{
  "capability": "...",
  "params": {},
  "reply": ""
}

Examples:

User: What is CPU scheduling?
-> {"capability":"general_answer","params":{},"reply":"..."}

User: Search operating system scheduling
-> {"capability":"browser_search","params":{"query":"operating system scheduling"},"reply":""}

User: Create a folder called OS Notes
-> {"capability":"file_operation","params":{"action":"create_folder","folder_name":"OS Notes"},"reply":""}

User: Explain what is on my screen
-> {"capability":"screen_context","params":{},"reply":""}

User: Remember that I need to revise CPU scheduling
-> {"capability":"save_memory","params":{"note":"revise CPU scheduling"},"reply":""}

User: What did I ask you to remember?
-> {"capability":"recall_memory","params":{},"reply":""}
"""


# ---------------- AI FUNCTIONS ----------------

def ask_ai(user_message):
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=user_message
    )

    return response.text


def decide_capability(user_message):
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=SYSTEM_PROMPT + "\n\nUser: " + user_message
    )

    raw = response.text.strip()

    try:
        return json.loads(raw)

    except json.JSONDecodeError:
        return {
            "capability": "general_answer",
            "params": {},
            "reply": raw
        }


# ---------------- MEMORY ----------------

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


# ---------------- CAPABILITY MAP ----------------

CAPABILITY_MAP = {
    "screen_context": tools.screen_context,
    "browser_search": tools.browser_search,
    "file_operation": tools.file_operation,
    "vtop_action": tools.vtop_action,
    "save_memory": save_memory,
    "recall_memory": recall_memory,
}


# ---------------- ROUTER ----------------

def handle_request(user_message):

    status = []

    status.append("Understanding request...")

    decision = decide_capability(user_message)

    status.append("Planning actions...")

    capability = decision.get("capability")
    params = decision.get("params", {})

    if capability == "general_answer":
        status.append("Generating answer...")
        reply = decision.get("reply") or ask_ai(user_message)
        status.append("Verifying result...")
        status.append("Task completed")

        return {
            "reply": reply,
            "capability": "general_answer",
            "status": status
        }

    func = CAPABILITY_MAP.get(capability)

    if func:
        status.append(f"Using {capability}...")
        result = func(params)

        status.append("Observing result...")
        status.append("Verifying result...")
        status.append("Task completed")

        return {
            "reply": result,
            "capability": capability,
            "status": status
        }

    return {
        "reply": f"Capability '{capability}' is not connected yet.",
        "capability": capability,
        "status": ["Understanding request...", "Capability not connected"]
    }


# ---------------- UI FUNCTION ----------------

def process_user_message(user_message):
    return handle_request(user_message)
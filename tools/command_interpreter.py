from pathlib import Path
from mavix_executor import execute_action, show_plan


# ==========================================
# MAVIX COMMAND INTERPRETER
# ==========================================

def interpret_command(command):
    command = command.lower().strip()

    # HELP
    if command == "help":
        return {
            "action": "HELP"
        }

    # OPEN CHROME
    if "chrome" in command and (
        "open" in command
        or "launch" in command
        or "start" in command
    ):
        return {
            "action": "OPEN_APP",
            "name": "chrome"
        }

    # OPEN CALCULATOR
    if "calculator" in command and (
        "open" in command
        or "launch" in command
        or "start" in command
    ):
        return {
            "action": "OPEN_APP",
            "name": "calculator"
        }

    # OPEN NOTEPAD
    if "notepad" in command and (
        "open" in command
        or "launch" in command
        or "start" in command
    ):
        return {
            "action": "OPEN_APP",
            "name": "notepad"
        }

    # CREATE FOLDER
    if "create" in command and "folder" in command:

        if "called" in command:
            folder_name = command.split("called", 1)[1].strip()

        elif "named" in command:
            folder_name = command.split("named", 1)[1].strip()

        else:
            return None

        if not folder_name:
            return None

        folder_path = Path.home() / "MAVIX_Test" / folder_name

        return {
            "action": "CREATE_FOLDER",
            "path": str(folder_path)
        }

    # MOVE TEST FILE
    if "move mavix move test" in command:

        source = Path.home() / "MAVIX_Test" / "MAVIX_Move_Test.txt"
        destination = Path.home() / "MAVIX_Test" / "Move_Test"

        return {
            "action": "MOVE_FILE",
            "source": str(source),
            "destination": str(destination)
        }
    # --------------------------------------
    # OPEN A MENTIONED FILE
    # --------------------------------------

    if command.startswith("open "):

        file_name = command[5:].strip()

        search_folder = Path.home() / "MAVIX_Test"

        # Search through subfolders too
        matches = list(search_folder.rglob(file_name))

        if matches:
            return {
                "action": "OPEN_FILE",
                "path": str(matches[0])
            }

        print(f"MAVIX: I couldn't find '{file_name}'.")
        return None
    return None
    # --------------------------------------
    # UNKNOWN COMMAND
    # --------------------------------------

    return None


# ==========================================
# MAVIX INTERACTIVE ASSISTANT
# ==========================================

print()
print("================================")
print("          MAVIX AI")
print("================================")
print("MAVIX is ready.")
print("Type 'help' to see supported commands.")
print("Type 'exit' to close MAVIX.")
print()


while True:

    command = input("You: ").strip()

    # -----------------------------
    # EXIT
    # -----------------------------

    if command.lower() == "exit":
        print("MAVIX: Goodbye!")
        break

    # Ignore empty input
    if not command:
        print("MAVIX: Please enter a command.")
        print()
        continue

    # -----------------------------
    # UNDERSTAND
    # -----------------------------

    action = interpret_command(command)

    if action is None:
        print("MAVIX: I don't understand that command yet.")
        print("MAVIX: Type 'help' to see supported commands.")
        print()
        continue

    print()
    print("MAVIX: Command understood.")

    # -----------------------------
    # PLAN
    # -----------------------------

    show_plan(action)

    # -----------------------------
    # EXECUTE
    # -----------------------------

    print("MAVIX: Executing...")
    result = execute_action(action)

    # -----------------------------
    # RESULT
    # -----------------------------

    if result:
        print()
        print("MAVIX: Action completed successfully.")
    else:
        print()
        print("MAVIX: Action failed.")

    print()
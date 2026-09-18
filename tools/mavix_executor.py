from pathlib import Path
import shutil
import subprocess


# ==========================================
# MAVIX APPROVED APPLICATIONS
# ==========================================

APPS = {
    "notepad": ["notepad.exe"],
    "calculator": ["explorer.exe", "calculator:"],
    "chrome": ["cmd", "/c", "start", "", "chrome"]
}


# ==========================================
# CREATE FOLDER
# ==========================================

def create_folder(folder_path):
    folder = Path(folder_path)

    try:
        folder.mkdir(parents=True, exist_ok=True)

        # VERIFY
        if folder.exists() and folder.is_dir():
            print(f"Verified: folder exists at {folder}")
            return True

        print("Verification failed: folder was not created.")
        return False

    except Exception as error:
        print("Could not create folder.")
        print("Error:", error)
        return False


# ==========================================
# OPEN APPLICATION
# ==========================================

def open_application(name):
    name = name.lower().strip()

    if name not in APPS:
        print(f"Application '{name}' is not supported.")
        return False

    try:
        subprocess.Popen(APPS[name])

        print(f"Application launch requested: {name}")
        return True

    except Exception as error:
        print(f"Could not open {name}.")
        print("Error:", error)
        return False


# ==========================================
# MOVE FILE
# ==========================================

def move_file(source_file, destination_folder):

    source = Path(source_file)
    destination = Path(destination_folder)

    # Check source
    if not source.exists():
        print(f"Source file not found: {source}")
        return False

    try:
        # Create destination folder if necessary
        destination.mkdir(parents=True, exist_ok=True)

        # Keep original filename
        new_location = destination / source.name

        # Move file
        shutil.move(str(source), str(new_location))

        # VERIFY MOVE
        if new_location.exists() and not source.exists():
            print(f"Verified: file moved to {new_location}")
            return True

        print("Verification failed: file move could not be confirmed.")
        return False

    except Exception as error:
        print("Could not move file.")
        print("Error:", error)
        return False


# ==========================================
# SHOW MAVIX PLAN
# ==========================================
# ==========================================
# OPEN FILE
# ==========================================

def open_file(file_path):

    file = Path(file_path)

    # VERIFY FILE EXISTS
    if not file.exists() or not file.is_file():
        print(f"File not found: {file}")
        return False

    try:
        # Open using Windows default application
        subprocess.Popen(["explorer.exe", str(file)])

        print(f"File opened: {file}")
        return True

    except Exception as error:
        print("Could not open file.")
        print("Error:", error)
        return False
def show_plan(action):

    action_type = action.get("action")

    print()
    print("MAVIX PLAN")
    print("----------------------------")

    if action_type == "CREATE_FOLDER":

        print("1. Create the requested folder")
        print("2. Verify that the folder exists")

    elif action_type == "OPEN_APP":

        print(f"1. Open {action['name']}")
        print("2. Confirm the launch request")

    elif action_type == "MOVE_FILE":

        print("1. Check that the source file exists")
        print("2. Move the file")
        print("3. Verify the new location")

    elif action_type == "HELP":

        print("1. Display supported commands")

    else:

        print("Unknown action")

    print("----------------------------")


# ==========================================
# MAVIX ACTION EXECUTOR
# ==========================================

def execute_action(action):

    action_type = action.get("action")

    print(f"Executing: {action_type}")
    print()

    # CREATE FOLDER
    if action_type == "CREATE_FOLDER":

        return create_folder(action["path"])

    # OPEN APPLICATION
    elif action_type == "OPEN_APP":

        return open_application(action["name"])

    # MOVE FILE
    elif action_type == "MOVE_FILE":

        return move_file(
            action["source"],
            action["destination"]
        )
    elif action_type == "OPEN_FILE":

        return open_file(action["path"])
    # HELP
    elif action_type == "HELP":

        print("MAVIX currently understands:")
        print("- open calculator")
        print("- open notepad")
        print("- open chrome")
        print("- create a folder called <name>")
        print("- move MAVIX Move Test to Move Test")
        print("- help")
        print("- exit")

        return True

    # UNKNOWN ACTION
    else:

        print(f"Unknown action: {action_type}")
        return False
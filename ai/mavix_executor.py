from pathlib import Path
import shutil
import subprocess


# ==========================================
# MAVIX APPROVED APPLICATIONS
# ==========================================

APPS = {
    "notepad": ["notepad.exe"],
    "calculator": ["explorer.exe", "calculator:"],
    "chrome": ["cmd", "/c", "start", "", "chrome"],
}


# ==========================================
# CREATE FOLDER
# ==========================================

def create_folder(folder_path):
    folder = Path(folder_path).expanduser()

    try:
        folder.mkdir(parents=True, exist_ok=True)

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
    source = Path(source_file).expanduser()
    destination = Path(destination_folder).expanduser()

    if not source.exists():
        print(f"Source file not found: {source}")
        return False

    try:
        destination.mkdir(parents=True, exist_ok=True)

        new_location = destination / source.name

        shutil.move(str(source), str(new_location))

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
# RESOLVE PATH
# ==========================================

def resolve_path(path_text):
    """
    Converts natural file/folder references into
    real Windows paths.
    """

    if not path_text:
        return None

    path_text = str(path_text).strip().strip('"')

    # --------------------------------------
    # Exact Windows / absolute path
    # --------------------------------------

    direct = Path(path_text).expanduser()

    if direct.exists():
        return direct

    # --------------------------------------
    # Handle paths such as:
    # JAVA\1.pdf
    # JAVA/1.pdf
    # --------------------------------------

    relative_path = Path.home() / "Desktop" / path_text

    if relative_path.exists():
        return relative_path

    # --------------------------------------
    # Handle "folder/file"
    # --------------------------------------

    desktop = Path.home() / "Desktop"

    parts = Path(path_text).parts

    if len(parts) >= 2:

        current = desktop

        for part in parts:
            current = current / part

        if current.exists():
            return current

    # --------------------------------------
    # Search Desktop
    # --------------------------------------

    target = Path(path_text).name.lower()

    search_locations = [
        Path.home() / "Desktop",
        Path.home() / "Documents",
        Path.home() / "Downloads",
        Path.home(),
    ]

    for location in search_locations:

        if not location.exists():
            continue

        try:

            for match in location.rglob("*"):

                if match.name.lower() == target:
                    return match

        except (PermissionError, OSError):
            continue

    return None


# ==========================================
# OPEN FILE OR FOLDER
# ==========================================

def open_file(file_path):

    target = resolve_path(file_path)

    if target is None:
        print(f"Could not find: {file_path}")
        return False

    try:

        subprocess.Popen(
            ["explorer.exe", str(target)]
        )

        print(f"Opened: {target}")
        return True

    except Exception as error:

        print(f"Could not open: {target}")
        print("Error:", error)
        return False


# ==========================================
# SHOW MAVIX PLAN
# ==========================================

def show_plan(action):

    action_type = action.get("action")

    print()
    print("MAVIX PLAN")
    print("----------------------------")

    if action_type == "CREATE_FOLDER":

        print("1. Create the requested folder")
        print("2. Verify that the folder exists")

    elif action_type == "OPEN_APP":

        print(f"1. Open {action.get('name')}")
        print("2. Confirm the launch request")

    elif action_type == "MOVE_FILE":

        print("1. Check that the source exists")
        print("2. Move the file")
        print("3. Verify the new location")

    elif action_type == "OPEN_FILE":

        print("1. Find the requested file or folder")
        print("2. Open it")
        print("3. Verify the request")

    elif action_type == "HELP":

        print("1. Display supported capabilities")

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

    # --------------------------------------
    # CREATE FOLDER
    # --------------------------------------

    if action_type == "CREATE_FOLDER":

        return create_folder(
            action["path"]
        )

    # --------------------------------------
    # OPEN APPLICATION
    # --------------------------------------

    elif action_type == "OPEN_APP":

        return open_application(
            action["name"]
        )

    # --------------------------------------
    # MOVE FILE
    # --------------------------------------

    elif action_type == "MOVE_FILE":

        return move_file(
            action["source"],
            action["destination"]
        )

    # --------------------------------------
    # OPEN FILE / FOLDER
    # --------------------------------------

    elif action_type == "OPEN_FILE":

        return open_file(
            action["path"]
        )

    # --------------------------------------
    # HELP
    # --------------------------------------

    elif action_type == "HELP":

        print("MAVIX currently supports:")
        print("- Open applications")
        print("- Create folders")
        print("- Open files")
        print("- Open folders")
        print("- Move files")

        return True

    # --------------------------------------
    # UNKNOWN ACTION
    # --------------------------------------

    else:

        print(f"Unknown action: {action_type}")
        return False
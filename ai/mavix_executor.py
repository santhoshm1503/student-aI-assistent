from pathlib import Path
import shutil
import subprocess
import os
import time


# ============================================================
# MAVIX APPROVED APPLICATIONS
# ============================================================

APPS = {
    "notepad": ["notepad.exe"],
    "calculator": ["explorer.exe", "calculator:"],
    "chrome": ["cmd", "/c", "start", "", "chrome"],
    "edge": ["cmd", "/c", "start", "", "msedge"],
}


# ============================================================
# LOCATIONS
# ============================================================

def get_location(name="desktop"):
    name = str(name or "desktop").strip().lower()

    locations = {
        "desktop": Path.home() / "Desktop",
        "documents": Path.home() / "Documents",
        "downloads": Path.home() / "Downloads",
        "home": Path.home(),
        "user": Path.home(),
        "pictures": Path.home() / "Pictures",
        "videos": Path.home() / "Videos",
        "music": Path.home() / "Music",
    }

    return locations.get(name, Path.home())


# ============================================================
# PATH RESOLUTION
# ============================================================

def resolve_path(path_text, default_location="desktop"):

    if not path_text:
        return None

    text = str(path_text).strip().strip('"').strip("'")

    # Exact path
    direct = Path(text).expanduser()

    if direct.exists():
        return direct

    # Desktop / Documents / Downloads
    locations = [
        get_location(default_location),
        get_location("desktop"),
        get_location("documents"),
        get_location("downloads"),
    ]

    for location in locations:

        candidate = location / text

        if candidate.exists():
            return candidate

    # Search by filename
    filename = Path(text).name.lower()

    for location in locations:

        if not location.exists():
            continue

        try:
            for item in location.rglob("*"):

                if item.name.lower() == filename:
                    return item

        except (PermissionError, OSError):
            continue

    return None


# ============================================================
# CREATE FOLDER
# ============================================================

def create_folder(folder_path):

    folder = Path(folder_path).expanduser()

    try:

        folder.mkdir(
            parents=True,
            exist_ok=True
        )

        if folder.exists() and folder.is_dir():

            print(
                f"Verified folder: {folder}"
            )

            return True

    except Exception as error:

        print(
            f"Create folder error: {error}"
        )

    return False


# ============================================================
# CREATE FILE
# ============================================================

def create_file(file_path):

    file_path = Path(file_path).expanduser()

    try:

        file_path.parent.mkdir(
            parents=True,
            exist_ok=True
        )

        if not file_path.exists():
            file_path.touch()

        if file_path.exists() and file_path.is_file():

            print(
                f"Verified file: {file_path}"
            )

            return True

    except Exception as error:

        print(
            f"Create file error: {error}"
        )

    return False


# ============================================================
# OPEN APPLICATION
# ============================================================

def open_application(name):

    name = str(
        name or ""
    ).lower().strip()

    if name not in APPS:

        print(
            f"Application '{name}' is not supported."
        )

        return False

    try:

        subprocess.Popen(
            APPS[name]
        )

        print(
            f"Application launched: {name}"
        )

        return True

    except Exception as error:

        print(
            f"Could not open {name}: {error}"
        )

        return False


# ============================================================
# OPEN FILE / FOLDER
# ============================================================

def open_file(file_path):

    target = resolve_path(file_path)

    if target is None:

        print(
            f"Could not find: {file_path}"
        )

        return False

    try:

        # Windows default application
        # PDF -> Adobe/Edge
        # DOCX -> Word
        # PPTX -> PowerPoint
        # Folder -> Explorer
        os.startfile(
            str(target)
        )

        print(
            f"Opened: {target}"
        )

        return True

    except Exception as error:

        print(
            f"Could not open {target}: {error}"
        )

        return False


# ============================================================
# MOVE
# ============================================================

def move_file(
    source_file,
    destination_folder
):

    source = resolve_path(
        source_file
    )

    if source is None:

        print(
            f"Source not found: {source_file}"
        )

        return False

    destination = resolve_path(
        destination_folder
    )

    if destination is None:

        destination = get_location(
            destination_folder
        )

    try:

        destination.mkdir(
            parents=True,
            exist_ok=True
        )

        new_location = (
            destination / source.name
        )

        shutil.move(
            str(source),
            str(new_location)
        )

        if (
            new_location.exists()
            and not source.exists()
        ):

            print(
                f"Verified move: {new_location}"
            )

            return True

    except Exception as error:

        print(
            f"Move error: {error}"
        )

    return False


# ============================================================
# COPY
# ============================================================

def copy_item(
    source,
    destination
):

    source_path = resolve_path(
        source
    )

    if source_path is None:
        return False

    destination_path = resolve_path(
        destination
    )

    if destination_path is None:

        destination_path = get_location(
            destination
        )

    try:

        destination_path.mkdir(
            parents=True,
            exist_ok=True
        )

        final_path = (
            destination_path /
            source_path.name
        )

        if source_path.is_dir():

            shutil.copytree(
                source_path,
                final_path,
                dirs_exist_ok=True
            )

        else:

            shutil.copy2(
                source_path,
                final_path
            )

        return final_path.exists()

    except Exception as error:

        print(
            f"Copy error: {error}"
        )

        return False


# ============================================================
# RENAME
# ============================================================

def rename_item(
    source,
    new_name
):

    source_path = resolve_path(
        source
    )

    if source_path is None:
        return False

    try:

        new_path = (
            source_path.parent /
            str(new_name).strip()
        )

        source_path.rename(
            new_path
        )

        return new_path.exists()

    except Exception as error:

        print(
            f"Rename error: {error}"
        )

        return False


# ============================================================
# DELETE
# ============================================================

def delete_item(
    path,
    confirmed=False
):

    if confirmed is not True:

        print(
            "Delete requires confirmation."
        )

        return False

    target = resolve_path(path)

    if target is None:
        return False

    try:

        if target.is_dir():
            shutil.rmtree(target)
        else:
            target.unlink()

        return not target.exists()

    except Exception as error:

        print(
            f"Delete error: {error}"
        )

        return False


# ============================================================
# FIND
# ============================================================

def find_item(
    name,
    location="desktop"
):

    base = get_location(location)

    if not base.exists():
        return []

    results = []

    search_name = str(
        name or ""
    ).lower().strip()

    try:

        for item in base.rglob("*"):

            if search_name in item.name.lower():

                results.append(
                    str(item)
                )

                if len(results) >= 50:
                    break

    except (
        PermissionError,
        OSError
    ):
        pass

    return results


# ============================================================
# LIST FOLDER
# ============================================================

def list_folder(
    path="desktop"
):

    folder = resolve_path(path)

    if folder is None:
        folder = get_location(path)

    if (
        not folder.exists()
        or not folder.is_dir()
    ):
        return []

    results = []

    try:

        for item in folder.iterdir():

            results.append({
                "name": item.name,
                "type":
                    "folder"
                    if item.is_dir()
                    else "file",
                "path": str(item)
            })

    except (
        PermissionError,
        OSError
    ):
        return []

    return results


# ============================================================
# MERGE FOLDERS
# ============================================================

def merge_folders(
    source1,
    source2,
    destination
):

    folder1 = resolve_path(source1)
    folder2 = resolve_path(source2)

    if folder1 is None or folder2 is None:
        return False

    if (
        not folder1.is_dir()
        or not folder2.is_dir()
    ):
        return False

    result_folder = (
        get_location("desktop")
        / str(destination)
    )

    try:

        result_folder.mkdir(
            parents=True,
            exist_ok=True
        )

        for source_folder in [
            folder1,
            folder2
        ]:

            for item in source_folder.iterdir():

                target = (
                    result_folder /
                    item.name
                )

                if item.is_dir():

                    shutil.copytree(
                        item,
                        target,
                        dirs_exist_ok=True
                    )

                else:

                    if target.exists():

                        stem = target.stem
                        suffix = target.suffix
                        count = 2

                        while target.exists():

                            target = (
                                result_folder /
                                f"{stem}_{count}{suffix}"
                            )

                            count += 1

                    shutil.copy2(
                        item,
                        target
                    )

        print(
            f"Verified merge: {result_folder}"
        )

        return result_folder.exists()

    except Exception as error:

        print(
            f"Merge error: {error}"
        )

        return False


# ============================================================
# SHOW PLAN
# ============================================================

def show_plan(action):

    print()
    print("MAVIX PLAN")
    print("----------------------------")

    action_type = action.get("action")

    if action_type == "CREATE_FOLDER":
        print("1. Create folder")
        print("2. Verify folder")

    elif action_type == "CREATE_FILE":
        print("1. Create file")
        print("2. Verify file")

    elif action_type == "OPEN_APP":
        print("1. Open application")
        print("2. Verify launch")

    elif action_type == "OPEN_FILE":
        print("1. Find file")
        print("2. Open file")
        print("3. Verify")

    elif action_type == "MOVE_FILE":
        print("1. Find source")
        print("2. Move file")
        print("3. Verify")

    elif action_type == "COPY":
        print("1. Find source")
        print("2. Copy")
        print("3. Verify")

    elif action_type == "MERGE_FOLDERS":
        print("1. Find source folders")
        print("2. Create result folder")
        print("3. Merge contents")
        print("4. Verify result")

    else:
        print("Execute requested action")

    print("----------------------------")


# ============================================================
# MAIN EXECUTOR
# ============================================================

def execute_action(action):

    action_type = str(
        action.get(
            "action",
            ""
        )
    ).upper().strip()

    try:

        if action_type == "CREATE_FOLDER":

            return create_folder(
                action["path"]
            )

        elif action_type == "CREATE_FILE":

            return create_file(
                action["path"]
            )

        elif action_type == "OPEN_APP":

            return open_application(
                action["name"]
            )

        elif action_type == "OPEN_FILE":

            return open_file(
                action["path"]
            )

        elif action_type == "MOVE_FILE":

            return move_file(
                action["source"],
                action["destination"]
            )

        elif action_type == "COPY":

            return copy_item(
                action["source"],
                action["destination"]
            )

        elif action_type == "RENAME":

            return rename_item(
                action["source"],
                action["new_name"]
            )

        elif action_type == "DELETE":

            return delete_item(
                action["path"],
                action.get(
                    "confirmed",
                    False
                )
            )

        elif action_type == "FIND":

            return len(
                find_item(
                    action["name"],
                    action.get(
                        "location",
                        "desktop"
                    )
                )
            ) > 0

        elif action_type == "LIST":

            return list_folder(
                action.get(
                    "path",
                    "desktop"
                )
            )

        elif action_type == "MERGE_FOLDERS":

            return merge_folders(
                action["source1"],
                action["source2"],
                action["destination"]
            )

        elif action_type == "HELP":

            return True

        return False

    except Exception as error:

        print(
            f"Execution error: {error}"
        )

        return False
from .mavix_executor import (
    get_location,
    resolve_path,
    create_folder,
    create_file,
    open_application,
    open_file,
    move_file,
    copy_item,
    rename_item,
    delete_item,
    find_item,
    list_folder,
    merge_folders,
    execute_action,
    show_plan,
)


# ============================================================
# SCREEN
# ============================================================

def screen_context(params=None):

    return (
        "[Screen] Screen analysis is handled by "
        "the screen analysis module."
    )


# ============================================================
# BROWSER
# ============================================================

def browser_search(params=None):

    params = params or {}

    query = (
        params.get("query")
        or params.get("search")
        or ""
    ).strip()

    if not query:
        return "[Browser] Search query is missing."

    return (
        f"[Browser] Search request received: {query}"
    )


# ============================================================
# FILE OPERATION
# ============================================================

def file_operation(params):

    if not isinstance(params, dict):

        return "[Files] Invalid parameters."

    action = str(
        params.get(
            "action",
            ""
        )
    ).lower().strip()


    # ========================================================
    # CREATE FOLDER
    # ========================================================

    if action in (
        "create_folder",
        "make_folder",
        "new_folder"
    ):

        name = (
            params.get("folder_name")
            or params.get("name")
            or params.get("folder")
        )

        if not name:
            return "Folder name is missing."

        location = params.get(
            "location",
            "desktop"
        )

        path = (
            get_location(location)
            / name
        )

        action_data = {
            "action": "CREATE_FOLDER",
            "path": str(path)
        }

        show_plan(action_data)

        result = execute_action(
            action_data
        )

        if result:
            return (
                f"Folder created successfully: {path}"
            )

        return "Could not create folder."


    # ========================================================
    # CREATE FILE
    # ========================================================

    if action in (
        "create_file",
        "new_file"
    ):

        name = (
            params.get("file_name")
            or params.get("name")
            or params.get("file")
        )

        if not name:
            return "File name is missing."

        location = params.get(
            "location",
            "desktop"
        )

        path = (
            get_location(location)
            / name
        )

        action_data = {
            "action": "CREATE_FILE",
            "path": str(path)
        }

        show_plan(action_data)

        result = execute_action(
            action_data
        )

        if result:
            return (
                f"File created successfully: {path}"
            )

        return "Could not create file."


    # ========================================================
    # OPEN APPLICATION
    # ========================================================

    if action in (
        "open_app",
        "open_application",
        "launch_app"
    ):

        name = (
            params.get("name")
            or params.get("app")
            or params.get("application")
        )

        if not name:
            return "Application name is missing."

        action_data = {
            "action": "OPEN_APP",
            "name": name
        }

        show_plan(action_data)

        result = execute_action(
            action_data
        )

        if result:
            return (
                f"Opened {name} successfully."
            )

        return (
            f"Could not open {name}."
        )


    # ========================================================
    # OPEN FILE / FOLDER
    # ========================================================

    if action in (
        "open_file",
        "open_folder"
    ):

        path = (
            params.get("path")
            or params.get("file")
            or params.get("folder")
            or params.get("file_path")
        )

        if not path:
            return "File or folder path is missing."

        action_data = {
            "action": "OPEN_FILE",
            "path": path
        }

        show_plan(action_data)

        result = execute_action(
            action_data
        )

        if result:
            return (
                f"Opened successfully: {path}"
            )

        return (
            f"Could not open: {path}"
        )


    # ========================================================
    # MOVE
    # ========================================================

    if action in (
        "move_file",
        "move"
    ):

        source = params.get(
            "source"
        )

        destination = params.get(
            "destination"
        )

        if not source:
            return "Source is missing."

        if not destination:
            return "Destination is missing."

        action_data = {
            "action": "MOVE_FILE",
            "source": source,
            "destination": destination
        }

        show_plan(action_data)

        result = execute_action(
            action_data
        )

        return (
            "File moved successfully."
            if result
            else "File move failed."
        )


    # ========================================================
    # COPY
    # ========================================================

    if action in (
        "copy",
        "copy_file",
        "copy_folder"
    ):

        source = params.get(
            "source"
        )

        destination = params.get(
            "destination"
        )

        if not source or not destination:
            return (
                "Source and destination are required."
            )

        action_data = {
            "action": "COPY",
            "source": source,
            "destination": destination
        }

        show_plan(action_data)

        result = execute_action(
            action_data
        )

        return (
            "Copied successfully."
            if result
            else "Copy failed."
        )


    # ========================================================
    # RENAME
    # ========================================================

    if action in (
        "rename",
        "rename_file",
        "rename_folder"
    ):

        source = (
            params.get("source")
            or params.get("path")
        )

        new_name = params.get(
            "new_name"
        )

        if not source or not new_name:
            return (
                "Source and new name are required."
            )

        action_data = {
            "action": "RENAME",
            "source": source,
            "new_name": new_name
        }

        show_plan(action_data)

        result = execute_action(
            action_data
        )

        return (
            "Renamed successfully."
            if result
            else "Rename failed."
        )


    # ========================================================
    # DELETE
    # ========================================================

    if action in (
        "delete",
        "delete_file",
        "delete_folder"
    ):

        path = (
            params.get("path")
            or params.get("file")
            or params.get("folder")
        )

        if not path:
            return "Path is missing."

        confirmed = params.get(
            "confirmed",
            False
        )

        if confirmed is not True:

            return (
                f"Confirmation required before deleting {path}."
            )

        action_data = {
            "action": "DELETE",
            "path": path,
            "confirmed": True
        }

        show_plan(action_data)

        result = execute_action(
            action_data
        )

        return (
            "Deleted successfully."
            if result
            else "Delete failed."
        )


    # ========================================================
    # FIND
    # ========================================================

    if action in (
        "find",
        "find_file",
        "search"
    ):

        name = (
            params.get("name")
            or params.get("query")
            or params.get("file")
        )

        location = params.get(
            "location",
            "desktop"
        )

        if not name:
            return "Search name is missing."

        results = find_item(
            name,
            location
        )

        if not results:
            return (
                f"No results found for {name}."
            )

        return (
            f"Found {len(results)} result(s):\n"
            + "\n".join(results[:20])
        )


    # ========================================================
    # LIST
    # ========================================================

    if action in (
        "list",
        "list_folder",
        "list_files"
    ):

        path = (
            params.get("path")
            or params.get(
                "location",
                "desktop"
            )
        )

        results = list_folder(
            path
        )

        if not results:
            return (
                f"No items found in {path}."
            )

        lines = [
            f"Contents of {path}:"
        ]

        for item in results:

            lines.append(
                f"- {item['type']}: "
                f"{item['name']}"
            )

        return "\n".join(lines)


    # ========================================================
    # MERGE
    # ========================================================

    if action in (
        "merge",
        "merge_folders"
    ):

        sources = params.get(
            "sources",
            []
        )

        source1 = params.get(
            "source1"
        )

        source2 = params.get(
            "source2"
        )

        destination = (
            params.get("destination")
            or "done"
        )

        if isinstance(sources, list):

            if len(sources) >= 2:

                source1 = sources[0]
                source2 = sources[1]

        if not source1 or not source2:

            return (
                "Two source folders are required."
            )

        action_data = {
            "action": "MERGE_FOLDERS",
            "source1": source1,
            "source2": source2,
            "destination": destination
        }

        show_plan(action_data)

        result = execute_action(
            action_data
        )

        return (
            f"Folders merged successfully into {destination}."
            if result
            else "Folder merge failed."
        )


    # ========================================================
    # HELP
    # ========================================================

    if action == "help":

        return """
MAVIX supports:

- Open applications
- Open files
- Open folders
- Create folders
- Create files
- Move files
- Copy files
- Rename files
- Delete files with confirmation
- Find files
- List folders
- Merge folders
""".strip()


    return (
        f"[Files] Unsupported action: {action}"
    )


# ============================================================
# VTOP
# ============================================================

def vtop_action(params=None):

    return (
        "[VTOP] VTOP automation request received."
    )
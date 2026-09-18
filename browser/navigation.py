def open_website(page, url):
    try:
        page.goto(url, wait_until="domcontentloaded")
        return page.title()
    except Exception as error:
        print(f"Navigation failed: {error}")
        return None
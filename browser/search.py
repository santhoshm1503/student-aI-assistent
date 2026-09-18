def search_google(page, query):
    try:
        page.goto("https://www.bing.com", wait_until="domcontentloaded")

        search_box = page.locator("textarea[name='q']")
        search_box.fill(query)
        search_box.press("Enter")

        page.wait_for_timeout(3000)

        return page.locator("body").inner_text()

    except Exception as error:
        print(f"Search failed: {error}")
        return ""
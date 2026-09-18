def get_page_text(page):
    try:
        return page.locator("body").inner_text()
    except Exception as error:
        print(f"Extraction failed: {error}")
        return ""
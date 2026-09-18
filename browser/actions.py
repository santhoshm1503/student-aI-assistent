def click_element(page, selector):
    try:
        page.locator(selector).first.click()
        return True
    except Exception as error:
        print(f"Click failed: {error}")
        return False


def type_text(page, selector, text):
    try:
        page.locator(selector).fill(text)
        return True
    except Exception as error:
        print(f"Typing failed: {error}")
        return False
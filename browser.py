from playwright.sync_api import sync_playwright


def open_browser():
    playwright = sync_playwright().start()
    browser = playwright.chromium.launch(headless=False)
    page = browser.new_page()
    return playwright, browser, page


def open_website(page, url):
    page.goto(url, wait_until="domcontentloaded")


def find_element(page, selector):
    element = page.locator(selector)
    element.wait_for(state="visible")
    return element


def type_text(element, text):
    element.fill(text)


def click_element(element):
    element.click()


def read_page(page):
    return page.locator("body").inner_text()


def browser_search(page, search_query):
    search_box = find_element(page, 'textarea[name="q"]')
    type_text(search_box, search_query)
    search_box.press("Enter")
    page.wait_for_load_state("domcontentloaded")
    return read_page(page)


def close_browser(playwright, browser):
    browser.close()
    playwright.stop()
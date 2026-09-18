from .browser_manager import open_browser, close_browser
from .navigation import open_website
from .actions import click_element, type_text
from .extraction import get_page_text
from .search import search_google


class BrowserController:
    def __init__(self):
        self.playwright = None
        self.browser = None
        self.page = None

    def start(self):
        self.playwright, self.browser, self.page = open_browser()
        return True

    def stop(self):
        if self.browser and self.playwright:
            close_browser(self.playwright, self.browser)
            self.browser = None
            self.playwright = None
            self.page = None

        return True

    def open_website(self, url):
        return open_website(self.page, url)

    def click(self, selector):
        return click_element(self.page, selector)

    def type(self, selector, text):
        return type_text(self.page, selector, text)

    def read(self):
        return get_page_text(self.page)

    def search(self, query):
        return search_google(self.page, query)
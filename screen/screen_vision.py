import os
import cv2
import numpy as np
import pyautogui
import pytesseract
import pdfplumber
import re

class SecureVisionModule:
    def __init__(self):
        # Dynamically locatse the bundled Tesseract engine relative to this file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        tesseract_path = os.path.join(current_dir, "tesseract_engine", "tesseract.exe")
        
        # Configure PyTesseract to use the local bundled executable
        pytesseract.pytesseract.tesseract_cmd = tesseract_path

    def preprocess_image(self, image):
        """Enhances image contrast for better OCR accuracy."""
        # Convert to grayscale
        gray = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2GRAY)
        # Upscale to improve small text visibility
        resized = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
        # Apply slight blur to remove noise
        blur = cv2.GaussianBlur(resized, (5, 5), 0)
        # Apply adaptive thresholding to isolate text
        thresh = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
        return thresh

    def clean_text(self, text):
        """Removes excess whitespace and non-printable characters."""
        if not text:
            return ""
        # Collapse multiple spaces/newlines into a single space
        cleaned = re.sub(r'\s+', ' ', text)
        return cleaned.strip()

    def capture_screen(self):
        """Captures the current screen and extracts text with a safety timeout."""
        try:
            screenshot = pyautogui.screenshot()
            processed_img = self.preprocess_image(screenshot)
            
            # 15-second timeout to prevent system hanging on complex images
            raw_text = pytesseract.image_to_string(processed_img, timeout=15)
            return self.clean_text(raw_text)
            
        except RuntimeError:
            return "[ERROR] OCR processing timed out."
        except Exception as e:
            return f"[ERROR] Vision capture failed: {str(e)}"

    def read_pdf(self, file_path):
        """Securely reads local PDFs with a strict 50-page memory limit."""
        extracted_text = ""
        try:
            with pdfplumber.open(file_path) as pdf:
                for i, page in enumerate(pdf.pages):
                    if i >= 50:  # Hard cap to prevent memory overflow
                        break
                    extracted_text += page.extract_text() + "\n"
            return self.clean_text(extracted_text)
        except Exception as e:
            return f"[ERROR] PDF parsing failed: {str(e)}"

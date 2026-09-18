import pyautogui
import pytesseract
import cv2
import numpy as np
import pdfplumber
import logging
import re
from pathlib import Path
from typing import Optional, Tuple, Union

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s: Vision Module -> %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

class SecureVisionModule:
    def __init__(self, tesseract_cmd_path: Optional[str] = None):
        self._setup_tesseract(tesseract_cmd_path)
        logging.info("Secure Vision Module Initialized.")

    def _setup_tesseract(self, tesseract_cmd_path: Optional[str]):
        if tesseract_cmd_path:
            tess_path = Path(tesseract_cmd_path)
            if tess_path.exists() and tess_path.is_file():
                pytesseract.pytesseract.tesseract_cmd = str(tess_path)
            else:
                logging.warning(f"Tesseract path not found at {tess_path}. Using system default.")
        try:
            pytesseract.get_tesseract_version()
        except EnvironmentError:
            logging.error("CRITICAL: Tesseract-OCR is not installed or not in system PATH.")

    def capture_screen(self, region: Optional[Tuple[int, int, int, int]] = None) -> Optional[np.ndarray]:
        try:
            if region:
                x, y, w, h = region
                if w <= 0 or h <= 0:
                    logging.error("Invalid region bounds.")
                    return None
                    
            logging.info(f"Capturing screen data...")
            screenshot = pyautogui.screenshot(region=region)
            frame = np.array(screenshot)
            return cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
            
        except pyautogui.FailSafeException:
            logging.error("Capture aborted by PyAutoGUI Fail-Safe.")
            return None
        except Exception as e:
            logging.error(f"Unexpected error during capture: {e}")
            return None

    def advanced_preprocess(self, image: np.ndarray) -> np.ndarray:
        try:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            gray = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)
            processed = cv2.adaptiveThreshold(
                blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
            )
            return processed
        except Exception as e:
            logging.error(f"Image preprocessing failed: {e}")
            return image 

    def read_pdf(self, file_path: Union[str, Path]) -> str:
        safe_path = Path(file_path).resolve() 
        if not safe_path.exists() or not safe_path.is_file():
            return f"Error: Target {safe_path.name} is invalid."
        if safe_path.suffix.lower() != '.pdf':
            return f"Security Exception: Not a PDF file ({safe_path.name})."

        logging.info(f"Analyzing PDF: {safe_path.name}")
        extracted_text = []
        
        try:
            with pdfplumber.open(safe_path) as pdf:
                max_pages = 50
                for page_num, page in enumerate(pdf.pages):
                    if page_num >= max_pages:
                        extracted_text.append(f"\n[WARNING: Truncated at {max_pages} pages]")
                        break
                    text = page.extract_text()
                    if text:
                        extracted_text.append(f"--- Page {page_num + 1} ---\n{text.strip()}")
                        
            result = "\n".join(extracted_text)
            return result if result else "No readable text found in PDF."
        except Exception as e:
            logging.error(f"Failed to securely parse PDF: {e}")
            return "System Error: PDF parsing failed."

    def clean_text_pipeline(self, raw_text: str) -> str:
        cleaned_lines = []
        lines = raw_text.split('\n')[:1000] 
        
        for line in lines:
            line = line.strip()
            if len(line) > 0 and re.search(r'[a-zA-Z0-9]', line):
                line = re.sub(r'\s+', ' ', line)
                line = ''.join(char for char in line if char.isprintable())
                cleaned_lines.append(line)
                
        final_text = "\n".join(cleaned_lines)
        return final_text if final_text else "No recognizable text retrieved."

    def get_context(self, source_type: str = "screen", file_path: Optional[str] = None, region: Optional[Tuple[int, int, int, int]] = None) -> str:
        if source_type == "pdf":
            if not file_path:
                return "Error: source_type 'pdf' requires a valid 'file_path'."
            return self.read_pdf(file_path)
            
        elif source_type == "screen":
            image = self.capture_screen(region=region)
            if image is None:
                return "System Error: Screen capture failed."
                
            processed_image = self.advanced_preprocess(image)
            
            try:
                logging.info("Executing OCR extraction...")
                raw_text = pytesseract.image_to_string(processed_image, timeout=15)
                return self.clean_text_pipeline(raw_text)
            except RuntimeError as e:
                logging.error(f"OCR Timeout: {e}")
                return "Error: OCR took too long and was safely aborted."
            except Exception as e:
                logging.error(f"OCR Extraction failed: {e}")
                return "Error: OCR engine failure."
        else:
            return f"Error: '{source_type}' is not a valid operation."

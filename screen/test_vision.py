from screen_vision import SecureVisionModule
import os

def run_tests():
    print("Initializing Vision Engine...")
    
    # IMPORTANT: Update this path if you are on Windows and Tesseract is installed elsewhere.
    # Example: tesseract_path = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    tesseract_path = r"C:\Program Files\Tesseract-OCR\tesseract.exe" 
    
    vision = SecureVisionModule(tesseract_cmd_path=tesseract_path)
    
    print("\n--- TEST 1: SCREEN READING ---")
    screen_result = vision.get_context(source_type="screen")
    print(f"Result:\n{screen_result}")
    
    # Test 2: PDF Reading (Requires a test PDF in the same folder)
    # print("\n--- TEST 2: PDF READING ---")
    # pdf_result = vision.get_context(source_type="pdf", file_path="sample.pdf")
    # print(f"Result:\n{pdf_result}")

if __name__ == "__main__":
    run_tests()

from screen_vision import SecureVisionModule

def run_local_test():
    print("--- TEST 1: SCREEN READING ---")
    print("INFO: Vision Module -> Booting engine and targeting local 'tesseract_engine' folder...")
    
    # Initialize without needing to pass a hardcoded path
    vision_engine = SecureVisionModule()
    
    print("INFO: Vision Module -> Capturing screen data...")
    print("INFO: Vision Module -> Executing OCR extraction...\n")
    
    # Execute the capture
    result = vision_engine.capture_screen()
    
    print("Result:")
    print("-" * 40)
    print(result)
    print("-" * 40)

if __name__ == "__main__":
    run_local_test()

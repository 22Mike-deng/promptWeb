from playwright.sync_api import sync_playwright
import sys

def test_gaming_exchange_platform():
    errors = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Capture console errors
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
        
        print("Testing Login Page...")
        page.goto('http://localhost:5173/login')
        page.wait_for_load_state('networkidle')
        
        # Check login page elements
        login_title = page.locator('text=Adventurer Login').first
        if login_title.is_visible():
            print("✓ Login page loaded correctly")
        else:
            print("✗ Login page title not found")
        
        # Check form elements
        email_input = page.locator('input[type="email"]').first
        password_input = page.locator('input[type="password"]').first
        login_button = page.locator('button:has-text("Login")').first
        
        if email_input.is_visible() and password_input.is_visible() and login_button.is_visible():
            print("✓ Login form elements present")
        else:
            print("✗ Some login form elements missing")
        
        # Take screenshot
        page.screenshot(path='/tmp/login_page.png', full_page=True)
        print("✓ Screenshot saved to /tmp/login_page.png")
        
        print("\nTesting Register Page...")
        page.goto('http://localhost:5173/register')
        page.wait_for_load_state('networkidle')
        
        register_title = page.locator('text=Become an Adventurer').first
        if register_title.is_visible():
            print("✓ Register page loaded correctly")
        else:
            print("✗ Register page title not found")
        
        page.screenshot(path='/tmp/register_page.png', full_page=True)
        print("✓ Screenshot saved to /tmp/register_page.png")
        
        browser.close()
        
        # Report console errors
        if errors:
            print(f"\n⚠ Console errors found ({len(errors)}):")
            for err in errors[:5]:
                print(f"  - {err}")
        else:
            print("\n✓ No console errors detected")
        
        return len([e for e in errors if 'Error' in e or 'error' in e]) == 0

if __name__ == "__main__":
    success = test_gaming_exchange_platform()
    sys.exit(0 if success else 1)

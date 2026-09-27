import asyncio
from playwright.async_api import async_playwright

async def check():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        page = await b.new_page()
        await page.goto('https://provenance-zeta.vercel.app', wait_until='networkidle')
        await page.wait_for_selector('table')
        
        # Test 1: Click Inspect button in first row
        inspect_btn = page.locator("tbody tr button:has-text('Inspect')").first
        await inspect_btn.click()
        await page.wait_for_timeout(500)
        
        drawer = page.locator("div:has-text('Citation & Lineage Inspector')").last
        print("Drawer visible:", await drawer.is_visible())
        drawer_text = await drawer.inner_text()
        print("Drawer text excerpt:", repr(drawer_text[:120]))
        
        # Close drawer
        close_drawer_btn = page.locator("button:has-text('Close Inspector')")
        await close_drawer_btn.click()
        await page.wait_for_timeout(400)
        print("Drawer closed:", not await drawer.is_visible())
        
        # Test 2: Click Export button in header
        export_btn = page.locator("header button:has-text('Export')")
        await export_btn.click()
        await page.wait_for_timeout(500)
        
        modal = page.locator("div:has-text('Export Verified Dataset')").last
        print("Modal visible:", await modal.is_visible())
        modal_text = await modal.inner_text()
        print("Modal text excerpt:", repr(modal_text[:120]))
        
        close_modal_btn = page.locator("button:has-text('Close')").last
        await close_modal_btn.click()
        await page.wait_for_timeout(400)
        print("Modal closed:", not await modal.is_visible())
        
        await b.close()

if __name__ == '__main__':
    asyncio.run(check())

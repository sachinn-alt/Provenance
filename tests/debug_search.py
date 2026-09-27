import asyncio
from playwright.async_api import async_playwright

async def check():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        page = await b.new_page()
        await page.goto('https://provenance-zeta.vercel.app', wait_until='networkidle')
        await page.wait_for_selector('table')
        
        rows = await page.locator('tbody tr').all_inner_texts()
        print('Initial rows:', len(rows))
        for i, r in enumerate(rows[:3]):
            print(f'Row {i}:', repr(r[:80]))
            
        inp = page.locator('input[placeholder*="Search across"]')
        await inp.fill('Cognition')
        await page.wait_for_timeout(600)
        
        filtered = await page.locator('tbody tr').all_inner_texts()
        print('Filtered rows count:', len(filtered))
        for r in filtered:
            print('Filtered row:', repr(r[:80]))
            
        await b.close()

if __name__ == '__main__':
    asyncio.run(check())

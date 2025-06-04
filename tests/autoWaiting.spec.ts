import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page },testInfo) => {
    //await page.goto('http://uitestingplayground.com/ajax')
    await page.goto(process.env.AUTO_WAITING_URL) //Read URL from env file
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 2000);//Increase timeout for testsuite by 2 seconds
})



test('autowaiting', async ({ page }) => {
    const successButton = page.locator('.bg-success')
    //await successButton.click()
    //const text = await successButton.textContent() //Playwright automatically waits for textContent

    //But Playwright doesn't wait for various elements, for example for allTextContents.
    //Need to create custom-wait
    await successButton.waitFor({state: "attached"})
    const text = await successButton.allTextContents()

    expect(text).toContain('Data loaded with AJAX get request.')
})

test('autowaiting custom timeout', async ({ page }) => {
    const successButton = page.locator('.bg-success')
    await expect(successButton).toHaveText('Data loaded with AJAX get request.',{timeout: 20000})
})

test('alternative waits',async({page})=>{
    const successButton = page.locator('.bg-success')

    //wait for element
    //await page.waitForSelector('.bg-success')

    //wait for particular response
    //await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    //wait for network calls to be completed (NOT RECOMMENDED)
    await page.waitForLoadState('networkidle')

    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})

test('timeouts',async({page})=>{
    //test.setTimeout(10000) //fixed timeout for just this test
    test.slow() //Default timeout is multiplied by 3
    const successButton = page.locator('.bg-success')
    await successButton.click()
})
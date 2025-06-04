import { expect } from '@playwright/test'
//Remove import test from playwright and get from test-options
import { test } from '../test-options'

//Add 2nd fixture to declaration
test('drag and drop with iframe', async ({ page, globalsQaURL }) => {
    //await page.goto('http://www.globalsqa.com/demo-site/draganddrop/')
    await page.goto(globalsQaURL)
    //Accept Cookie consent dialog
    page.on('dialog', dialog => dialog.accept());
    await page.getByRole('button').locator('.fc-button-label', { hasText: "Consent" }).click()
    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')
    await frame.locator('li', { hasText: "High Tatras 2" }).dragTo(frame.locator('#trash')) //Replace page with frame const

    //More precise control
    await frame.locator('li', { hasText: "High Tatras 4" }).hover()
    await page.mouse.down()
    await frame.locator('#trash').hover()
    await page.mouse.up()
    //await page.waitForTimeout(2000);
    await expect(frame.locator('#trash li h5')).toHaveText(["High Tatras 2", "High Tatras 4"])
})
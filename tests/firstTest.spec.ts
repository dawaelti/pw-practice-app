import { test, expect } from '@playwright/test'

/* //Minimum test structure
test('the first test',() =>{

})

//Test Suite format
test.describe('test suite 1',() =>{
    test('the first test',() =>{

    })
    
    test('the first test',() =>{
    
    })

}) */
//beforeEach, beforeAll ... are called "Hooks" in Playwright
test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})
//Get page fixture
//async keyword is needed for await
//await is only needed for PROMISE return types -->hover over command e.g. page.goto and check if <Promise | Response> exists
/* test('the first test', async ({ page }) => {
    await page.getByText('Form Layouts').click()
})

test('navigate to datepicker page', async ({ page }) => {
    await page.getByText('Datepicker').click()
}) */
test('Locator syntax rule', async ({ page }) => {
    //By Tag name
    page.locator('input')

    //By ID
    page.locator('#inputEmail1')

    //By Class value
    page.locator('.shape-rectangle')

    //By Attribute
    page.locator('[placeholder="Email"]')

    //By Class value Full
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //Combine different selectors
    page.locator('input[placeholder="Email"].shape-rectangle')

    //By Xpath
    page.locator('//*[@id="inputEmail1"]')

    //By Partial Text Match
    page.locator(':text("Using")')

    //By Exact Text Match
    page.locator(':text-is("Using the Grid")')
})

test('User facing locators', async ({ page }) => {
    await page.getByRole('textbox', { name: "Email" }).first().click()
    await page.getByRole('button', { name: "Sign in" }).first().click()
    await page.getByLabel('Email').first().click()
    await page.getByPlaceholder('Jane Doe').click()
    await page.getByText('Using the grid').click()
    await page.getByTitle('IoT Dashboard').click()
})

test('locating child elements', async ({ page }) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()
    await page.locator('nb-card').getByRole('button', { name: "Sign in" }).first().click()
    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('find parent elements', async ({ page }) => {
    await page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('textbox', { name: "Email" }).click()
    await page.locator('nb-card', { has: page.locator("#inputEmail1") }).getByRole('textbox', { name: "Email" }).click()
    await page.locator('nb-card').filter({ hasText: "Basic form" }).getByRole('textbox', { name: "Email" }).click()
    await page.locator('nb-card').filter({ has: page.locator('.status-danger') }).getByRole('textbox', { name: "Password" }).click()
    await page.locator('nb-card').filter({ has: page.locator('nb-checkbox') }).filter({ hasText: "Sign in" })
        .getByRole('textbox', { name: "Email" }).click()
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', { name: "Email" }).click()
})

test('Resuing the locators', async ({ page }) => {
    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" })
    const emailField = basicForm.getByRole('textbox', { name: "Email" })

    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', { name: "Password" }).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@test.com')

})

test('Extracting values', async ({ page }) => {
    //Get single Text value
    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" })
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    //All text values (of multiple elements)
    const allRadioButtonLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonLabels).toContain("Option 1")

    //Input Value ->Value from Textfields not visible in DOM
    const emailField = basicForm.getByRole('textbox', { name: "Email" })
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@test.com')

    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
})

test('assertions',async({page})=>{
    const basicFormButton = page.locator('nb-card').filter({ hasText: "Basic form" }).locator('button')
    //Generic Assertions
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual("Submit")

    //Locator Assertions ->will wait for the expected value/text
    await expect(basicFormButton).toHaveText('Submit')

    //Soft Assertions
    await expect.soft(basicFormButton).toHaveText('Submit5') //Will fail, but test continues
    await basicFormButton.click()
})
import { test, expect } from '@playwright/test'
import { delay } from 'rxjs-compat/operator/delay'

test.beforeEach(async ({ page }, testInfo) => {
    await page.goto('http://localhost:4200/')
})

test.describe('Form Layouts page', () => {
    test.describe.configure({retries:0})
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })
    test('Input fields', async ({ page }) => {
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('textbox', { name: "Email" })
        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@test.com', { delay: 500 })//Simulate Keystrokes
        //Generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')
        //Locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com1') //Need to use toHaveValue not toHaveText
    })
    test('radiobuttons', async ({ page }) => {
        const usingTheGrid = page.locator('nb-card', { hasText: "Using the Grid" })
        //1st Option to select radiobutton
        //await usingTheGrid.getByLabel('Option 1').check({force: true}) //Radiobutton has visually-hidden, then use force: true
        //2nd Option to select radiobutton
        await usingTheGrid.getByRole('radio', { name: "Option 1" }).check({ force: true })
        //1st assertion option
        const radioStatus = await usingTheGrid.getByRole('radio', { name: "Option 1" }).isChecked()
        expect(radioStatus).toBeTruthy()
        //2nd assertion option
        await expect(usingTheGrid.getByRole('radio', { name: "Option 1" })).toBeChecked()
        //Select Option 2 and check that option 1 is NOT selected and option 2 IS selected
        await usingTheGrid.getByRole('radio', { name: "Option 2" }).check({ force: true })
        expect(await usingTheGrid.getByRole('radio', { name: "Option 1" }).isChecked()).toBeFalsy()
        expect(await usingTheGrid.getByRole('radio', { name: "Option 2" }).isChecked()).toBeTruthy()

    })
    test.only('radiobuttons visual', async ({ page }) => {
        const usingTheGridForm = page.locator('nb-card', { hasText: "Using the Grid" })
        await usingTheGridForm.getByRole('radio', { name: "Option 1" }).check({ force: true })
        //1st assertion option
        const radioStatus = await usingTheGridForm.getByRole('radio', { name: "Option 1" }).isChecked()
        await expect(usingTheGridForm).toHaveScreenshot()

    })
})

test('checkboxes', async ({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()
    await page.getByRole('checkbox', { name: "Hide on click" }).click({ force: true })
    //For checkboxes rather use
    await page.getByRole('checkbox', { name: "Hide on click" }).uncheck({ force: true })
    await page.getByRole('checkbox', { name: "Prevent arising of duplicate toast" }).check({ force: true })

    //Check multiple Checboxes
    const allCheckboxes = page.getByRole('checkbox')
    for (const box of await allCheckboxes.all()) {
        await box.check({ force: true })
        expect(await box.isChecked()).toBeTruthy()
    }
    //Check multiple Checboxes
    const allCheckboxesUnchecked = page.getByRole('checkbox')
    for (const box of await allCheckboxesUnchecked.all()) {
        await box.uncheck({ force: true })
        expect(await box.isChecked()).toBeFalsy()
    }
})

test('lists and dropdowns', async ({ page }) => {
    const dropdownMenu = page.locator('ngx-header nb-select')
    await dropdownMenu.click()
    page.getByRole('list')//when the list has a UL Tag
    page.getByRole('listitem')//when the list has a LI Tag

    //const optionList = page.getByRole('list').locator('nb-option') //Option 1
    const optionList = page.locator('nb-option-list nb-option')//Option 2
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({ hasText: "Cosmic" }).click()
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')//Css needs to be exactly as in DOM, including spaces!

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    await dropdownMenu.click()//Open the dropdown before iterating through colors
    for (const color in colors) {
        await optionList.filter({ hasText: color }).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if (color != "Corporate") {
            await dropdownMenu.click()
        }
    }
})

test('tooltips', async ({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()
    //Get Tooltip details by inspect > sources tab > hover over tooltip and press F8 to stop script execution
    //Go back to Elements tab and inspect the tooltip
    const toolTipCard = page.locator('nb-card', { hasText: "Tooltip Placements" })
    await toolTipCard.getByRole('button', { name: "Top" }).hover()

    //page.getByRole('tooltip') //if role tooltip exists
    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual("This is a tooltip")

})

test('browser dialog boxes', async ({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()
    //Browser Dialog boxes are cancelled by Playwright by default
    //Use Dialog Listener
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual("Are you sure you want to delete?")
        dialog.accept()
    })

    await page.getByRole('table').locator('tr', { hasText: "mdo@gmail.com" }).locator('.nb-trash').click()
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})

test('web tables', async ({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //1. Get the row by any text in the row
    const targetRow = page.getByRole('row', { name: "twitter@outlook.com" })
    await targetRow.locator('.nb-edit').click()
    //After clicking the edit button, element is no longer a text, but becomes an input
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    await page.locator('.nb-checkmark').click()

    //2. Get the row based on the value in the specific column
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    //Use filter having another locator within
    const targetByRowId = page.getByRole('row', { name: "11" }).filter({ has: page.locator('td').nth(1).getByText('11') })
    await targetByRowId.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetByRowId.locator('td').nth(5)).toHaveText('test@test.com')

    //3. Test filter of the table
    const ages = ["20", "30", "40", "200"]
    for (let age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)

        const ageRows = page.locator('tbody tr')
        await page.waitForTimeout(500) //Hardcoded timeout to wait for table to reload
        for (let row of await ageRows.all()) {
            const cellValue = await row.locator('td').last().textContent()
            if (age == "200") {
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            } else {
                expect(cellValue).toEqual(age)
            }
        }
    }
})

test('datepicker', async ({ page }) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()
    //Use exact: true that Playwright looks only for 1 and not for 11,12,13 etc as well
    await page.locator('[class="day-cell ng-star-inserted"]').getByText('1', { exact: true }).click()
    expect(calendarInputField).toHaveValue('May 1, 2025')
})

test('datepicker improved', async ({ page }) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    let date = new Date()
    date.setDate(date.getDate() + 150)
    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('En-US', { month: 'short' })
    const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' })
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`

    while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }
    //Use exact: true that Playwright looks only for 1 and not for 11,12,13 etc as well
    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, { exact: true }).click()
    expect(calendarInputField).toHaveValue(dateToAssert)
})

test('sliders', async ({ page }) => {
    //1. Update Attribute
    /*  const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
     await tempGauge.evaluate(node => {
         node.setAttribute('cx', '232.630')
         node.setAttribute('cy', '232.630')
     })
     await tempGauge.click() */

    //2. Mouse Movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()
    const box = await tempBox.boundingBox() //Creates a X/Y coordinate box, starting from top-left with 0
    //Place the mouse in the center of the box
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down() //Simulate click of left mouse button
    await page.mouse.move(x + 100, y)
    await page.mouse.move(x + 100, y + 100)
    await page.mouse.up()
    await expect(tempBox).toContainText('30')

})
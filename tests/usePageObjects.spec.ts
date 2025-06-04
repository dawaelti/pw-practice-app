import { test, expect } from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import {faker} from '@faker-js/faker'
/* import { NavigationPage } from '../page-objects/navigationPage'
import { FormLayoutsPage } from '../page-objects/formLayoutsPage'
import { DatePickerPage } from '../page-objects/datePickerPage' */

test.beforeEach(async ({ page }, testInfo) => {
    await page.goto('http://localhost:4200/')
})

test('navigate to form page @smoke', async ({ page }) => {
    const pm = new PageManager(page)
    //const navigateTo = new NavigationPage(page)
    await pm.navigateTo.formLayoutsPage()
    await pm.navigateTo.datePickerPage()
    await pm.navigateTo.smartTablePage()
    await pm.navigateTo.toastrPage()
    await pm.navigateTo.tooltipPage()
})

test('parametrized methods', async ({ page }) => {
    const pm = new PageManager(page)
/*     const navigateTo = new NavigationPage(page)
    const formLayoutsPage = new FormLayoutsPage(page)
    const datePickerPage = new DatePickerPage(page) */
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ','')}${faker.number.int(1000)}@test.com`

    await pm.navigateTo.formLayoutsPage() //Make screenshot of whole page
    await pm.onFormLayoutsPage.submitusingtheGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 1')
    await page.screenshot({path: 'screenshots/formLayoutsPage.png'}) //Make a screenshot of specific area
    const buffer = await page.screenshot()
    //console.log(buffer.toString('base64')) //Can be used to store the file on remote directory
    await pm.onFormLayoutsPage.submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
    await page.locator('nb-card', { hasText: "Inline form" }).screenshot({path:'screenshots/inlineForm.png'})
    await pm.navigateTo.datePickerPage()
    await pm.onDatePickerPage.selectCommonDatePickerDateFromToday(5)
    //await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(1, 2)
})

test.only('testing with Argos CI', async ({ page }) => {
    const pm = new PageManager(page)
    //const navigateTo = new NavigationPage(page)
    await pm.navigateTo.formLayoutsPage()
    await pm.navigateTo.datePickerPage()
})
import { Locator, Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase{

    //readonly page: Page //Not needed anymore, because using page instance from HelperBase
    //Separate Locators from methods ==>then move to constructor
    readonly formLayoutMenuItem: Locator
    readonly datePickerMenuItem: Locator
    readonly smartTableMenuItem: Locator
    readonly toastrMenuItem: Locator
    readonly tooltipMenuItem: Locator

    constructor(page: Page) {
        super(page) //Use page instance from HelperBase
        //this.page = page
        //Can get over complicated with a lot of Locators!
        this.formLayoutMenuItem = page.getByText('Form Layouts')
        this.datePickerMenuItem = page.getByText('Datepicker')
        this.smartTableMenuItem = page.getByText('Smart Table')
        this.toastrMenuItem = page.getByText('Toastr')
        this.tooltipMenuItem = page.getByText('Tooltip')
    }

    //Method
    async formLayoutsPage() {
        //await this.page.getByText('Forms').click() //Replace this click by private method
        await this.selectGroupMenuItem('Forms')
        await this.formLayoutMenuItem.click()
        await this.waitForNumberOfSeconds(2) //Use Method from HelperBase
    }

    async datePickerPage() {
        await this.selectGroupMenuItem('Forms')
        //await this.page.waitForTimeout(1000)//Fixed timeout
        await this.datePickerMenuItem.click()
    }

    async smartTablePage() {
        await this.selectGroupMenuItem('Tables & Data')
        await this.smartTableMenuItem.click()
    }

    async toastrPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.toastrMenuItem.click()
    }

    async tooltipPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.tooltipMenuItem.click()
    }

    private async selectGroupMenuItem(groupItemTitle: string){
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if(expandedState=="false"){
            await groupMenuItem.click()
        }
    }
}
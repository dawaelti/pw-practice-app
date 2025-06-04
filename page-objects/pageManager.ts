import { Page, expect } from "@playwright/test";
import { NavigationPage } from '../page-objects/navigationPage'
import { FormLayoutsPage } from '../page-objects/formLayoutsPage'
import { DatePickerPage } from '../page-objects/datePickerPage'

export class PageManager {

    private readonly page: Page
    private readonly navigationPage: NavigationPage
    private readonly formLayoustPage: FormLayoutsPage
    private readonly datePickerPage: DatePickerPage

    constructor(page: Page) {
        this.page = page
        this.navigationPage = new NavigationPage(this.page)
        this.formLayoustPage = new FormLayoutsPage(this.page)
        this.datePickerPage = new DatePickerPage(this.page)
    }
    //Add "get" in front of method removes brackets when using them: pm.navigateTo().formLayoutsPage() ->pm.navigateTo.formLayoutsPage()
    get navigateTo(){
        return this.navigationPage
    }

    get onFormLayoutsPage(){
        return this.formLayoustPage
    }

    get onDatePickerPage(){
        return this.datePickerPage
    }
}
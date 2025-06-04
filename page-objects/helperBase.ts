import { Page } from "@playwright/test";

export class HelperBase {

    readonly page: Page //Must not be private in order to extend

    constructor(page: Page) {
        this.page = page
    }
    /*
    Add extends HelperBase to other classes to access helper methods
    */
    async waitForNumberOfSeconds(timeInSeconds: number) {
        await this.page.waitForTimeout(timeInSeconds * 1000)
    }
}
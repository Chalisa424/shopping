import {Page, Locator, expect} from "@playwright/test";

export class AdminOrdersBasePage{
    constructor(public page: Page){}

        row(): Locator {
            return this.page.getByRole('rowgroup').nth(1).getByRole('row');
        }

        async goToPendingTab(){
            await this.page.getByRole("button", {name: "รอการยืนยันคำสั่งซื้อ"}).click();
            await this.page.waitForTimeout(1000); 
        }

        async selectFirstPendingOrder(){
            const row = this.row().first();
            await expect(row).toBeVisible();
            await row.getByRole("checkbox").check();
            await this.page.waitForTimeout(1000); 
            return row;
            
        }

        async openOrderDetail(row: Locator){
            await row.click();
            const detailRow = row.locator("xpath=following-sibling::tr[1]");
            await expect(detailRow).toBeVisible();
            await this.page.waitForTimeout(1000); 
            return detailRow;
            
        }
        
    }

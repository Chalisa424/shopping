import { type Page } from "@playwright/test";

export class ProductListPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async addToCartByIndex(index: number) {
    await this.page.getByRole("button", { name: "เพิ่มไปยังรถเข็น" }).nth(index).click();
    await this.page.waitForTimeout(2000); 

  }

  async openCartFromBadge() {
    await this.page.getByRole("button", { name: "3" }).first().click();
    await this.page.waitForTimeout(2000); 

  }

  
}

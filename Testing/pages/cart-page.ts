import { type Page, expect } from "@playwright/test";

export class CartPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async removeItemByNth(n: number) {

    await this.page.getByRole("button").nth(n).click();
  }

  async checkout() {
    await this.page.getByRole("button", { name: "สั่งสินค้า" }).click();
    await expect(this.page).toHaveURL(/\/my-orders/);
  }
}

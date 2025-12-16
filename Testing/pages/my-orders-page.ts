import { type Page, expect } from "@playwright/test";

export class MyOrdersPage {
  constructor(public page: Page) {}

  async openOrderRowByName(rowName: string) {
    await this.page.getByRole("row", { name: rowName }).click();
  }

  async openOrderDetail() {
    await this.page
      .getByRole("button", { name: "ดูรายละเอียดคำสั่งซื้อ" })
      .click();
    await expect(this.page).toHaveURL(/\/my-orders/);
  }

  async cancelOrderInDetail() {
    const dialog = this.page.getByRole("dialog");

    await dialog.getByRole("button", { name: "ยกเลิกคำสั่งซื้อ" }).click();
    await dialog.getByRole("button", { name: "ยืนยันคำสั่งซื้อ" }).click();
  }
}

import { type Page, expect, Locator } from "@playwright/test";

export class MyOrdersPage {
  constructor(public page: Page) {}

  private dataRows(): Locator {
    return this.page.getByRole("rowgroup").nth(1).getByRole("row");
  }

  private cancellableOrderRow(): Locator {
    return this.dataRows().filter({ hasText: "รอการยืนยันคำสั่งซื้อ" }).first();
  }

  async cancelLatestOrder() {
    const row = this.cancellableOrderRow();
    await expect(row).toBeVisible();

    const orderId = (await row.getByRole("cell").first().innerText()).trim();

    // เปิด detail row
    await row.click();

    const detailRow = row.locator("xpath=following-sibling::tr[1]");
    await expect(detailRow).toContainText("รวมทั้งหมด:");

    const cancelBtn = detailRow.getByRole("button", { name: "ยกเลิกการสั่งซื้อ" });
    await expect(cancelBtn).toBeVisible();

    await Promise.all([
      this.page.waitForResponse(
        (res) =>
          res.url().includes("/api/orders/") &&
          res.request().method() === "PUT" &&
          res.ok()
      ),
      cancelBtn.click(),
    ]);

    await this.page.reload();

    const rowAfter = this.dataRows().filter({ hasText: orderId }).first();
    await expect(rowAfter).toBeVisible();
    await expect(rowAfter).toContainText("ยกเลิกคำสั่งซื้อ");

    await this.page.waitForTimeout(2000); 
  }
}

import { expect } from "@playwright/test";
import { AdminOrdersBasePage } from "./admin-orders-base.ts";

export class AdminOrdersRejectPage extends AdminOrdersBasePage {
  async rejectSelectedOrder() {
    await this.page.getByRole("button", { name: /ปฏิเสธคำสั่งซื้อ/ }).click();
    await this.page.getByRole("button", { name: "ปฏิเสธ", exact: true }).click();

    await this.page.waitForResponse(
      (res) =>
        res.url().includes("/api/orders") &&
        res.request().method() === "PUT" &&
        res.ok()
    );
  }
}

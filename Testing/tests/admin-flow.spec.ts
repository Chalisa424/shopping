import { test } from "@playwright/test";
import { AdminLoginPage } from "../pages2/admin-login-page";
import { AdminOrdersConfirmPage } from "../pages2/admin-orders-confirm.page";
test("admin flow: approve & refuse pending orders", async ({ page }) => {
  const adminLoginPage = new AdminLoginPage(page);
  const confirmPage = new AdminOrdersConfirmPage(page);

  await adminLoginPage.goto();
  await adminLoginPage.login("admin", "1234");

  // confirm
  await confirmPage.goToPendingTab();
  const row1 = await confirmPage.selectFirstPendingOrder();
  await confirmPage.openOrderDetail(row1);
  await confirmPage.approveFirstPendingOrder();

});

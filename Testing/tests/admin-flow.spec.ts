import { test } from "@playwright/test";
import { AdminLoginPage } from "../pages2/admin-login-page";
import { AdminOrdersConfirmPage } from "../pages2/admin-orders-confirm.page";
import { AdminOrdersRejectPage } from "../pages2/admin-orders-reject.page";

test("admin flow: approve & refuse pending orders", async ({ page }) => {
  const adminLoginPage = new AdminLoginPage(page);
  const confirmPage = new AdminOrdersConfirmPage(page);
  const rejectPage = new AdminOrdersRejectPage(page);

  await adminLoginPage.goto();
  await adminLoginPage.login("admin", "1234");

  // confirm
  await confirmPage.goToPendingTab();
  const row1 = await confirmPage.selectFirstPendingOrder();
  await confirmPage.openOrderDetail(row1);
  await confirmPage.approveFirstPendingOrder();

  // reject
  await rejectPage.goToPendingTab();
  const row2 = await rejectPage.selectFirstPendingOrder();
  await rejectPage.openOrderDetail(row2);
  await rejectPage.rejectSelectedOrder();
});

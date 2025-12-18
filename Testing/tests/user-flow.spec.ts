import { test } from "@playwright/test";
import { LoginPage } from "../pages/login-page";
import { ProductListPage} from "../pages/product-list-page";
import { CartPage} from "../pages/cart-page";
import { MyOrdersPage } from "../pages/my-orders-page";

//login => เพิ่มสินค้าลงรถเข็น => เข้า cart ลบ 1 รายการ => สั่งสินค้า => ยกเลิกล่าสุด
test.afterEach(async ({ page }) => {
  const myOrdersPage = new MyOrdersPage(page);

  await page.goto("/my-orders").catch(() => {});

  await myOrdersPage.cancelLatestOrder().catch(() => {});
});

test("user flow", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productListPage = new ProductListPage(page);
  const cartPage = new CartPage(page);
  const myOrdersPage = new MyOrdersPage(page);

  // login
  await loginPage.goto();
  await loginPage.login("user4", "password4");

  // products - เพิ่มไปยังรถเข็น
  await productListPage.addToCartByIndex(1);
  await productListPage.addToCartByIndex(2);
  await productListPage.addToCartByIndex(3);

  // cart - เข้า cart + ลบ + สั่งสินค้า
  await productListPage.openCartFromBadge();
  await cartPage.removeItemByNth(4);
  await cartPage.checkout();

  //my orders - ยกเลิกล่าสุด (ไม่อ้างเลข order)
  await myOrdersPage.cancelLatestOrder();
});

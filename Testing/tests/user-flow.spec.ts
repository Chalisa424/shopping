import { test } from "@playwright/test";
import { LoginPage } from "../pages/login-page";
import { ProductListPage} from "../pages/product-list-page";
import { CartPage} from "../pages/cart-page";
import { MyOrdersPage } from "../pages/my-orders-page";

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

  // my orders - เปิดออเดอร์ + ยกเลิก + รอการยืนยัน
  await myOrdersPage.openOrderRowByName("000019 1 รายการ 1 ชิ้น ฿20");
  await myOrdersPage.openOrderRowByName("000020 2 รายการ 2 ชิ้น ฿157");
  await myOrdersPage.openOrderRowByName("000019 1 รายการ 1 ชิ้น ฿20");

  await myOrdersPage.openOrderDetail();
  await myOrdersPage.cancelOrderInDetail(); 

});

import { expect } from "@playwright/test";
import { AdminOrdersBasePage } from "./admin-orders-base";

export class AdminOrdersConfirmPage extends AdminOrdersBasePage {
    async approveFirstPendingOrder(){       
        await this.page.getByRole("button", {name: /^ยืนยันคำสั่งซื้อ \(\d+\)$/ }).click();
        await this.page.getByRole("button", {name: "ยืนยัน", exact: true }).click();
        
        await this.page.waitForTimeout(2000); 
    }
  }


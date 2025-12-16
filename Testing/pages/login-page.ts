import { type Locator, type Page, expect } from "@playwright/test";

export class LoginPage {
  page: Page;

  usernameInput: Locator;
  passwordInput: Locator;
  loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = this.page.getByRole("textbox", { name: "Enter your username" });
    this.passwordInput = this.page.getByRole("textbox", { name: "Enter your password" });
    this.loginButton = this.page.getByRole("button", { name: "เข้าสู่ระบบ" });
  }

  async goto() {
    await this.page.goto("http://localhost:5173/login");
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    await expect(this.page).toHaveURL(/\/products/);
  }
}

import { expect, Page } from '@playwright/test';

export class SauceDemoPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com');
  }

  async login(username: string, password: string) {
    await this.page.locator('#user-name').fill(username);
    await this.page.locator('#password').fill(password);
    await this.page.locator('#login-button').click();
  }

  async verifyInventory() {
    await expect(this.page).toHaveURL(/inventory.html$/);
  }

  async addFirstNItems(count = 2) {
    const items = this.page.locator('.inventory_item');
    const added: string[] = [];
    const total = await items.count();

    for (let i = 0; i < Math.min(count, total); i++) {
      const item = items.nth(i);
      const name = await item.locator('.inventory_item_name').innerText();
      await item.locator('button').click();
      added.push(name);
    }

    return added;
  }

  async openCart() {
    await this.page.locator('.shopping_cart_link').click();
  }

  async verifyCartItems(expectedItems: string[]) {
    const items = this.page.locator('.cart_item');
    await expect(items).toHaveCount(expectedItems.length);

    for (let i = 0; i < expectedItems.length; i++) {
      await expect(items.nth(i).locator('.inventory_item_name')).toHaveText(expectedItems[i]);
    }
  }

  async checkout(firstName: string, lastName: string, postalCode: string) {
    await this.page.locator('#checkout').click();
    await this.page.locator('#first-name').fill(firstName);
    await this.page.locator('#last-name').fill(lastName);
    await this.page.locator('#postal-code').fill(postalCode);
    await this.page.locator('#continue').click();
    await this.page.locator('#finish').click();
  }

  async verifyOrderSuccess() {
    await expect(this.page.locator('.complete-header')).toHaveText('Thank you for your order!');
    await expect(this.page.locator('.complete-text')).toContainText('Your order has been dispatched');
  }
}

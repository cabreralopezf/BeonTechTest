import { expect, Page } from '@playwright/test';
import { Inventory_Page_URL } from '../constants/loginPageConstants';

export class LoginPage {
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

  async validateInventoryPage() {
    await expect(this.page).toHaveURL(/inventory.html$/);
  }

  async addFirstNInventoryItemsToCart(count = 2) {
    const itemLocators = this.page.locator('.inventory_item');
    const addedItems: string[] = [];
    const itemCount = await itemLocators.count();

    for (let i = 0; i < Math.min(count, itemCount); i += 1) {
      const item = itemLocators.nth(i);
      const title = await item.locator('.inventory_item_name').innerText();
      await item.locator('button').click();
      addedItems.push(title);
    }

    return addedItems;
  }

  async openCart() {
    await this.page.locator('.shopping_cart_link').click();
  }

  async verifyCartItems(expectedItems: string[]) {
    const cartItems = this.page.locator('.cart_item');
    await expect(cartItems).toHaveCount(expectedItems.length);

    for (let i = 0; i < expectedItems.length; ++i) {
      await expect(cartItems.nth(i).locator('.inventory_item_name')).toHaveText(expectedItems[i]);
    }
  }

  async startCheckout({ firstName, lastName, postalCode }: { firstName: string; lastName: string; postalCode: string; }) {
    await this.page.locator('#checkout').click();
    await this.page.locator('#first-name').fill(firstName);
    await this.page.locator('#last-name').fill(lastName);
    await this.page.locator('#postal-code').fill(postalCode);
    await this.page.locator('#continue').click();
  }

  async finalizeCheckout() {
    await this.page.locator('#finish').click();
  }

  async verifyOrderSuccess() {
    await expect(this.page.locator('.complete-header')).toHaveText('Thank you for your order!');
    await expect(this.page.locator('.complete-text')).toContainText('Your order has been dispatched');
  }
}

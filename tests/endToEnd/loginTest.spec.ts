import { test } from '@playwright/test';
import { SauceDemoPage } from '../../pageObjects/sauceDemoPage';
import { Standard_Username, Standard_Password, Checkout_FirstName, Checkout_LastName, Checkout_PostalCode } from '../../constants/loginPageConstants';

test.describe('Sauce Demo critical path checkout', () => {
  test('should login, add two items, checkout, and verify order completion', async ({ page }) => {
    // Initialize the page object for SauceDemo interactions
    const sauceDemoPage = new SauceDemoPage(page);
    await sauceDemoPage.goto();

    // Use standard credentials, with fallbacks just in case
    const user = Standard_Username || 'standard_user';
    const pass = Standard_Password || 'secret_sauce';

    // Log in and confirm we're on the inventory page
    await sauceDemoPage.login(user, pass);
    await sauceDemoPage.verifyInventory();

    // Add the first two available items to cart dynamically
    const addedItems = await sauceDemoPage.addFirstNItems(2);
    await sauceDemoPage.openCart();
    await sauceDemoPage.verifyCartItems(addedItems);

    // Proceed to checkout with test user details
    await sauceDemoPage.checkout(Checkout_FirstName, Checkout_LastName, Checkout_PostalCode);
    await sauceDemoPage.verifyOrderSuccess();
  });
});
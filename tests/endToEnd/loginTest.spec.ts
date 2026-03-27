import { test } from '@playwright/test';
import { SauceDemoPage } from '../../pageObjects/sauceDemoPage';
import { Standard_Username, Standard_Password, Checkout_FirstName, Checkout_LastName, Checkout_PostalCode } from '../../constants/loginPageConstants';

test.describe('Sauce Demo critical path checkout', () => {
  test('should login, add two items, checkout, and verify order completion', async ({ page }) => {
    const sauceDemoPage = new SauceDemoPage(page);
    await sauceDemoPage.goto();

    const user = Standard_Username || 'standard_user';
    const pass = Standard_Password || 'secret_sauce';

    await sauceDemoPage.login(user, pass);
    await sauceDemoPage.verifyInventory();

    const addedItems = await sauceDemoPage.addFirstNItems(2);
    await sauceDemoPage.openCart();
    await sauceDemoPage.verifyCartItems(addedItems);

    await sauceDemoPage.checkout(Checkout_FirstName, Checkout_LastName, Checkout_PostalCode);
    await sauceDemoPage.verifyOrderSuccess();
  });
});
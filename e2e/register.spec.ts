import { test, expect } from '@playwright/test';

test.describe('Registration Page', () => {
  const baseUrl = '/registration';

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
  });

  test('should render registration form', async ({ page }) => {
    await expect(page.locator('[data-testid="username-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="role-select"]')).toBeVisible();
    await expect(page.locator('[data-testid="submit-button"]')).toBeVisible();
  });

  test('should show validation errors when fields are empty', async ({
    page,
  }) => {
    await page.click('[data-testid="submit-button"]');

    const usernameError = page.locator(
      'text=Username must be at least 3 characters'
    );
    const passwordError = page.locator(
      'text=Password must be at least 5 characters'
    );
    const roleError = page.locator('text=Role is required');

    await expect(usernameError).toBeVisible();
    await expect(passwordError).toBeVisible();
    await expect(roleError).toBeVisible();
  });

  test('should submit form successfully with valid data', async ({ page }) => {
    await page.fill('[data-testid="username-input"]', 'testuser');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.locator('[data-testid="role-select"] select').selectOption({
      label: 'Supporter',
    });

    await page.click('[data-testid="submit-button"]');

    // redirected to the home page
    await expect(page).toHaveURL('http://localhost:4000/', { timeout: 10000 });
  });

  test('should show error message if API call fails', async ({ page }) => {
    // mock a server error
    await page.route('/api/register', (route) => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Username is already taken' }),
      });
    });

    await page.fill('[data-testid="username-input"]', 'testuser');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.selectOption('[data-testid="role-select"] select', {
      label: 'Supporter',
    });

    await page.click('[data-testid="submit-button"]');

    const errorMessage = page.locator('[data-testid="error-message"]');
    await expect(errorMessage).toHaveText('Username is already taken');
  });
});

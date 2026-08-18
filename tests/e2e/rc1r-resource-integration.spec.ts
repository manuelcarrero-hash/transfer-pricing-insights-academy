import { expect, test } from '@playwright/test';

test.describe('RC1-R resource integration', () => {
  test('publishes transaction labs and client interview toolkit', async ({ page }) => {
    await page.goto('/resources');

    await page.getByRole('button', { name: 'Labs', exact: true }).click();
    await expect(page.getByText('Transaction Labs Library v1.1')).toBeVisible();
    await expect(page.getByText('Client Onboarding Case Lab v1.0')).toBeVisible();

    await page.getByRole('button', { name: 'Toolkits', exact: true }).click();
    await expect(page.getByText('Client Information Gathering & Interview Toolkit v1.0')).toBeVisible();
  });

  test('client onboarding case lab preserves the eight-phase Nortek practice flow and local progress', async ({ page }) => {
    await page.goto('/labs/client-onboarding');
    await expect(page.getByRole('heading', { name: 'Client Onboarding Case Lab' })).toBeVisible();
    await expect(page.getByText(/Nortek Industrial México/)).toBeVisible();
    await expect(page.getByRole('heading', { name: '8. Client Technical Intake Memo' })).toBeVisible();
    await expect(page.getByText('0 de 54 verificaciones completadas')).toBeVisible();

    const firstCheck = page.getByRole('checkbox').first();
    await firstCheck.check();
    await expect(page.getByText('1 de 54 verificaciones completadas')).toBeVisible();

    await page.reload();
    await expect(page.getByRole('checkbox').first()).toBeChecked();
    await expect(page.getByText('1 de 54 verificaciones completadas')).toBeVisible();
  });
});

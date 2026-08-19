import { expect, test } from '@playwright/test';

test.describe('RC1-R resource integration', () => {
  test('publishes labs and toolkit as distribution downloads without exposing edit URLs', async ({ page }) => {
    await page.goto('/resources');

    await page.getByRole('button', { name: 'Labs', exact: true }).click();

    const transactionLabs = page.locator('article.library-row').filter({ hasText: 'Transaction Labs Library v1.1' });
    await expect(transactionLabs).toBeVisible();
    const transactionDownload = transactionLabs.getByRole('link', { name: 'Descargar laboratorio' });
    await expect(transactionDownload).toHaveAttribute('href', /\/document\/d\/1G7JHrbk88ZHc-5bM_gGJn2bIj6uMkC21SRrsJzXBZ6A\/export\?format=pdf$/);
    await expect(transactionDownload).not.toHaveAttribute('href', /\/edit/);

    const onboardingLab = page.locator('article.library-row').filter({ hasText: 'Client Onboarding Case Lab v1.0' });
    await expect(onboardingLab).toBeVisible();
    const onboardingDownload = onboardingLab.getByRole('link', { name: 'Descargar laboratorio' });
    await expect(onboardingDownload).toHaveAttribute('href', /\/document\/d\/1qEyC8XFGlwBZCy-k4M4Qye5oOiM3VMgp9r5DrSrlpVw\/export\?format=pdf$/);
    await expect(onboardingLab.getByRole('link', { name: 'Abrir versión interactiva' })).toHaveAttribute('href', '/labs/client-onboarding');

    await page.getByRole('button', { name: 'Toolkits', exact: true }).click();
    const toolkit = page.locator('article.library-row').filter({ hasText: 'Client Information Gathering & Interview Toolkit v1.0' });
    await expect(toolkit).toBeVisible();
    const toolkitDownload = toolkit.getByRole('link', { name: 'Descargar toolkit' });
    await expect(toolkitDownload).toHaveAttribute('href', /\/document\/d\/1d6VWPIL67U92uiLNnqqPxUVeA1HHTD3LcChla6u_Syc\/export\?format=pdf$/);
    await expect(toolkitDownload).not.toHaveAttribute('href', /\/edit/);
  });

  test('client onboarding case lab preserves the eight-phase Nortek practice flow and local progress', async ({ page }) => {
    await page.goto('/labs/client-onboarding');
    await expect(page.getByRole('heading', { name: 'Client Onboarding Case Lab' })).toBeVisible();
    await expect(page.getByText('Caso · Nortek Industrial México, S.A. de C.V. (“NIM”)', { exact: true })).toBeVisible();
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

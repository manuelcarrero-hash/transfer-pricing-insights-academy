import { expect, test } from '@playwright/test';

test.describe('Footer and voluntary support smoke', () => {
  test('author links resolve to the institutional author page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Sobre el autor' }).click();
    await expect(page).toHaveURL(/\/autor$/);
    await expect(page.getByRole('heading', { name: 'Manuel Carrero Rojo' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ver perfil en LinkedIn' })).toHaveAttribute('href', /linkedin\.com/);
    await expect(page.getByRole('link', { name: 'Leer Transfer Pricing Insights en Substack' })).toHaveAttribute('href', /substack\.com/);
  });

  test('footer exposes the three approved Stripe support amounts without implying benefits', async ({ page }) => {
    await page.goto('/');
    const support = page.locator('[aria-label="Opciones de apoyo voluntario"]');
    const links = support.getByRole('link');
    await expect(links).toHaveCount(3);

    for (const amount of ['$100 MXN', '$200 MXN', '$500 MXN']) {
      const link = support.getByRole('link', { name: amount });
      await expect(link).toHaveAttribute('href', /^https:\/\/buy\.stripe\.com\//);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }

    await expect(page.getByText('El apoyo voluntario no compra acceso, beneficios ni certificaciones.')).toBeVisible();
  });
});

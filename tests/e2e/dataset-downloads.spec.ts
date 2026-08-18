import { expect, test } from '@playwright/test';

test.describe('Dataset downloads', () => {
  test('all public datasets use independent XLSX export endpoints', async ({ page }) => {
    await page.goto('/resources');
    await page.getByRole('button', { name: 'Datasets', exact: true }).click();

    const c3 = page.locator('article.library-row').filter({ hasText: 'C3 — Dataset TNMM / MTUO v1.0' });
    const c4 = page.locator('article.library-row').filter({ hasText: 'C4 — Dataset Accept / Reject Comparables v1.0' });

    await expect(c3).toBeVisible();
    await expect(c4).toBeVisible();

    await expect(c3.getByRole('link', { name: 'Descargar dataset' })).toHaveAttribute(
      'href',
      'https://docs.google.com/spreadsheets/d/1_1KV_MMz3Ia-3E9KVM7gJS9KhaRod90pXsgjMceL_OY/export?format=xlsx',
    );
    await expect(c4.getByRole('link', { name: 'Descargar dataset' })).toHaveAttribute(
      'href',
      'https://docs.google.com/spreadsheets/d/1IKMvH2vzzhecVmnH3vmx3JndqEM_r3ZogomE8Iq9pAw/export?format=xlsx',
    );
  });
});

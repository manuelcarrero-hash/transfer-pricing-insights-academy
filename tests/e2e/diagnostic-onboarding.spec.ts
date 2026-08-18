import { expect, test } from '@playwright/test';

test.describe('Diagnostic onboarding', () => {
  test('start page exposes diagnostic as a non-credential entry path', async ({ page }) => {
    await page.goto('/start');
    const diagnosticCard = page.locator('article.choice-card').filter({ hasText: 'Ya tengo conocimientos y no sé dónde entrar' });
    await expect(diagnosticCard).toBeVisible();
    await expect(diagnosticCard).toContainText('no una credencial profesional');
    await diagnosticCard.getByRole('link', { name: 'Hacer diagnóstico' }).click();
    await expect(page).toHaveURL(/\/diagnostic$/);
  });

  test('diagnostic presents 40 weighted questions and returns a recommendation', async ({ page }) => {
    await page.goto('/diagnostic');
    await expect(page.getByRole('heading', { name: 'Encuentra dónde te conviene comenzar.' })).toBeVisible();
    await expect(page.getByText('0 / 40')).toBeVisible();
    await expect(page.locator('fieldset.assessment-question')).toHaveCount(40);
    await expect(page.getByRole('button', { name: 'Obtener recomendación de entrada' })).toBeDisabled();

    const fieldsets = page.locator('fieldset.assessment-question');
    for (let index = 0; index < 40; index += 1) {
      await fieldsets.nth(index).getByRole('radio').first().check();
    }

    await page.getByRole('button', { name: 'Obtener recomendación de entrada' }).click();
    await expect(page.getByRole('heading', { name: /Punto de entrada recomendado:/ })).toBeVisible();
    await expect(page.getByText('Esto es una recomendación académica, no una credencial.')).toBeVisible();
    await expect(page.getByText('A. Fundamentos y plena competencia')).toBeVisible();
    await expect(page.getByText('F. Servicios, intangibles, financiamiento y temas avanzados')).toBeVisible();
  });
});

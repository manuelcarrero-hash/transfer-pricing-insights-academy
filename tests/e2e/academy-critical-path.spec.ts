import { expect, test, type Page } from '@playwright/test';

async function seedStorage(page: Page, values: Record<string, string>) {
  await page.addInitScript((entries) => {
    for (const [key, value] of Object.entries(entries)) window.localStorage.setItem(key, value);
  }, values);
}

test.describe('Academy critical path', () => {
  test('onboarding exposes the three real entry points', async ({ page }) => {
    await page.goto('/start');
    await expect(page.getByRole('heading', { name: '¿Cómo quieres comenzar?' })).toBeVisible();

    await page.getByRole('link', { name: 'Comenzar en Junior' }).click();
    await expect(page).toHaveURL(/\/courses\/j1$/);

    await page.goto('/start');
    await page.getByRole('link', { name: 'Abrir Mi Ruta' }).click();
    await expect(page).toHaveURL(/\/path$/);

    await page.goto('/start');
    await page.getByRole('link', { name: 'Explorar Recursos' }).click();
    await expect(page).toHaveURL(/\/resources$/);
  });

  test('deep lesson routes work and persist last visited lesson', async ({ page }) => {
    await page.goto('/courses/j1/lesson/2');
    await expect(page.getByText(/Lección 2 de/)).toBeVisible();

    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('tpia-progress-v1') || '{}'));
    expect(stored.lastLesson).toBe(2);
  });

  test('protected Consultant route redirects when locked and opens when unlocked', async ({ page }) => {
    await page.goto('/courses/c1');
    await expect(page).toHaveURL(/\/path$/);

    await seedStorage(page, { 'tp-consultant-level-unlocked': 'true' });
    await page.goto('/courses/c1');
    await expect(page.getByText('Consultant · C1', { exact: true })).toBeVisible();
  });

  test('Mi Ruta restores Consultant progress from local storage', async ({ page }) => {
    await seedStorage(page, {
      'tp-consultant-level-unlocked': 'true',
      'tpia-course-progress-v1-c1': JSON.stringify({
        curriculumVersion: 'v1',
        courseCode: 'C1',
        lastLesson: 2,
        completedLessons: [1, 2],
        updatedAt: '2026-08-16T12:00:00.000Z',
      }),
    });

    await page.goto('/path');
    const card = page.locator('section.progress-card').filter({ hasText: 'Consultant · C1' });
    await expect(card).toBeVisible();
    await expect(card.getByText(/2 de \d+ lecciones completadas/)).toBeVisible();
    await expect(card.getByText(/Última lección visitada:/)).toContainText('2.');
    await expect(card.getByRole('progressbar')).toHaveAttribute('aria-valuenow', /\d+/);
  });

  test('certificate route is locked without a record and renders a local certificate record when present', async ({ page }) => {
    await page.goto('/junior-foundations/certificate');
    await expect(page.getByRole('heading', { name: 'Tu certificado aún no está disponible' })).toBeVisible();

    await seedStorage(page, {
      'tp-junior-foundations-certificate': JSON.stringify({
        participantName: 'Persona de Prueba',
        issuedAt: '2026-08-16T12:00:00.000Z',
        certificateId: 'TPIA-E2E-001',
      }),
    });
    await page.goto('/junior-foundations/certificate');
    await expect(page.getByText('Persona de Prueba', { exact: true })).toBeVisible();
    await expect(page.getByText(/Local Certificate ID · TPIA-E2E-001/)).toBeVisible();
    await expect(page.getByText(/no dispone de verificación pública centralizada/i)).toBeVisible();
  });

  test('mobile navigation closes after selecting a destination', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const menu = page.locator('details.mobile-nav');
    await page.getByText('Menú', { exact: true }).click();
    await expect(menu).toHaveAttribute('open', '');
    await menu.getByRole('link', { name: 'Recursos' }).click();
    await expect(page).toHaveURL(/\/resources$/);
    await expect(menu).not.toHaveAttribute('open', '');
  });
});

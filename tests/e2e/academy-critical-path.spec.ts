import { expect, test, type Page } from '@playwright/test';

async function seedStorage(page: Page, values: Record<string, string>) {
  await page.addInitScript((entries) => {
    for (const [key, value] of Object.entries(entries)) window.localStorage.setItem(key, value);
  }, values);
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

const j1CorrectAnswers = [
  'No. Con los hechos dados, es una operación entre partes independientes.',
  'Que existe una operación controlada que debe analizarse.',
  '¿Qué condiciones habrían acordado partes independientes en circunstancias comparables?',
  'Obtener los hechos y delimitar la operación antes de seleccionar la metodología.',
  '¿Quién toma las decisiones relevantes para controlar el riesgo y tiene capacidad para hacerlo?',
  'No necesariamente; hay que evaluar si las diferencias son económicamente relevantes y si pueden ajustarse confiablemente.',
  'Elegir el enfoque que produzca el análisis más confiable dadas las circunstancias y la información disponible.',
  'Identificar la información faltante, pedirla y condicionar la conclusión si sigue sin estar disponible.',
];

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
    await expect(page.locator('.lesson-topbar').getByText('Lección 2 de 8', { exact: true })).toBeVisible();
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('tpia-progress-v1') || '{}'));
    expect(stored.lastLesson).toBe(2);
  });

  test('a real formative answer completes J1 lesson 1 and updates Mi Ruta', async ({ page }) => {
    await page.goto('/courses/j1/lesson/1');
    await page.getByLabel(j1CorrectAnswers[0]).check();
    await page.getByRole('button', { name: 'Comprobar' }).click();
    await expect(page.getByRole('status')).toContainText('Correcto.');
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('tpia-progress-v1') || '{}'));
    expect(stored.completedLessons).toContain(1);
    expect(stored.lastLesson).toBe(1);
    await page.goto('/path');
    const card = page.locator('section.progress-card').filter({ hasText: 'Junior · J1' });
    await expect(card.getByText('1 de 8 lecciones completadas.')).toBeVisible();
    await expect(card.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '13');
  });

  test('J1 can be completed end to end through all eight formative checks', async ({ page }) => {
    for (let lesson = 1; lesson <= j1CorrectAnswers.length; lesson += 1) {
      await page.goto(`/courses/j1/lesson/${lesson}`);
      await page.getByLabel(j1CorrectAnswers[lesson - 1]).check();
      await page.getByRole('button', { name: 'Comprobar' }).click();
      await expect(page.getByRole('status')).toContainText('Correcto.');
    }
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('tpia-progress-v1') || '{}'));
    expect(stored.completedLessons).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    await page.goto('/path');
    const card = page.locator('section.progress-card').filter({ hasText: 'Junior · J1' });
    await expect(card.getByText('8 de 8 lecciones completadas.')).toBeVisible();
    await expect(card.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
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
      'tpia-course-progress-v1-c1': JSON.stringify({ curriculumVersion: 'v1', courseCode: 'C1', lastLesson: 2, completedLessons: [1, 2], updatedAt: '2026-08-16T12:00:00.000Z' }),
    });
    await page.goto('/path');
    const card = page.locator('section.progress-card').filter({ hasText: 'Consultant · C1' });
    await expect(card).toBeVisible();
    await expect(card.getByText(/2 de \d+ lecciones completadas/)).toBeVisible();
    await expect(card.getByText(/Última lección visitada:/)).toContainText('2.');
    await expect(card.getByRole('progressbar')).toHaveAttribute('aria-valuenow', /\d+/);
  });

  test('certificate route rejects missing and locally forged certificate records', async ({ page }) => {
    await page.goto('/junior-foundations/certificate');
    await expect(page.getByRole('heading', { name: 'Certificado no disponible o no verificable' })).toBeVisible();

    await seedStorage(page, {
      'tp-junior-foundations-certificate': JSON.stringify({
        participantName: 'Persona de Prueba',
        issuedAt: '2026-08-16T12:00:00.000Z',
        certificateId: 'TPIA-E2E-FORGED',
      }),
    });
    await page.goto('/junior-foundations/certificate');
    await expect(page.getByRole('heading', { name: 'Certificado no disponible o no verificable' })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Persona de Prueba', { exact: true })).toHaveCount(0);
    await expect(page.getByText(/Los certificados válidos deben existir en el registro central/)).toBeVisible();
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

  test('mobile and tablet layouts avoid horizontal overflow on critical pages', async ({ page }) => {
    for (const viewport of [{ width: 320, height: 800 }, { width: 390, height: 844 }, { width: 768, height: 1024 }]) {
      await page.setViewportSize(viewport);
      for (const route of ['/', '/start', '/resources', '/courses/j1', '/courses/j1/lesson/1']) {
        await page.goto(route);
        await expectNoHorizontalOverflow(page);
      }
    }
  });

  test('keyboard users can skip navigation and operate a formative check', async ({ page }) => {
    await page.goto('/courses/j1/lesson/1');
    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: 'Saltar al contenido principal' });
    await expect(skipLink).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();

    const correctOption = page.getByLabel(j1CorrectAnswers[0]);
    await correctOption.focus();
    await page.keyboard.press('Space');
    await expect(correctOption).toBeChecked();
    await page.getByRole('button', { name: 'Comprobar' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toContainText('Correcto.');
  });
});

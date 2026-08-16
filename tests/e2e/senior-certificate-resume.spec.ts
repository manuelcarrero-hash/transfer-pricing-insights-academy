import { expect, test } from '@playwright/test';

test('Senior: approved Capstone result survives navigation to certificate issuance', async ({ page }) => {
  const domains = {
    far: { earned: 10, possible: 10 },
    method: { earned: 10, possible: 10 },
    comparability: { earned: 10, possible: 10 },
    judgment: { earned: 10, possible: 10 },
    other: { earned: 0, possible: 0 },
  };

  await page.addInitScript(({ ab, result }) => {
    localStorage.setItem('tp-senior-final-ab-complete', 'true');
    localStorage.setItem('tp-senior-final-ab-result', JSON.stringify(ab));
    localStorage.setItem('tp-senior-final-result', JSON.stringify(result));
  }, {
    ab: { points: 50, stats: domains },
    result: { capstone: 90, global: 95, domains, passed: true, completedAt: '2026-08-16T12:00:00.000Z' },
  });

  await page.goto('/senior/capstone');

  await expect(page.getByRole('heading', { name: 'Senior-Level aprobado' })).toBeVisible();
  await expect(page.getByLabel('Nombre que aparecerá en el certificado')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Emitir mi certificado' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Calificar cierre Senior-Level' })).toHaveCount(0);
});

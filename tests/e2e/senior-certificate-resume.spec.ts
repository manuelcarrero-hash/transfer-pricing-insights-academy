import { expect, test } from '@playwright/test';

test('Senior: approved authoritative Capstone result resumes at certificate issuance', async ({ page }) => {
  const eligibilityId = 'TPIA-SK-A-E2E12345678';
  await page.route(`**/api/senior/capstone?eligibilityId=${eligibilityId}`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
      eligibilityId, passScore:70, globalPassScore:80, domainFloor:60, decisions:[], alreadyPassed:true,
      priorResult:{ eligibilityId, capstone:90, global:95, finalScore:95, domainScores:{far:90,method:92,comparability:88,judgment:94}, passed:true, credentialEligible:true },
    }) });
  });
  await page.goto(`/senior/capstone?eligibilityId=${eligibilityId}`);
  await expect(page.getByRole('heading', { name: 'Senior-Level aprobado' })).toBeVisible();
  await expect(page.getByLabel('Nombre que aparecerá en el certificado')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Emitir certificado verificable' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Calificar cierre Senior-Level' })).toHaveCount(0);
});

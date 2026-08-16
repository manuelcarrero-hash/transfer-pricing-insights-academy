import { expect, test, type Page } from '@playwright/test';

const visualOnly = process.env.VISUAL_AUDIT === '1';
test.skip(!visualOnly, 'Production visual audit only');

const viewports = [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1440', width: 1440, height: 1000 },
];

const complete = (code: string, count: number) => JSON.stringify({ curriculumVersion: 'v1', courseCode: code, lastLesson: count, completedLessons: Array.from({ length: count }, (_, i) => i + 1), updatedAt: '2026-08-16T12:00:00.000Z' });

const certificateSeed: Record<string, string> = {
  'tp-junior-foundations-certificate': JSON.stringify({ participantName: 'Persona QA Visual', issuedAt: '2026-08-16T12:00:00.000Z', certificateId: 'TPIA-JF-QA' }),
  'tp-practitioner-certificate': JSON.stringify({ participantName: 'Persona QA Visual', issuedAt: '2026-08-16T12:00:00.000Z', certificateId: 'TPIA-TP-QA' }),
  'tp-advanced-practitioner-certificate': JSON.stringify({ participantName: 'Persona QA Visual', issuedAt: '2026-08-16T12:00:00.000Z', certificateId: 'TPIA-ADV-QA' }),
  'tp-senior-knowledge-certificate': JSON.stringify({ participantName: 'Persona QA Visual', issuedAt: '2026-08-16T12:00:00.000Z', certificateId: 'TPIA-SENIOR-QA', score: 91, capstoneScore: 90 }),
};

const advancedPathSeed: Record<string, string> = {
  'tpia-progress-v1': JSON.stringify({ curriculumVersion: 'v1', lastLesson: 8, completedLessons: [1,2,3,4,5,6,7,8], updatedAt: '2026-08-16T12:00:00.000Z' }),
  'tpia-course-progress-v1-j2': complete('J2', 8),
  'tpia-course-progress-v1-j3': complete('J3', 8),
  'tpia-course-progress-v1-j4': complete('J4', 8),
  'tpia-course-progress-v1-j5': complete('J5', 9),
  'tpia-course-progress-v1-c3': complete('C3', 8),
  'tp-consultant-level-unlocked': 'true',
  'tp-practitioner-unlocked': 'true',
  'tp-semi-senior-foundations-complete': 'true',
  'tp-semi-senior-cumulative-passed': 'true',
  'tp-ss6-unlocked': 'true', 'tp-ss7-unlocked': 'true', 'tp-ss8-unlocked': 'true',
  'tp-senior-track-unlocked': 'true',
  'tp-s2-unlocked': 'true', 'tp-s3-unlocked': 'true', 'tp-s4-unlocked': 'true', 'tp-s5-unlocked': 'true', 'tp-s6-unlocked': 'true', 'tp-s7-unlocked': 'true',
  'tp-senior-knowledge-courses-complete': 'true',
  ...certificateSeed,
};

async function seed(page: Page, values: Record<string, string>) {
  await page.addInitScript((entries) => {
    for (const [key, value] of Object.entries(entries)) localStorage.setItem(key, value);
  }, values);
}

async function assertNoHorizontalOverflow(page: Page) {
  const widths = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
  expect(widths.document, JSON.stringify(widths)).toBeLessThanOrEqual(widths.viewport + 1);
  expect(widths.body, JSON.stringify(widths)).toBeLessThanOrEqual(widths.viewport + 1);
}

async function capture(page: Page, viewport: string, name: string, path: string) {
  await page.goto(path, { waitUntil: 'networkidle' });
  await expect(page.locator('main')).toBeVisible();
  await assertNoHorizontalOverflow(page);
  await page.screenshot({ path: `visual-audit/${viewport}/${name}.png`, fullPage: true });
}

async function capturePrint(page: Page, name: string, path: string) {
  await page.goto(path, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.site-header')).toBeHidden();
  await expect(page.locator('.certificate-actions')).toBeHidden();
  await page.screenshot({ path: `visual-audit/print/${name}.png`, fullPage: true });
  await page.emulateMedia({ media: 'screen' });
}

test('capture RC1 production visual audit', async ({ page }) => {
  test.setTimeout(240_000);
  await seed(page, advancedPathSeed);

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    await capture(page, viewport.name, '01-home', '/');
    await capture(page, viewport.name, '02-start', '/start');
    await capture(page, viewport.name, '03-my-path', '/path');
    await capture(page, viewport.name, '04-resources', '/resources');
    await capture(page, viewport.name, '05-j1-course', '/courses/j1');
    await capture(page, viewport.name, '06-j1-lesson', '/courses/j1/lesson/1');
    await capture(page, viewport.name, '07-junior-assessment', '/junior-foundations/assessment');
    await expect(page.getByRole('heading', { name: /Evaluación Acumulativa/ })).toBeVisible();
    await capture(page, viewport.name, '08-c3-assessment', '/courses/c3/assessment');
    await expect(page.getByRole('heading', { name: /Evaluación Final/ })).toBeVisible();
    await capture(page, viewport.name, '09-senior-assessment', '/senior/assessment');
    await capture(page, viewport.name, '10-cert-junior', '/junior-foundations/certificate');
    await capture(page, viewport.name, '11-cert-practitioner', '/practitioner/certificate');
    await capture(page, viewport.name, '12-cert-advanced', '/advanced-practitioner/certificate');
    await capture(page, viewport.name, '13-cert-senior', '/senior/certificate');
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  await capturePrint(page, 'cert-junior-print', '/junior-foundations/certificate');
  await capturePrint(page, 'cert-practitioner-print', '/practitioner/certificate');
  await capturePrint(page, 'cert-advanced-print', '/advanced-practitioner/certificate');
  await capturePrint(page, 'cert-senior-print', '/senior/certificate');
});

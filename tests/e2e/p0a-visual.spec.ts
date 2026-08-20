import { test, expect, type Page } from '@playwright/test';

const viewports = [
  { name: '360', width: 360, height: 800 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 900 },
  { name: '1440', width: 1440, height: 1000 },
] as const;

type VisualRoute = {
  name: string;
  path: string;
  setup?: (page: Page) => Promise<void>;
};

async function seedAdvancedCertificate(page: Page) {
  await page.route('**/api/certificates/*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        valid: true,
        certificateId: 'TPIA-VISUAL-P0F',
        credentialType: 'advanced-practitioner',
        participantName: 'Persona de Prueba',
        levelCode: 'ATP',
        levelName: 'Advanced Transfer Pricing Practitioner',
        issuedAt: '2026-08-18T12:00:00.000Z',
        curriculumVersion: 'v1.0',
        assessmentScore: 94,
        status: 'valid',
      }),
    });
  });
}

const routes: VisualRoute[] = [
  { name: 'home', path: '/' },
  { name: 'start', path: '/start' },
  { name: 'path', path: '/path' },
  { name: 'resources', path: '/resources' },
  { name: 'course-j1', path: '/courses/j1' },
  { name: 'lesson-j1-1', path: '/courses/j1/lesson/1' },
  {
    name: 'assessment-c1',
    path: '/courses/c1/assessment',
    setup: async (page) => {
      await page.addInitScript(() => {
        localStorage.setItem('tpia-course-progress-v1-c1', JSON.stringify({
          curriculumVersion: 'v1',
          courseCode: 'C1',
          lastLesson: 8,
          completedLessons: [1, 2, 3, 4, 5, 6, 7, 8],
          updatedAt: '2026-08-18T12:00:00.000Z',
        }));
      });
    },
  },
  {
    name: 'certificate-advanced',
    path: '/advanced-practitioner/certificate?id=TPIA-VISUAL-P0F',
    setup: seedAdvancedCertificate,
  },
];

for (const viewport of viewports) {
  for (const route of routes) {
    test(`Frontend polish visual ${route.name} ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      if (route.setup) await route.setup(page);
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('html')).toHaveJSProperty('scrollWidth', viewport.width);
      await page.screenshot({
        path: `test-results/p0a-visual/${route.name}-${viewport.name}.png`,
        fullPage: true,
      });
    });
  }
}

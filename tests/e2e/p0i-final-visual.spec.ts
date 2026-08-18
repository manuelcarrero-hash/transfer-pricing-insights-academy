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
  verify?: (page: Page) => Promise<void>;
};

const courseCodes = [
  'J2','J3','J4','J5',
  'C1','C2','C3','C4','C5','C6','C7',
  'SS1','SS2','SS3','SS4','SS5','SS6','SS7','SS8',
  'S1','S2','S3','S4','S5','S6','S7',
] as const;

const unlockFlags = [
  'tp-consultant-level-unlocked',
  'tp-consultant-foundations-complete',
  'tp-consultant-cumulative-objective-passed',
  'tp-practitioner-unlocked',
  'tp-ss2-unlocked','tp-ss3-unlocked','tp-ss4-unlocked','tp-ss5-unlocked','tp-ss6-unlocked','tp-ss7-unlocked','tp-ss8-unlocked',
  'tp-semi-senior-foundations-complete','tp-semi-senior-cumulative-passed','tp-senior-track-unlocked',
  'tp-s2-unlocked','tp-s3-unlocked','tp-s4-unlocked','tp-s5-unlocked','tp-s6-unlocked','tp-s7-unlocked',
] as const;

function seedCourseProgress(page: Page, mode: 'partial' | 'complete') {
  return page.addInitScript(({ codes, flags, state }) => {
    const now = '2026-08-18T12:00:00.000Z';
    if (state === 'partial') {
      localStorage.setItem('tpia-progress-v1', JSON.stringify({
        curriculumVersion: 'v1', lastLesson: 3, completedLessons: [1, 2], updatedAt: now,
      }));
      return;
    }

    localStorage.setItem('tpia-progress-v1', JSON.stringify({
      curriculumVersion: 'v1', lastLesson: 8, completedLessons: [1,2,3,4,5,6,7,8], updatedAt: now,
    }));
    for (const code of codes) {
      localStorage.setItem(`tpia-course-progress-v1-${code.toLowerCase()}`, JSON.stringify({
        curriculumVersion: 'v1', courseCode: code, lastLesson: 20,
        completedLessons: Array.from({ length: 20 }, (_, index) => index + 1), updatedAt: now,
      }));
    }
    for (const flag of flags) localStorage.setItem(flag, 'true');
    localStorage.setItem('tp-junior-foundations-certificate', 'issued');
    localStorage.setItem('tp-practitioner-certificate', JSON.stringify({ participantName:'Persona de Prueba', issuedAt:now, certificateId:'TPIA-P0I-TP' }));
    localStorage.setItem('tp-advanced-practitioner-certificate', JSON.stringify({ participantName:'Persona de Prueba', issuedAt:now, certificateId:'TPIA-P0I-ADV' }));
    localStorage.setItem('tp-senior-knowledge-certificate', JSON.stringify({ participantName:'Persona de Prueba', issuedAt:now, certificateId:'TPIA-P0I-SENIOR', score:94, capstoneScore:92 }));
  }, { codes: courseCodes, flags: unlockFlags, state: mode });
}

async function seedJuniorCertificate(page: Page) {
  await page.route('**/api/certificates/*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        valid: true,
        certificateId: 'TPIA-P0I-JUNIOR',
        participantName: 'Persona de Prueba',
        levelName: 'Transfer Pricing Junior Foundations',
        issuedAt: '2026-08-18T12:00:00.000Z',
        curriculumVersion: 'v1',
        assessmentScore: 94,
        status: 'valid',
      }),
    });
  });
}

function seedLocalCertificate(page: Page, key: string, record: Record<string, unknown>) {
  return page.addInitScript(({ storageKey, value }) => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, { storageKey: key, value: record });
}

const routes: VisualRoute[] = [
  {
    name: 'home', path: '/', verify: async (page) => {
      const support = page.locator('.footer-support-button');
      await expect(support).toHaveCount(3);
      for (let index = 0; index < 3; index += 1) {
        await expect(support.nth(index)).toHaveAttribute('href', /stripe\.com|buy\.stripe\.com|checkout\.stripe\.com/);
      }
    },
  },
  { name: 'start', path: '/start' },
  { name: 'path-empty', path: '/path' },
  { name: 'path-partial', path: '/path', setup: (page) => seedCourseProgress(page, 'partial') },
  { name: 'path-complete', path: '/path', setup: (page) => seedCourseProgress(page, 'complete') },
  { name: 'resources', path: '/resources' },
  { name: 'course-j1', path: '/courses/j1' },
  { name: 'lesson-j1-1', path: '/courses/j1/lesson/1' },
  {
    name: 'assessment-c1', path: '/courses/c1/assessment', setup: async (page) => {
      await page.addInitScript(() => {
        localStorage.setItem('tp-consultant-level-unlocked', 'true');
        localStorage.setItem('tpia-course-progress-v1-c1', JSON.stringify({
          curriculumVersion: 'v1', courseCode: 'C1', lastLesson: 8,
          completedLessons: [1,2,3,4,5,6,7,8], updatedAt: '2026-08-18T12:00:00.000Z',
        }));
      });
    },
  },
  {
    name: 'certificate-junior', path: '/junior-foundations/certificate?id=TPIA-P0I-JUNIOR',
    setup: seedJuniorCertificate,
    verify: async (page) => { await expect(page.locator('.academic-certificate')).toBeVisible(); },
  },
  {
    name: 'certificate-practitioner', path: '/practitioner/certificate', setup: (page) => seedLocalCertificate(page, 'tp-practitioner-certificate', {
      participantName:'Persona de Prueba', issuedAt:'2026-08-18T12:00:00.000Z', certificateId:'TPIA-P0I-TP',
    }),
    verify: async (page) => { await expect(page.locator('.academic-certificate')).toBeVisible(); },
  },
  {
    name: 'certificate-advanced', path: '/advanced-practitioner/certificate', setup: (page) => seedLocalCertificate(page, 'tp-advanced-practitioner-certificate', {
      participantName:'Persona de Prueba', issuedAt:'2026-08-18T12:00:00.000Z', certificateId:'TPIA-P0I-ADV',
    }),
    verify: async (page) => { await expect(page.locator('.academic-certificate')).toBeVisible(); },
  },
  {
    name: 'certificate-senior', path: '/senior/certificate', setup: (page) => seedLocalCertificate(page, 'tp-senior-knowledge-certificate', {
      participantName:'Persona de Prueba', issuedAt:'2026-08-18T12:00:00.000Z', certificateId:'TPIA-P0I-SENIOR', score:94, capstoneScore:92,
    }),
    verify: async (page) => { await expect(page.locator('.academic-certificate')).toBeVisible(); },
  },
];

for (const viewport of viewports) {
  for (const route of routes) {
    test(`P0-I final visual ${route.name} ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      if (route.setup) await route.setup(page);
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('html')).toHaveJSProperty('scrollWidth', viewport.width);
      if (route.verify) await route.verify(page);
      await page.screenshot({
        path: `test-results/p0i-final-visual/${route.name}-${viewport.name}.png`,
        fullPage: true,
      });
    });
  }
}

const printCertificates: VisualRoute[] = routes.filter((route) => route.name.startsWith('certificate-'));
for (const route of printCertificates) {
  test(`P0-I print QA ${route.name}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    if (route.setup) await route.setup(page);
    await page.emulateMedia({ media: 'print' });
    await page.goto(route.path);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.academic-certificate')).toBeVisible();
    await expect(page.locator('.certificate-actions')).toBeHidden();
    await page.screenshot({
      path: `test-results/p0i-final-visual/${route.name}-print.png`,
      fullPage: true,
    });
  });
}

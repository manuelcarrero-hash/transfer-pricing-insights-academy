import { expect, test, type Page } from '@playwright/test';

const courseKeys: Record<string, string> = {
  j1: 'tpia-progress-v1',
  j2: 'tpia-course-progress-v1-j2',
  j3: 'tpia-course-progress-v1-j3',
  j4: 'tpia-course-progress-v1-j4',
  j5: 'tpia-course-progress-v1-j5',
};

async function clearProgress(page: Page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
}

test.describe('RC1-QA Junior learning path', () => {
  for (const course of ['j1', 'j2', 'j3', 'j4', 'j5']) {
    test(`${course.toUpperCase()} blocks direct access to lesson 2 when lesson 1 is incomplete`, async ({ page }) => {
      await clearProgress(page);
      await page.goto(`/courses/${course}/lesson/2`);
      await expect(page).toHaveURL(new RegExp(`/courses/${course}/?$`));
    });
  }

  test('J2 permits lesson 2 after lesson 1 is completed', async ({ page }) => {
    await clearProgress(page);
    await page.evaluate(({ key }) => {
      localStorage.setItem(key, JSON.stringify({
        curriculumVersion: 'v1', courseCode: 'J2', lastLesson: 1,
        completedLessons: [1], updatedAt: new Date().toISOString(),
      }));
    }, { key: courseKeys.j2 });
    await page.goto('/courses/j2/lesson/2');
    await expect(page).toHaveURL(/\/courses\/j2\/lesson\/2/);
    await expect(page.getByText('Lección 2 de 8')).toBeVisible();
  });

  test('formative answer state resets when navigating between lesson checks', async ({ page }) => {
    await clearProgress(page);
    await page.evaluate(({ key }) => {
      localStorage.setItem(key, JSON.stringify({
        curriculumVersion: 'v1', courseCode: 'J2', lastLesson: 2,
        completedLessons: [1, 2], updatedAt: new Date().toISOString(),
      }));
    }, { key: courseKeys.j2 });

    await page.goto('/courses/j2/lesson/2');
    const firstRadio = page.locator('input[type="radio"]').first();
    await firstRadio.check();
    await expect(firstRadio).toBeChecked();
    await page.getByRole('link', { name: /Siguiente lección/ }).click();
    await expect(page).toHaveURL(/\/courses\/j2\/lesson\/3/);
    await expect(page.locator('input[type="radio"]:checked')).toHaveCount(0);
  });

  test('completed J5 surfaces the Junior cumulative assessment CTA', async ({ page }) => {
    await clearProgress(page);
    await page.evaluate(({ key }) => {
      localStorage.setItem(key, JSON.stringify({
        curriculumVersion: 'v1', courseCode: 'J5', lastLesson: 9,
        completedLessons: [1,2,3,4,5,6,7,8,9], updatedAt: new Date().toISOString(),
      }));
    }, { key: courseKeys.j5 });

    await page.goto('/courses/j5');
    const assessmentLink = page.getByRole('link', { name: /Presentar evaluación/ }).first();
    await expect(assessmentLink).toBeVisible();
    await expect(assessmentLink).toHaveAttribute('href', '/junior-foundations/assessment');
  });

  test('J5 final lesson hands off directly to the Junior assessment', async ({ page }) => {
    await clearProgress(page);
    await page.evaluate(({ key }) => {
      localStorage.setItem(key, JSON.stringify({
        curriculumVersion: 'v1', courseCode: 'J5', lastLesson: 8,
        completedLessons: [1,2,3,4,5,6,7,8], updatedAt: new Date().toISOString(),
      }));
    }, { key: courseKeys.j5 });

    await page.goto('/courses/j5/lesson/9');
    const link = page.getByRole('link', { name: /Continuar a evaluación Junior/ });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/junior-foundations/assessment');
  });

  test('completed lesson status is visually separated from its title', async ({ page }) => {
    await clearProgress(page);
    await page.evaluate(({ key }) => {
      localStorage.setItem(key, JSON.stringify({
        curriculumVersion: 'v1', courseCode: 'J5', lastLesson: 1,
        completedLessons: [1], updatedAt: new Date().toISOString(),
      }));
    }, { key: courseKeys.j5 });

    await page.goto('/courses/j5');
    const status = page.locator('.lesson-row small').first();
    await expect(status).toHaveText('Completada');
    await expect(status).toHaveCSS('display', 'block');
  });
});

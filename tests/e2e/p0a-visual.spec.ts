import { test, expect } from '@playwright/test';

const viewports = [
  { name: '360', width: 360, height: 800 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 900 },
  { name: '1440', width: 1440, height: 1000 },
] as const;

const routes = [
  { name: 'home', path: '/' },
  { name: 'path', path: '/path' },
  { name: 'start', path: '/start' },
  { name: 'resources', path: '/resources' },
  { name: 'course-c1', path: '/courses/c1' },
] as const;

for (const viewport of viewports) {
  for (const route of routes) {
    test(`Frontend polish visual ${route.name} ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
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

import { expect, test, type Page } from '@playwright/test';
import { juniorFoundationsBank } from '../../src/content/assessments/juniorFoundations';
import { consultantBank } from '../../src/content/assessments/consultantCumulative';
import { consultantCaseQuestions } from '../../src/content/assessments/consultantCase';
import { semiSeniorBank } from '../../src/content/assessments/semiSeniorCumulative';
import { caseA, caseB } from '../../src/content/assessments/semiSeniorCases';
import { seniorFinalBank, seniorMiniCases } from '../../src/content/assessments/seniorFinal';
import { seniorCapstoneDecisions } from '../../src/content/assessments/seniorCapstone';
import { j2Lessons } from '../../src/content/curriculum/v1/j2';
import { j3Lessons } from '../../src/content/curriculum/v1/j3';
import { j4Lessons } from '../../src/content/curriculum/v1/j4';
import { j5Lessons } from '../../src/content/curriculum/v1/j5';

async function seedStorage(page: Page, values: Record<string, string>) {
  await page.addInitScript((entries) => {
    for (const [key, value] of Object.entries(entries)) window.localStorage.setItem(key, value);
  }, values);
}

async function answerSingleChoice(
  page: Page,
  bank: Array<{ prompt: string; options: string[]; correctIndex: number }>,
  correct = true,
) {
  const fields = page.locator('fieldset.assessment-question');
  for (let i = 0; i < await fields.count(); i += 1) {
    const field = fields.nth(i);
    const text = await field.textContent();
    const question = bank.find((q) => text?.includes(q.prompt));
    if (!question) throw new Error(`No se encontró el reactivo renderizado: ${text?.slice(0, 120)}`);
    const index = correct ? question.correctIndex : (question.correctIndex + 1) % question.options.length;
    await field.getByLabel(question.options[index], { exact: true }).check();
    await expect(field.locator('input:checked')).toHaveCount(1);
  }
}

async function answerMultiChoice(
  page: Page,
  bank: Array<{ prompt: string; options: string[]; correct: number[] }>,
  correct = true,
) {
  const fields = page.locator('fieldset.assessment-question');
  for (let i = 0; i < await fields.count(); i += 1) {
    const field = fields.nth(i);
    const text = await field.textContent();
    const question = bank.find((q) => text?.includes(q.prompt));
    if (!question) throw new Error(`No se encontró la decisión renderizada: ${text?.slice(0, 120)}`);
    const wrongIndex = question.options.findIndex((_, index) => !question.correct.includes(index));
    const chosen = correct ? question.correct : wrongIndex >= 0 ? [wrongIndex] : [question.correct[0]];
    for (const index of chosen) await field.getByLabel(question.options[index], { exact: true }).check();
    await expect(field.locator('input:checked')).toHaveCount(chosen.length);
  }
}

async function expectStorage(page: Page, key: string, value = 'true') {
  await expect.poll(() => page.evaluate((k) => localStorage.getItem(k), key)).toBe(value);
}

async function expectStorageNull(page: Page, key: string) {
  await expect.poll(() => page.evaluate((k) => localStorage.getItem(k), key)).toBeNull();
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

function completeCourse(code: string, lessonCount: number) {
  return JSON.stringify({
    curriculumVersion: 'v1',
    courseCode: code,
    lastLesson: lessonCount,
    completedLessons: Array.from({ length: lessonCount }, (_, i) => i + 1),
    updatedAt: '2026-08-16T12:00:00.000Z',
  });
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

  test('Junior closure supports failure, retry, approval and Consultant unlock', async ({ page }) => {
    test.setTimeout(90_000);
    await seedStorage(page, {
      'tpia-progress-v1': JSON.stringify({ curriculumVersion: 'v1', completedLessons: [1,2,3,4,5,6,7,8], lastLesson: 8, updatedAt: '2026-08-16T12:00:00.000Z' }),
      'tpia-course-progress-v1-j2': completeCourse('J2', j2Lessons.length),
      'tpia-course-progress-v1-j3': completeCourse('J3', j3Lessons.length),
      'tpia-course-progress-v1-j4': completeCourse('J4', j4Lessons.length),
      'tpia-course-progress-v1-j5': completeCourse('J5', j5Lessons.length),
    });
    await page.goto('/junior-foundations/assessment');
    await expect(page.getByRole('button', { name: 'Calificar evaluación' })).toBeVisible();
    await answerSingleChoice(page, juniorFoundationsBank, false);
    await expect(page.getByRole('button', { name: 'Calificar evaluación' })).toBeEnabled();
    await page.getByRole('button', { name: 'Calificar evaluación' }).click();
    await expect(page.getByRole('heading', { name: 'Aún no alcanzas el dominio requerido' })).toBeVisible();
    await expectStorageNull(page, 'tp-consultant-level-unlocked');
    await page.getByRole('button', { name: 'Intentar de nuevo' }).click();
    await answerSingleChoice(page, juniorFoundationsBank, true);
    await expect(page.getByRole('button', { name: 'Calificar evaluación' })).toBeEnabled();
    await page.getByRole('button', { name: 'Calificar evaluación' }).click();
    await expect(page.getByRole('heading', { name: 'Nivel Junior aprobado' })).toBeVisible();
    await expectStorage(page, 'tp-consultant-level-unlocked');
  });

  test('protected Consultant route redirects when locked and opens when unlocked', async ({ page }) => {
    await page.goto('/courses/c1');
    await expect(page).toHaveURL(/\/path$/);
    await seedStorage(page, { 'tp-consultant-level-unlocked': 'true' });
    await page.goto('/courses/c1');
    await expect(page.getByText('Consultant · C1', { exact: true })).toBeVisible();
  });

  test('Consultant closure passes objective, retries a failed case and unlocks Practitioner', async ({ page }) => {
    test.setTimeout(90_000);
    await seedStorage(page, { 'tp-consultant-foundations-complete': 'true' });
    await page.goto('/consultant/assessment');
    await answerSingleChoice(page, consultantBank, true);
    await page.getByRole('button', { name: 'Calificar evaluación' }).click();
    await expect(page.getByRole('heading', { name: 'Componente objetivo aprobado' })).toBeVisible();
    await expectStorage(page, 'tp-consultant-cumulative-objective-passed');
    await page.getByRole('link', { name: 'Resolver caso integrador' }).click();
    await answerMultiChoice(page, consultantCaseQuestions, false);
    await expect(page.getByRole('button', { name: 'Calificar caso integrador' })).toBeEnabled();
    await page.getByRole('button', { name: 'Calificar caso integrador' }).click();
    await expect(page.getByRole('heading', { name: 'Caso integrador por reforzar' })).toBeVisible();
    await page.getByRole('button', { name: 'Intentar de nuevo' }).click();
    await answerMultiChoice(page, consultantCaseQuestions, true);
    await page.getByRole('button', { name: 'Calificar caso integrador' }).click();
    await expect(page.getByRole('heading', { name: 'Caso integrador aprobado' })).toBeVisible();
    await expectStorage(page, 'tp-practitioner-unlocked');
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

  test('Semi Senior closure retries the cumulative exam, passes both cases and unlocks Senior', async ({ page }) => {
    test.setTimeout(120_000);
    await seedStorage(page, { 'tp-semi-senior-foundations-complete': 'true' });
    await page.goto('/semi-senior/assessment');
    await answerSingleChoice(page, semiSeniorBank, false);
    await page.getByRole('button', { name: 'Calificar evaluación' }).click();
    await expect(page.getByRole('heading', { name: 'Hay dominios que necesitan refuerzo' })).toBeVisible();
    await page.getByRole('button', { name: 'Intentar de nuevo' }).click();
    await answerSingleChoice(page, semiSeniorBank, true);
    await page.getByRole('button', { name: 'Calificar evaluación' }).click();
    await expect(page.getByRole('heading', { name: 'Componente acumulativo aprobado' })).toBeVisible();
    await expectStorage(page, 'tp-semi-senior-cumulative-passed');
    await page.getByRole('link', { name: 'Resolver casos avanzados' }).click();
    await answerMultiChoice(page, [...caseA.questions, ...caseB.questions], false);
    await expect(page.getByRole('button', { name: 'Calificar casos avanzados' })).toBeEnabled();
    await page.getByRole('button', { name: 'Calificar casos avanzados' }).click();
    await expect(page.getByRole('heading', { name: 'Uno o más casos requieren refuerzo' })).toBeVisible();
    await page.getByRole('button', { name: 'Intentar de nuevo' }).click();
    await answerMultiChoice(page, [...caseA.questions, ...caseB.questions], true);
    await page.getByRole('button', { name: 'Calificar casos avanzados' }).click();
    await expect(page.getByRole('heading', { name: 'Casos avanzados aprobados' })).toBeVisible();
    await expectStorage(page, 'tp-senior-track-unlocked');
  });

  test('Senior closure enforces Capstone failure, full restart, approval and certificate issuance', async ({ page }) => {
    test.setTimeout(150_000);
    await seedStorage(page, { 'tp-senior-knowledge-courses-complete': 'true' });
    await page.goto('/senior/assessment');
    await answerSingleChoice(page, [...seniorFinalBank, ...seniorMiniCases], true);
    await page.getByRole('button', { name: 'Cerrar Componentes A + B' }).click();
    await expect(page.getByRole('heading', { name: 'Integración técnica completada' })).toBeVisible();
    await page.getByRole('link', { name: 'Continuar al Capstone' }).click();
    await answerSingleChoice(page, seniorCapstoneDecisions, false);
    await expect(page.getByRole('button', { name: 'Calificar cierre Senior-Level' })).toBeEnabled();
    await page.getByRole('button', { name: 'Calificar cierre Senior-Level' }).click();
    await expect(page.getByRole('heading', { name: 'El cierre Senior requiere refuerzo' })).toBeVisible();
    await page.getByRole('button', { name: 'Nuevo intento completo' }).click();
    await expect(page).toHaveURL(/\/senior\/assessment$/);
    await expectStorageNull(page, 'tp-senior-final-ab-complete');
    await answerSingleChoice(page, [...seniorFinalBank, ...seniorMiniCases], true);
    await page.getByRole('button', { name: 'Cerrar Componentes A + B' }).click();
    await page.getByRole('link', { name: 'Continuar al Capstone' }).click();
    await answerSingleChoice(page, seniorCapstoneDecisions, true);
    await expect(page.getByRole('button', { name: 'Calificar cierre Senior-Level' })).toBeEnabled();
    await page.getByRole('button', { name: 'Calificar cierre Senior-Level' }).click();
    await expect(page.getByRole('heading', { name: 'Senior-Level aprobado' })).toBeVisible();
    await page.getByLabel('Nombre que aparecerá en el certificado').fill('Persona Senior E2E');
    await page.getByRole('button', { name: 'Emitir mi certificado' }).click();
    await expect(page).toHaveURL(/\/senior\/certificate$/);
    await expect(page.getByText('Persona Senior E2E', { exact: true })).toBeVisible();
    await expect(page.getByText(/Local Certificate ID/)).toBeVisible();
  });

  test('certificate route is locked without a record and renders a local certificate record when present', async ({ page }) => {
    await page.goto('/junior-foundations/certificate');
    await expect(page.getByRole('heading', { name: 'Tu certificado aún no está disponible' })).toBeVisible();
    await seedStorage(page, { 'tp-junior-foundations-certificate': JSON.stringify({ participantName: 'Persona de Prueba', issuedAt: '2026-08-16T12:00:00.000Z', certificateId: 'TPIA-E2E-001' }) });
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

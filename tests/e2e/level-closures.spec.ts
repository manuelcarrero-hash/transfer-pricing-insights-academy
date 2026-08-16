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

async function seed(page: Page, values: Record<string,string>) {
  await page.addInitScript((entries) => { for (const [k,v] of Object.entries(entries)) localStorage.setItem(k,v); }, values);
}
async function pause(page:Page){await page.waitForTimeout(75)}
async function singles(page:Page, bank:Array<{prompt:string;options:string[];correctIndex:number}>, correct=true){
  const fields=page.locator('fieldset.assessment-question');
  for(let i=0;i<await fields.count();i++){
    const f=fields.nth(i), text=await f.textContent(), q=bank.find(x=>text?.includes(x.prompt));
    if(!q)throw new Error(`Missing bank item: ${text?.slice(0,100)}`);
    const oi=correct?q.correctIndex:(q.correctIndex+1)%q.options.length;
    await f.getByLabel(q.options[oi],{exact:true}).check();await pause(page);
  }
}
async function multis(page:Page, bank:Array<{prompt:string;options:string[];correct:number[]}>) {
  const fields=page.locator('fieldset.assessment-question');
  for(let i=0;i<await fields.count();i++){
    const f=fields.nth(i), text=await f.textContent(), q=bank.find(x=>text?.includes(x.prompt));
    if(!q)throw new Error(`Missing case item: ${text?.slice(0,100)}`);
    for(const ix of q.correct){await f.getByLabel(q.options[ix],{exact:true}).check();await pause(page)}
  }
}
async function failEveryQuestion(page:Page){
  const fields=page.locator('fieldset.assessment-question');
  const total=await fields.count();
  for(let i=0;i<total;i++){
    const f=fields.nth(i);
    await f.locator('input').first().check();
    await pause(page);
    await expect(f.locator('input:checked')).toHaveCount(1);
  }
  await expect(page.locator('.assessment-progress')).toContainText(`${total} / ${total}`);
}
async function enabled(page:Page,name:string){await expect(page.getByRole('button',{name})).toBeEnabled({timeout:10_000})}
async function storage(page:Page,key:string,value='true'){await expect.poll(()=>page.evaluate(k=>localStorage.getItem(k),key)).toBe(value)}
async function storageNull(page:Page,key:string){await expect.poll(()=>page.evaluate(k=>localStorage.getItem(k),key)).toBeNull()}
function complete(code:string,n:number){return JSON.stringify({curriculumVersion:'v1',courseCode:code,lastLesson:n,completedLessons:Array.from({length:n},(_,i)=>i+1),updatedAt:'2026-08-16T12:00:00.000Z'})}

test.describe('Level closures',()=>{
  test('Junior: fail, retry, pass and unlock Consultant',async({page})=>{
    test.setTimeout(90_000);
    await seed(page,{
      'tpia-progress-v1':JSON.stringify({curriculumVersion:'v1',lastLesson:8,completedLessons:[1,2,3,4,5,6,7,8],updatedAt:'2026-08-16T12:00:00.000Z'}),
      'tpia-course-progress-v1-j2':complete('J2',j2Lessons.length),'tpia-course-progress-v1-j3':complete('J3',j3Lessons.length),'tpia-course-progress-v1-j4':complete('J4',j4Lessons.length),'tpia-course-progress-v1-j5':complete('J5',j5Lessons.length)
    });
    await page.goto('/junior-foundations/assessment');await singles(page,juniorFoundationsBank,false);await enabled(page,'Calificar evaluación');await page.getByRole('button',{name:'Calificar evaluación'}).click();
    await expect(page.getByRole('heading',{name:'Aún no alcanzas el dominio requerido'})).toBeVisible();await storageNull(page,'tp-consultant-level-unlocked');
    await page.getByRole('button',{name:'Intentar de nuevo'}).click();await singles(page,juniorFoundationsBank,true);await enabled(page,'Calificar evaluación');await page.getByRole('button',{name:'Calificar evaluación'}).click();
    await expect(page.getByRole('heading',{name:'Nivel Junior aprobado'})).toBeVisible();await storage(page,'tp-consultant-level-unlocked');
  });

  test('Consultant: pass objective, fail/retry case and unlock Practitioner',async({page})=>{
    test.setTimeout(120_000);await seed(page,{'tp-consultant-foundations-complete':'true'});await page.goto('/consultant/assessment');await singles(page,consultantBank,true);await enabled(page,'Calificar evaluación');await page.getByRole('button',{name:'Calificar evaluación'}).click();
    await expect(page.getByRole('heading',{name:'Componente objetivo aprobado'})).toBeVisible();await page.getByRole('link',{name:'Resolver caso integrador'}).click();
    await failEveryQuestion(page);await enabled(page,'Calificar caso integrador');await page.getByRole('button',{name:'Calificar caso integrador'}).click();await expect(page.getByRole('heading',{name:'Caso integrador por reforzar'})).toBeVisible();
    await page.getByRole('button',{name:'Intentar de nuevo'}).click();await multis(page,consultantCaseQuestions);await enabled(page,'Calificar caso integrador');await page.getByRole('button',{name:'Calificar caso integrador'}).click();await expect(page.getByRole('heading',{name:'Caso integrador aprobado'})).toBeVisible();await storage(page,'tp-practitioner-unlocked');
  });

  test('Semi Senior: fail/retry cumulative, fail/retry cases and unlock Senior',async({page})=>{
    test.setTimeout(150_000);await seed(page,{'tp-semi-senior-foundations-complete':'true'});await page.goto('/semi-senior/assessment');await singles(page,semiSeniorBank,false);await enabled(page,'Calificar evaluación');await page.getByRole('button',{name:'Calificar evaluación'}).click();await expect(page.getByRole('heading',{name:'Hay dominios que necesitan refuerzo'})).toBeVisible();
    await page.getByRole('button',{name:'Intentar de nuevo'}).click();await singles(page,semiSeniorBank,true);await enabled(page,'Calificar evaluación');await page.getByRole('button',{name:'Calificar evaluación'}).click();await expect(page.getByRole('heading',{name:'Componente acumulativo aprobado'})).toBeVisible();await page.getByRole('link',{name:'Resolver casos avanzados'}).click();
    const bank=[...caseA.questions,...caseB.questions];await failEveryQuestion(page);await enabled(page,'Calificar casos avanzados');await page.getByRole('button',{name:'Calificar casos avanzados'}).click();await expect(page.getByRole('heading',{name:'Uno o más casos requieren refuerzo'})).toBeVisible();
    await page.getByRole('button',{name:'Intentar de nuevo'}).click();await multis(page,bank);await enabled(page,'Calificar casos avanzados');await page.getByRole('button',{name:'Calificar casos avanzados'}).click();await expect(page.getByRole('heading',{name:'Casos avanzados aprobados'})).toBeVisible();await storage(page,'tp-senior-track-unlocked');
  });

  test('Senior: fail Capstone, restart all, pass and issue certificate',async({page})=>{
    test.setTimeout(180_000);await seed(page,{'tp-senior-knowledge-courses-complete':'true'});await page.goto('/senior/assessment');await singles(page,[...seniorFinalBank,...seniorMiniCases],true);await enabled(page,'Cerrar Componentes A + B');await page.getByRole('button',{name:'Cerrar Componentes A + B'}).click();await page.getByRole('link',{name:'Continuar al Capstone'}).click();
    await failEveryQuestion(page);await enabled(page,'Calificar cierre Senior-Level');await page.getByRole('button',{name:'Calificar cierre Senior-Level'}).click();await expect(page.getByRole('heading',{name:'El cierre Senior requiere refuerzo'})).toBeVisible();await page.getByRole('button',{name:'Nuevo intento completo'}).click();await storageNull(page,'tp-senior-final-ab-complete');
    await singles(page,[...seniorFinalBank,...seniorMiniCases],true);await enabled(page,'Cerrar Componentes A + B');await page.getByRole('button',{name:'Cerrar Componentes A + B'}).click();await page.getByRole('link',{name:'Continuar al Capstone'}).click();await singles(page,seniorCapstoneDecisions,true);await enabled(page,'Calificar cierre Senior-Level');await page.getByRole('button',{name:'Calificar cierre Senior-Level'}).click();await expect(page.getByRole('heading',{name:'Senior-Level aprobado'})).toBeVisible();
    await page.getByLabel('Nombre que aparecerá en el certificado').fill('Persona Senior E2E');await page.getByRole('button',{name:'Emitir mi certificado'}).click();await expect(page).toHaveURL(/\/senior\/certificate$/);await expect(page.getByText('Persona Senior E2E',{exact:true})).toBeVisible();
  });
});

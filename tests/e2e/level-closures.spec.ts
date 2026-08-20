import { expect, test, type Page } from '@playwright/test';
import { bank as juniorFoundationsBank } from '../../functions/_lib/juniorBank';
import { consultantBank, practitionerCaseFacts, practitionerCaseQuestions } from '../../functions/_lib/practitionerBank';
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
  await expect(fields.first()).toBeVisible();
  for(let i=0;i<await fields.count();i++){
    const f=fields.nth(i), text=await f.textContent(), q=bank.find(x=>text?.includes(x.prompt));
    if(!q)throw new Error(`Missing bank item: ${text?.slice(0,100)}`);
    const oi=correct?q.correctIndex:(q.correctIndex+1)%q.options.length;
    await f.getByLabel(q.options[oi],{exact:true}).check();await pause(page);
  }
}
async function multis(page:Page, bank:Array<{prompt:string;options:string[];correct:number[]}>) {
  const fields=page.locator('fieldset.assessment-question');
  await expect(fields.first()).toBeVisible();
  for(let i=0;i<await fields.count();i++){
    const f=fields.nth(i), text=await f.textContent(), q=bank.find(x=>text?.includes(x.prompt));
    if(!q)throw new Error(`Missing case item: ${text?.slice(0,100)}`);
    for(const ix of q.correct){await f.getByLabel(q.options[ix],{exact:true}).check();await pause(page)}
  }
}
async function failEveryQuestion(page:Page){
  const fields=page.locator('fieldset.assessment-question');
  await expect(fields.first()).toBeVisible();
  const total=await fields.count();
  expect(total).toBeGreaterThan(0);
  for(let i=0;i<total;i++){
    const f=fields.nth(i);
    await f.locator('input').first().check();
    await pause(page);
    await expect(f.locator('input:checked')).toHaveCount(1);
  }
  for(let i=0;i<total;i++) await expect(fields.nth(i).locator('input:checked')).toHaveCount(1);
}
async function enabled(page:Page,name:string){await expect(page.getByRole('button',{name})).toBeEnabled({timeout:10_000})}
async function storage(page:Page,key:string,value='true'){await expect.poll(()=>page.evaluate(k=>localStorage.getItem(k),key)).toBe(value)}
async function storageNull(page:Page,key:string){await expect.poll(()=>page.evaluate(k=>localStorage.getItem(k),key)).toBeNull()}
function complete(code:string,n:number){return JSON.stringify({curriculumVersion:'v1',courseCode:code,lastLesson:n,completedLessons:Array.from({length:n},(_,i)=>i+1),updatedAt:'2026-08-16T12:00:00.000Z'})}

async function mockJuniorApi(page: Page) {
  let gradeCalls = 0;
  const questions = juniorFoundationsBank.slice(0,20).map(({correctIndex: _correctIndex, ...question}) => question);
  await page.route('**/api/junior/attempt', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ attemptId: `TPIA-JA-E2E-${gradeCalls}`, expiresAt: '2099-01-01T00:00:00.000Z', questions }) });
  });
  await page.route('**/api/junior/grade', async (route) => {
    gradeCalls += 1;
    const passed = gradeCalls > 1;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ attemptId: `TPIA-JA-E2E-${gradeCalls-1}`, score: passed ? 100 : 0, passed, domainScores: { 'Fundamentos': passed ? 100 : 0, "Arm's Length / delimitación": passed ? 100 : 0, 'FAR': passed ? 100 : 0, 'Métodos': passed ? 100 : 0, 'Comparabilidad': passed ? 100 : 0 }, correct: passed ? 20 : 0, total: 20, gradedAt: '2026-08-17T12:00:00.000Z' }) });
  });
}

async function mockPractitionerApi(page: Page) {
  const eligibilityId='TPIA-PA-E2E-AUTHORITATIVE';
  const assessmentQuestions=consultantBank.slice(0,24).map(({correctIndex:_correctIndex,feedback:_feedback,...question})=>question);
  let caseGradeCalls=0;
  await page.route('**/api/practitioner/attempt',async route=>{
    await route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({attemptId:eligibilityId,expiresAt:'2099-01-01T00:00:00.000Z',questions:assessmentQuestions})});
  });
  await page.route('**/api/practitioner/grade',async route=>{
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({eligibilityId,attemptId:eligibilityId,score:100,passed:true,passedGlobal:true,passedDomains:true,domains:{C1:100,C2:100,C3:100,C4:100,C5:100,C6:100,C7:100},correct:24,total:24,gradedAt:'2026-08-20T12:00:00.000Z'})});
  });
  await page.route('**/api/practitioner/case?*',async route=>{
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({eligibilityId,facts:practitionerCaseFacts,passScore:80,alreadyPassed:false,priorResult:null,questions:practitionerCaseQuestions.map(({id,domain,prompt,options,correct})=>({id,domain,prompt,options,multiple:correct.length>1}))})});
  });
  await page.route('**/api/practitioner/case',async route=>{
    if(route.request().method()!=='POST'){await route.fallback();return;}
    caseGradeCalls+=1;
    const passed=caseGradeCalls>1;
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({eligibilityId,score:passed?100:0,correct:passed?12:0,total:12,passed,gradedAt:'2026-08-20T12:05:00.000Z',credentialEligible:passed,feedback:practitionerCaseQuestions.map(q=>({id:q.id,domain:q.domain,correct:passed,explanation:q.explanation}))})});
  });
}

async function mockAdvancedPractitionerApi(page: Page) {
  const eligibilityId='TPIA-ATP-A-E2E-AUTHORITATIVE';
  const assessmentQuestions=semiSeniorBank.slice(0,24).map(({correctIndex:_correctIndex,feedback:_feedback,...question})=>question);
  let assessmentGradeCalls=0;
  let caseGradeCalls=0;
  await page.route('**/api/advanced-practitioner/attempt',async route=>{
    await route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({attemptId:eligibilityId,expiresAt:'2099-01-01T00:00:00.000Z',questions:assessmentQuestions})});
  });
  await page.route('**/api/advanced-practitioner/grade',async route=>{
    assessmentGradeCalls+=1;
    const passed=assessmentGradeCalls>1;
    const domainScore=passed?100:0;
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({eligibilityId,attemptId:eligibilityId,score:domainScore,passed,passedGlobal:passed,passedDomains:passed,domains:{SERVICES:domainScore,DEMPE:domainScore,FINANCE:domainScore,RESTRUCTURING:domainScore,CCA:domainScore,CONTROVERSY:domainScore},correct:passed?24:0,total:24,gradedAt:'2026-08-20T12:10:00.000Z'})});
  });
  await page.route('**/api/advanced-practitioner/cases?*',async route=>{
    const publicCase=(c:typeof caseA)=>({title:c.title,facts:c.facts,questions:c.questions.map(({id,domain,prompt,options,correct})=>({id,domain,prompt,options,multiple:correct.length>1}))});
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({eligibilityId,passScore:80,caseA:publicCase(caseA),caseB:publicCase(caseB),alreadyPassed:false,priorResult:{a:null,b:null}})});
  });
  await page.route('**/api/advanced-practitioner/cases',async route=>{
    if(route.request().method()!=='POST'){await route.fallback();return;}
    caseGradeCalls+=1;
    const passed=caseGradeCalls>1;
    const score=passed?100:0;
    const all=[...caseA.questions,...caseB.questions];
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({eligibilityId,a:{score,passed},b:{score,passed},passed,credentialEligible:passed,gradedAt:'2026-08-20T12:15:00.000Z',feedback:all.map(q=>({id:q.id,domain:q.domain,correct:passed,explanation:q.explanation}))})});
  });
}

async function mockSeniorApi(page: Page) {
  let attemptCalls=0;
  let capstoneGradeCalls=0;
  const questions=seniorFinalBank.slice(0,20);
  const cases=seniorMiniCases.slice(0,4);
  const stats={far:{earned:10,possible:10},method:{earned:10,possible:10},comparability:{earned:10,possible:10},judgment:{earned:10,possible:10},other:{earned:0,possible:0}};
  await page.addInitScript(()=>{
    (window as unknown as {turnstile?:{render:(element:HTMLElement,options:{callback:(token:string)=>void})=>string;remove:()=>void}}).turnstile={render:(_element,options)=>{setTimeout(()=>options.callback('e2e-turnstile-token'),0);return'e2e-widget';},remove:()=>{}};
    const script=document.createElement('script');script.dataset.tpiaTurnstile='true';document.head.appendChild(script);
  });
  await page.route('**/api/senior/attempt',async route=>{
    attemptCalls+=1;const attemptId=`TPIA-SK-A-E2E-${attemptCalls}`;
    await route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({attemptId,expiresAt:'2099-01-01T00:00:00.000Z',questions,cases})});
  });
  await page.route('**/api/senior/grade',async route=>{
    const body=await route.request().postDataJSON() as{attemptId:string};
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({eligibilityId:body.attemptId,aScore:100,bScore:100,points:50,abScore:100,stats,completed:true,gradedAt:'2026-08-20T12:20:00.000Z'})});
  });
  await page.route('**/api/senior/capstone?*',async route=>{
    const eligibilityId=new URL(route.request().url()).searchParams.get('eligibilityId');
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({eligibilityId,passScore:70,globalPassScore:80,domainFloor:60,decisions:seniorCapstoneDecisions,alreadyPassed:false,priorResult:null})});
  });
  await page.route('**/api/senior/capstone',async route=>{
    if(route.request().method()!=='POST'){await route.fallback();return;}
    capstoneGradeCalls+=1;const body=await route.request().postDataJSON() as{eligibilityId:string};const passed=capstoneGradeCalls>1;const score=passed?100:40;
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({eligibilityId:body.eligibilityId,capstone:score,global:passed?100:70,finalScore:passed?100:70,domainScores:{far:passed?100:50,method:passed?100:50,comparability:passed?100:50,judgment:passed?100:50},passed,credentialEligible:passed})});
  });
  await page.route('**/api/certificates/issue',async route=>{
    const body=await route.request().postDataJSON() as{participantName:string};
    await route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({certificateId:'TPIA-SK-20260820-E2E00000001',credentialType:'senior-knowledge',participantName:body.participantName})});
  });
  await page.route('**/api/certificates/TPIA-SK-20260820-E2E00000001',async route=>{
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({valid:true,certificateId:'TPIA-SK-20260820-E2E00000001',credentialType:'senior-knowledge',participantName:'Persona Senior E2E',levelCode:'SK',levelName:'Senior-Level Transfer Pricing Knowledge',issuedAt:'2026-08-20T12:30:00.000Z',curriculumVersion:'v1.0',assessmentScore:100,status:'valid'})});
  });
}

test.describe('Level closures',()=>{
  test('Junior: fail, retry, pass and unlock Consultant',async({page})=>{
    test.setTimeout(90_000);
    await mockJuniorApi(page);
    await seed(page,{
      'tpia-progress-v1':JSON.stringify({curriculumVersion:'v1',lastLesson:8,completedLessons:[1,2,3,4,5,6,7,8],updatedAt:'2026-08-16T12:00:00.000Z'}),
      'tpia-course-progress-v1-j2':complete('J2',j2Lessons.length),'tpia-course-progress-v1-j3':complete('J3',j3Lessons.length),'tpia-course-progress-v1-j4':complete('J4',j4Lessons.length),'tpia-course-progress-v1-j5':complete('J5',j5Lessons.length)
    });
    await page.goto('/junior-foundations/assessment');await singles(page,juniorFoundationsBank,false);await enabled(page,'Calificar evaluación');await page.getByRole('button',{name:'Calificar evaluación'}).click();
    await expect(page.getByRole('heading',{name:'Aún no alcanzas el dominio requerido'})).toBeVisible();await storageNull(page,'tp-consultant-level-unlocked');
    await page.getByRole('button',{name:'Intentar de nuevo'}).click();await singles(page,juniorFoundationsBank,true);await enabled(page,'Calificar evaluación');await page.getByRole('button',{name:'Calificar evaluación'}).click();
    await expect(page.getByRole('heading',{name:'Nivel Junior aprobado'})).toBeVisible();await storage(page,'tp-consultant-level-unlocked');
  });

  test('Consultant: authoritative objective, fail/retry case and unlock Practitioner',async({page})=>{
    test.setTimeout(120_000);await mockPractitionerApi(page);await seed(page,{'tp-consultant-foundations-complete':'true'});await page.goto('/consultant/assessment');await singles(page,consultantBank,true);await enabled(page,'Calificar evaluación');await page.getByRole('button',{name:'Calificar evaluación'}).click();
    await expect(page.getByRole('heading',{name:'Componente objetivo aprobado'})).toBeVisible();await storage(page,'tp-practitioner-eligibility-id','TPIA-PA-E2E-AUTHORITATIVE');await page.getByRole('link',{name:'Resolver caso integrador'}).click();
    await failEveryQuestion(page);await enabled(page,'Calificar caso integrador');await page.getByRole('button',{name:'Calificar caso integrador'}).click();await expect(page.getByRole('heading',{name:'Caso integrador por reforzar'})).toBeVisible();
    await page.getByRole('button',{name:'Intentar de nuevo'}).click();await multis(page,practitionerCaseQuestions);await enabled(page,'Calificar caso integrador');await page.getByRole('button',{name:'Calificar caso integrador'}).click();await expect(page.getByRole('heading',{name:'Caso integrador aprobado'})).toBeVisible();await storage(page,'tp-practitioner-unlocked');
  });

  test('Semi Senior: fail/retry cumulative, fail/retry cases and unlock Senior',async({page})=>{
    test.setTimeout(150_000);await mockAdvancedPractitionerApi(page);await seed(page,{'tp-semi-senior-foundations-complete':'true'});await page.goto('/semi-senior/assessment');await singles(page,semiSeniorBank,false);await enabled(page,'Calificar evaluación');await page.getByRole('button',{name:'Calificar evaluación'}).click();await expect(page.getByRole('heading',{name:'Hay dominios que necesitan refuerzo'})).toBeVisible();
    await page.getByRole('button',{name:'Intentar de nuevo'}).click();await singles(page,semiSeniorBank,true);await enabled(page,'Calificar evaluación');await page.getByRole('button',{name:'Calificar evaluación'}).click();await expect(page.getByRole('heading',{name:'Componente acumulativo aprobado'})).toBeVisible();await storage(page,'tp-advanced-practitioner-eligibility-id','TPIA-ATP-A-E2E-AUTHORITATIVE');await page.getByRole('link',{name:'Resolver casos avanzados'}).click();
    const bank=[...caseA.questions,...caseB.questions];await failEveryQuestion(page);await enabled(page,'Calificar casos avanzados');await page.getByRole('button',{name:'Calificar casos avanzados'}).click();await expect(page.getByRole('heading',{name:'Uno o más casos requieren refuerzo'})).toBeVisible();
    await page.getByRole('button',{name:'Intentar de nuevo'}).click();await multis(page,bank);await enabled(page,'Calificar casos avanzados');await page.getByRole('button',{name:'Calificar casos avanzados'}).click();await expect(page.getByRole('heading',{name:'Casos avanzados aprobados'})).toBeVisible();await storage(page,'tp-senior-track-unlocked');
  });

  test('Senior: authoritative A+B, fail Capstone, restart all, pass and issue certificate',async({page})=>{
    test.setTimeout(180_000);await mockSeniorApi(page);await seed(page,{'tp-senior-knowledge-courses-complete':'true'});await page.goto('/senior/assessment');await failEveryQuestion(page);await enabled(page,'Cerrar Componentes A + B');await page.getByRole('button',{name:'Cerrar Componentes A + B'}).click();await page.getByRole('link',{name:'Continuar al Capstone'}).click();
    await failEveryQuestion(page);await enabled(page,'Calificar cierre Senior-Level');await page.getByRole('button',{name:'Calificar cierre Senior-Level'}).click();await expect(page.getByRole('heading',{name:'El cierre Senior requiere refuerzo'})).toBeVisible();await page.getByRole('link',{name:'Nuevo intento completo'}).click();
    await expect(page).toHaveURL(/\/senior\/assessment$/);await failEveryQuestion(page);await enabled(page,'Cerrar Componentes A + B');await page.getByRole('button',{name:'Cerrar Componentes A + B'}).click();await page.getByRole('link',{name:'Continuar al Capstone'}).click();await failEveryQuestion(page);await enabled(page,'Calificar cierre Senior-Level');await page.getByRole('button',{name:'Calificar cierre Senior-Level'}).click();await expect(page.getByRole('heading',{name:'Senior-Level aprobado'})).toBeVisible();
    await page.getByLabel('Nombre que aparecerá en el certificado').fill('Persona Senior E2E');await enabled(page,'Emitir certificado verificable');await page.getByRole('button',{name:'Emitir certificado verificable'}).click();await expect(page).toHaveURL(/\/senior\/certificate\?id=TPIA-SK-20260820-E2E00000001$/);await expect(page.getByText('Persona Senior E2E',{exact:true})).toBeVisible();
  });
});
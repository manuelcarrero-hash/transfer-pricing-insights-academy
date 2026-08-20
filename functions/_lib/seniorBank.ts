import { seniorFinalBank, seniorMiniCases, type MiniCase, type SeniorDomain, type SeniorQuestion } from '../../src/content/assessments/seniorFinal';
import { seniorCapstoneDecisions, type CapstoneDecision } from '../../src/content/assessments/seniorCapstone';

export const SENIOR_OBJECTIVE_SIZE = 20;
export const SENIOR_MINICASE_SIZE = 4;
export const SENIOR_PASS_SCORE = 80;
export const CAPSTONE_PASS_SCORE = 70;
export const SENIOR_DOMAIN_FLOOR = 60;

export const seniorObjectiveAnswers: Record<number, number> = {
  1:1,2:1,3:0,4:0,5:1,6:1,7:1,8:0,9:1,10:1,
  11:1,12:0,13:1,14:0,15:1,16:1,17:0,18:1,19:0,20:1,
  21:1,22:0,23:0,24:1,25:0,26:1,27:1,28:0,29:1,30:0,
};

export const seniorMiniCaseAnswers: Record<string, number> = {
  loss:1, method:1, range:1, wca:1, restructuring:1, services:1,
};

export const seniorCapstoneAnswers: Record<string, number> = {
  c1:1,c2:1,c3:1,c4:2,c5:2,c6:1,c7:1,c8:2,c9:1,c10:2,
  c11:1,c12:1,c13:1,c14:1,c15:1,c16:1,c17:2,c18:2,c19:2,c20:2,
};

function randomInt(maxExclusive: number) {
  if (maxExclusive <= 1) return 0;
  const range = 0x100000000;
  const limit = range - (range % maxExclusive);
  const values = new Uint32Array(1);
  do crypto.getRandomValues(values); while (values[0] >= limit);
  return values[0] % maxExclusive;
}

export function shuffle<T>(items: readonly T[]) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pickQuestions(domain: SeniorDomain, count: number) {
  return shuffle(seniorFinalBank.filter((q) => q.domain === domain)).slice(0, count);
}

function pickMiniCase(domain: SeniorDomain) {
  return shuffle(seniorMiniCases.filter((q) => q.domain === domain))[0];
}

export function buildSeniorAttempt() {
  const questions = shuffle([
    ...pickQuestions('far', 2),
    ...pickQuestions('method', 4),
    ...pickQuestions('comparability', 5),
    ...pickQuestions('judgment', 5),
    ...pickQuestions('other', 4),
  ]).slice(0, SENIOR_OBJECTIVE_SIZE);
  const cases = shuffle((['far','method','comparability','judgment'] as SeniorDomain[])
    .map(pickMiniCase).filter((q): q is MiniCase => Boolean(q))).slice(0, SENIOR_MINICASE_SIZE);
  return { questions, cases };
}

export function publicQuestion(q: SeniorQuestion) {
  return { id:q.id, prompt:q.prompt, options:q.options, domain:q.domain };
}
export function publicMiniCase(q: MiniCase) {
  return { id:q.id, title:q.title, prompt:q.prompt, options:q.options, domain:q.domain };
}
export function publicCapstoneDecision(q: CapstoneDecision) {
  return { id:q.id, section:q.section, prompt:q.prompt, options:q.options, domain:q.domain, weight:q.weight };
}
export { seniorCapstoneDecisions };

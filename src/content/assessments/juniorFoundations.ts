export type JuniorDomain = 'Fundamentos' | "Arm's Length / delimitación" | 'FAR' | 'Métodos' | 'Comparabilidad';
export type JuniorQuestion = { id: number; domain: JuniorDomain; prompt: string; options: string[] };

export const JUNIOR_ATTEMPT_SIZE = 20;
export const JUNIOR_PASS_SCORE = 80;
export const JUNIOR_DOMAIN_FLOOR = 60;
export const juniorDomains: JuniorDomain[] = ['Fundamentos', "Arm's Length / delimitación", 'FAR', 'Métodos', 'Comparabilidad'];

export type ConsultantDomain='C1'|'C2'|'C3'|'C4'|'C5'|'C6'|'C7';
export type ConsultantQuestion={id:number;domain:ConsultantDomain;prompt:string;options:string[]};
export const CONSULTANT_PASS_SCORE=80;
export const CONSULTANT_DOMAIN_FLOOR=60;
export const consultantLabels:Record<ConsultantDomain,string>={C1:'Delimitación',C2:'Método',C3:'TNMM / PLI',C4:'Comparabilidad',C5:'Ajustes',C6:'Rango',C7:'Documentación'};

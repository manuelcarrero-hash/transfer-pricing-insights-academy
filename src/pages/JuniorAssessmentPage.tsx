import { FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { j1Lessons } from '../content/curriculum/v1/j1';
import { j2Lessons } from '../content/curriculum/v1/j2';
import { j3Lessons } from '../content/curriculum/v1/j3';
import { j4Lessons } from '../content/curriculum/v1/j4';
import { j5Lessons } from '../content/curriculum/v1/j5';
import { JUNIOR_DOMAIN_FLOOR, JUNIOR_PASS_SCORE, JuniorDomain, JuniorQuestion, juniorDomains, juniorFoundationsBank } from '../content/assessments/juniorFoundations';
import { getCourseProgress } from '../services/courseProgress';

const RESULT_KEY = 'tp-junior-foundations-result';
const CERTIFICATE_KEY = 'tp-junior-foundations-certificate';
const UNLOCK_KEY = 'tp-consultant-level-unlocked';

const distribution: Record<JuniorDomain, number> = {
  'Fundamentos': 5,
  "Arm's Length / delimitación": 4,
  'FAR': 4,
  'Métodos': 4,
  'Comparabilidad': 3,
};

function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function makeAttempt() {
  return shuffle(juniorDomains.flatMap((domain) => shuffle(juniorFoundationsBank.filter((q) => q.domain === domain)).slice(0, distribution[domain])));
}

function juniorCoursesComplete() {
  const specs = [['J1', j1Lessons.length], ['J2', j2Lessons.length], ['J3', j3Lessons.length], ['J4', j4Lessons.length], ['J5', j5Lessons.length]] as const;
  return specs.every(([code, count]) => getCourseProgress(code, count).completedLessons.length === count);
}

type Result = { score: number; passed: boolean; domainScores: Record<JuniorDomain, number>; correct: number; total: number };

export function JuniorAssessmentPage() {
  const eligible = juniorCoursesComplete();
  const [questions, setQuestions] = useState<JuniorQuestion[]>(() => makeAttempt());
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [participantName, setParticipantName] = useState('');
  const answered = Object.keys(answers).length;

  const weakDomain = useMemo(() => {
    if (!result) return null;
    return juniorDomains.reduce((weak, domain) => result.domainScores[domain] < result.domainScores[weak] ? domain : weak, juniorDomains[0]);
  }, [result]);

  function grade(event: FormEvent) {
    event.preventDefault();
    if (answered !== questions.length) return;
    const correct = questions.filter((q) => answers[q.id] === q.correctIndex).length;
    const score = Math.round((correct / questions.length) * 100);
    const domainScores = Object.fromEntries(juniorDomains.map((domain) => {
      const domainQuestions = questions.filter((q) => q.domain === domain);
      const domainCorrect = domainQuestions.filter((q) => answers[q.id] === q.correctIndex).length;
      return [domain, Math.round((domainCorrect / domainQuestions.length) * 100)];
    })) as Record<JuniorDomain, number>;
    const passed = score >= JUNIOR_PASS_SCORE && juniorDomains.every((domain) => domainScores[domain] >= JUNIOR_DOMAIN_FLOOR);
    const next = { score, passed, domainScores, correct, total: questions.length };
    setResult(next);
    localStorage.setItem(RESULT_KEY, JSON.stringify({ ...next, completedAt: new Date().toISOString() }));
    if (passed) localStorage.setItem(UNLOCK_KEY, 'true');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function retry() {
    setQuestions(makeAttempt()); setAnswers({}); setResult(null); setParticipantName(''); window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function issueCertificate() {
    const name = participantName.trim();
    if (!name || !result?.passed) return;
    const issuedAt = new Date().toISOString();
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    const certificateId = `TPIA-JF-${issuedAt.slice(0, 10).replaceAll('-', '')}-${random}`;
    localStorage.setItem(CERTIFICATE_KEY, JSON.stringify({ participantName: name, issuedAt, certificateId }));
    window.location.href = '/junior-foundations/certificate';
  }

  if (!eligible) return <section className="section"><div className="container narrow"><div className="eyebrow">Evaluación acumulativa</div><h1>Completa primero J1–J5</h1><p className="lead small">La evaluación Junior Foundations se habilita cuando las comprobaciones formativas de todas las lecciones de J1 a J5 están completadas en este navegador.</p><Link className="button primary" to="/path">Revisar Mi Ruta</Link></div></section>;

  if (result) return <section className="section"><div className="container narrow assessment-result"><div className="eyebrow">Transfer Pricing Junior Foundations</div><h1>{result.passed ? 'Nivel Junior aprobado' : 'Aún no alcanzas el dominio requerido'}</h1><div className="result-score"><strong>{result.score}%</strong><span>{result.correct} de {result.total} respuestas correctas</span></div><div className="domain-results">{juniorDomains.map((domain) => <div key={domain}><span>{domain}</span><strong className={result.domainScores[domain] < JUNIOR_DOMAIN_FLOOR ? 'below-floor' : ''}>{result.domainScores[domain]}%</strong></div>)}</div>{result.passed ? <><p>Superaste el 80% global y ningún dominio quedó por debajo de 60%. El nivel Consultant queda desbloqueado en este navegador.</p><div className="certificate-name-form"><label htmlFor="participant-name">Nombre que aparecerá en el certificado</label><input id="participant-name" value={participantName} onChange={(e) => setParticipantName(e.target.value)} placeholder="Nombre completo" autoComplete="name" /><button className="button primary" type="button" disabled={!participantName.trim()} onClick={issueCertificate}>Emitir mi certificado</button></div></> : <><p>Tu principal área a reforzar es <strong>{weakDomain}</strong>. Revisa ese dominio antes del siguiente intento. Los intentos son ilimitados.</p><button className="button primary" type="button" onClick={retry}>Intentar de nuevo</button></>}</div></section>;

  return <section className="section assessment-page"><div className="container narrow"><div className="eyebrow">Cierre del nivel Junior</div><h1>Evaluación Acumulativa — Transfer Pricing Junior Foundations</h1><p className="lead small">20 reactivos aleatorios del banco aprobado. Para aprobar necesitas 80% global y al menos 60% en cada dominio. Puedes intentarlo las veces que necesites.</p><div className="assessment-progress"><strong>{answered} / {questions.length}</strong><span>respondidas</span></div><form onSubmit={grade}>{questions.map((question, index) => <fieldset className="assessment-question" key={question.id}><legend><span>{index + 1}</span>{question.prompt}</legend><small>{question.domain}</small>{question.options.map((option, optionIndex) => <label className="assessment-option" key={option}><input type="radio" name={`question-${question.id}`} checked={answers[question.id] === optionIndex} onChange={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))} /><span>{option}</span></label>)}</fieldset>)}<button className="button primary assessment-submit" type="submit" disabled={answered !== questions.length}>Calificar evaluación</button></form></div></section>;
}

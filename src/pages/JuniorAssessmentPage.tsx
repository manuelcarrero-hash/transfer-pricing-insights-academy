import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TurnstileWidget } from '../components/security/TurnstileWidget';
import { j1Lessons } from '../content/curriculum/v1/j1';
import { j2Lessons } from '../content/curriculum/v1/j2';
import { j3Lessons } from '../content/curriculum/v1/j3';
import { j4Lessons } from '../content/curriculum/v1/j4';
import { j5Lessons } from '../content/curriculum/v1/j5';
import { JUNIOR_DOMAIN_FLOOR, JuniorDomain, JuniorQuestion, juniorDomains } from '../content/assessments/juniorFoundations';
import { getCourseProgress } from '../services/courseProgress';
import { getProgress } from '../services/progress';

const RESULT_KEY = 'tp-junior-foundations-result';
const CERTIFICATE_KEY = 'tp-junior-foundations-certificate';
const UNLOCK_KEY = 'tp-consultant-level-unlocked';

type AttemptResponse = { attemptId: string; expiresAt: string; questions: JuniorQuestion[] };
type Result = { attemptId: string; score: number; passed: boolean; domainScores: Record<JuniorDomain, number>; correct: number; total: number; gradedAt: string };
type CertificateResponse = { certificateId: string; participantName: string; issuedAt: string; verificationUrl: string };

function juniorCoursesComplete() {
  const j1Complete = getProgress().completedLessons.length === j1Lessons.length;
  const laterCourses = [['J2', j2Lessons.length], ['J3', j3Lessons.length], ['J4', j4Lessons.length], ['J5', j5Lessons.length]] as const;
  return j1Complete && laterCourses.every(([code, count]) => getCourseProgress(code, count).completedLessons.length === count);
}

export function JuniorAssessmentPage() {
  const eligible = juniorCoursesComplete();
  const [attemptId, setAttemptId] = useState('');
  const [questions, setQuestions] = useState<JuniorQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [participantName, setParticipantName] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [loading, setLoading] = useState(eligible);
  const [submitting, setSubmitting] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [error, setError] = useState('');
  const answered = Object.keys(answers).length;
  const handleTurnstileToken = useCallback((token: string) => setTurnstileToken(token), []);

  const weakDomain = useMemo(() => {
    if (!result) return null;
    return juniorDomains.reduce((weak, domain) => result.domainScores[domain] < result.domainScores[weak] ? domain : weak, juniorDomains[0]);
  }, [result]);

  const startAttempt = useCallback(async () => {
    setLoading(true); setError(''); setAnswers({}); setResult(null); setParticipantName(''); setTurnstileToken('');
    try {
      const response = await fetch('/api/junior/attempt', { method: 'POST', headers: { accept: 'application/json' } });
      if (!response.ok) throw new Error('No fue posible iniciar la evaluación.');
      const data = await response.json() as AttemptResponse;
      setAttemptId(data.attemptId); setQuestions(data.questions);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible iniciar la evaluación.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (eligible) void startAttempt(); }, [eligible, startAttempt]);

  async function grade(event: FormEvent) {
    event.preventDefault();
    if (!attemptId || answered !== questions.length || submitting) return;
    setSubmitting(true); setError('');
    try {
      const response = await fetch('/api/junior/grade', {
        method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ attemptId, answers }),
      });
      if (!response.ok) throw new Error('No fue posible calificar la evaluación. Inicia un nuevo intento.');
      const next = await response.json() as Result;
      setResult(next);
      localStorage.setItem(RESULT_KEY, JSON.stringify(next));
      if (next.passed) localStorage.setItem(UNLOCK_KEY, 'true');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible calificar la evaluación.');
    } finally { setSubmitting(false); }
  }

  async function issueCertificate() {
    const name = participantName.trim();
    if (!name || !result?.passed || !turnstileToken || issuing) return;
    setIssuing(true); setError('');
    try {
      const response = await fetch('/api/certificates/issue', {
        method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ attemptId: result.attemptId, participantName: name, turnstileToken }),
      });
      if (!response.ok) {
        const detail = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(detail.error === 'turnstile_failed' ? 'La verificación de seguridad expiró. Vuelve a completarla.' : 'No fue posible emitir el certificado.');
      }
      const certificate = await response.json() as CertificateResponse;
      localStorage.setItem(CERTIFICATE_KEY, JSON.stringify({ certificateId: certificate.certificateId }));
      window.location.href = `/junior-foundations/certificate?id=${encodeURIComponent(certificate.certificateId)}`;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible emitir el certificado.');
      setTurnstileToken('');
    } finally { setIssuing(false); }
  }

  if (!eligible) return <section className="section"><div className="container narrow"><div className="eyebrow">Evaluación acumulativa</div><h1>Completa primero J1–J5</h1><p className="lead small">La evaluación Junior Foundations se habilita cuando las comprobaciones formativas de todas las lecciones de J1 a J5 están completadas en este navegador.</p><Link className="button primary" to="/path">Revisar Mi Ruta</Link></div></section>;
  if (loading) return <section className="section"><div className="container narrow"><div className="eyebrow">Evaluación acumulativa</div><h1>Preparando tu intento…</h1><p className="lead small">Las preguntas de certificación se generan y registran de forma segura.</p></div></section>;
  if (!questions.length) return <section className="section"><div className="container narrow"><h1>No pudimos iniciar la evaluación</h1><p className="lead small">{error || 'Intenta nuevamente.'}</p><button className="button primary" type="button" onClick={() => void startAttempt()}>Reintentar</button></div></section>;

  if (result) return <section className="section"><div className="container narrow assessment-result"><div className="eyebrow">Transfer Pricing Junior Foundations</div><h1>{result.passed ? 'Nivel Junior aprobado' : 'Aún no alcanzas el dominio requerido'}</h1><div className="result-score"><strong>{result.score}%</strong><span>{result.correct} de {result.total} respuestas correctas</span></div><div className="domain-results">{juniorDomains.map((domain) => <div key={domain}><span>{domain}</span><strong className={result.domainScores[domain] < JUNIOR_DOMAIN_FLOOR ? 'below-floor' : ''}>{result.domainScores[domain]}%</strong></div>)}</div>{result.passed ? <><p>La Academy validó este resultado en servidor. Superaste el 80% global y ningún dominio quedó por debajo de 60%. El nivel Consultant queda desbloqueado en este navegador.</p><div className="certificate-name-form"><label htmlFor="participant-name">Nombre que aparecerá en el certificado</label><input id="participant-name" value={participantName} onChange={(event) => setParticipantName(event.target.value)} placeholder="Nombre completo" autoComplete="name" maxLength={120}/><TurnstileWidget onToken={handleTurnstileToken}/>{error && <p role="alert">{error}</p>}<button className="button primary" type="button" disabled={!participantName.trim() || !turnstileToken || issuing} onClick={() => void issueCertificate()}>{issuing ? 'Emitiendo…' : 'Emitir certificado verificable'}</button></div></> : <><p>Tu principal área a reforzar es <strong>{weakDomain}</strong>. Revisa ese dominio antes del siguiente intento. Los intentos son ilimitados.</p>{error && <p role="alert">{error}</p>}<button className="button primary" type="button" onClick={() => void startAttempt()}>Intentar de nuevo</button></>}</div></section>;

  return <section className="section assessment-page"><div className="container narrow"><div className="eyebrow">Cierre del nivel Junior</div><h1>Evaluación Acumulativa — Transfer Pricing Junior Foundations</h1><p className="lead small">20 reactivos aleatorios del banco protegido de certificación. La calificación se realiza en servidor. Para aprobar necesitas 80% global y al menos 60% en cada dominio.</p><div className="assessment-progress"><strong>{answered} / {questions.length}</strong><span>respondidas</span></div>{error && <p role="alert">{error}</p>}<form onSubmit={grade}>{questions.map((question, index) => <fieldset className="assessment-question" key={question.id}><legend><span>{index + 1}</span>{question.prompt}</legend><small>{question.domain}</small>{question.options.map((option, optionIndex) => <label className="assessment-option" key={option}><input type="radio" name={`question-${question.id}`} checked={answers[question.id] === optionIndex} onChange={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}/><span>{option}</span></label>)}</fieldset>)}<button className="button primary assessment-submit" type="submit" disabled={answered !== questions.length || submitting}>{submitting ? 'Calificando…' : 'Calificar evaluación'}</button></form></div></section>;
}

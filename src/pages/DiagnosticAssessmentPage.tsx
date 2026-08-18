import { FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DiagnosticDomain,
  diagnosticDomainLabels,
  diagnosticLevelRoutes,
  diagnosticReviewRecommendations,
  recommendDiagnosticLevel,
  selectDiagnosticQuestions,
} from '../content/assessments/diagnostic';

const RESULT_KEY = 'tp-diagnostic-result-v1';
const domains: DiagnosticDomain[] = ['A','B','C','D','E','F'];

export function DiagnosticAssessmentPage() {
  const questions = useMemo(() => selectDiagnosticQuestions(), []);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<null | {
    overall: number;
    domainScores: Record<DiagnosticDomain, number>;
    recommendedLevel: ReturnType<typeof recommendDiagnosticLevel>;
  }>(null);

  const answered = Object.keys(answers).length;

  function grade(event: FormEvent) {
    event.preventDefault();
    if (answered !== questions.length) return;

    const correct = questions.filter(question => answers[question.id] === question.correct).length;
    const overall = Math.round((correct / questions.length) * 100);
    const domainScores = Object.fromEntries(domains.map(domain => {
      const subset = questions.filter(question => question.domain === domain);
      const domainCorrect = subset.filter(question => answers[question.id] === question.correct).length;
      return [domain, Math.round((domainCorrect / subset.length) * 100)];
    })) as Record<DiagnosticDomain, number>;
    const recommendedLevel = recommendDiagnosticLevel(overall, domainScores);
    const next = { overall, domainScores, recommendedLevel };
    setResult(next);
    localStorage.setItem(RESULT_KEY, JSON.stringify({ ...next, completedAt: new Date().toISOString() }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function restart() {
    setAnswers({});
    setResult(null);
    localStorage.removeItem(RESULT_KEY);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (result) {
    const reviewDomains = domains.filter(domain => result.domainScores[domain] < 60);
    return (
      <section className="section assessment-page">
        <div className="container narrow assessment-result">
          <div className="eyebrow">Evaluación diagnóstica · Resultado</div>
          <h1>Punto de entrada recomendado: {result.recommendedLevel}</h1>
          <div className="result-score"><strong>{result.overall}%</strong><span>resultado global</span></div>

          <div className="concept-callout">
            <strong>Esto es una recomendación académica, no una credencial.</strong>
            <p>El diagnóstico no otorga certificación ni acredita experiencia profesional. Su función es evitar que comiences demasiado abajo o avances con huecos críticos en fundamentos.</p>
          </div>

          <section className="section-block">
            <h2>Perfil por dominio</h2>
            {domains.map(domain => (
              <article className="concept-callout" key={domain}>
                <strong>{domain}. {diagnosticDomainLabels[domain]} · {result.domainScores[domain]}%</strong>
                {result.domainScores[domain] < 60 && <p>Repaso recomendado: {diagnosticReviewRecommendations[domain]}.</p>}
              </article>
            ))}
          </section>

          {reviewDomains.length > 0 && <section className="section-block"><h2>Antes o durante tu ruta</h2><p>No necesitas bloquear tu aprendizaje, pero conviene reforzar los dominios señalados. Para recomendar Semi Senior, los dominios críticos A–D deben estar al menos en 60%; para Senior Knowledge, al menos en 70%.</p></section>}

          <div className="course-actions">
            <Link className="button primary" to={diagnosticLevelRoutes[result.recommendedLevel]}>Comenzar en {result.recommendedLevel}</Link>
            <button className="button secondary" type="button" onClick={restart}>Repetir diagnóstico</button>
            <Link className="button secondary" to="/start">Volver a opciones de inicio</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section assessment-page">
      <div className="container narrow">
        <div className="eyebrow">Tu punto de entrada · Diagnóstico</div>
        <h1>Encuentra dónde te conviene comenzar.</h1>
        <p className="lead small">40 reactivos seleccionados de un banco mayor, respetando el peso de seis dominios. Tiempo sugerido: 45–60 minutos. No hay penalización por respuesta incorrecta.</p>
        <div className="concept-callout"><strong>No es un examen de certificación.</strong><p>Tu resultado sólo recomienda un punto de entrada dentro de Junior → Consultant → Semi Senior → Senior Knowledge. La experiencia profesional real no puede inferirse de este diagnóstico.</p></div>
        <div className="assessment-progress"><strong>{answered} / {questions.length}</strong><span>reactivos respondidos</span></div>

        <form onSubmit={grade}>
          {questions.map((question, index) => (
            <fieldset className="assessment-question" key={question.id}>
              <legend><span>{index + 1}</span>{question.prompt}</legend>
              {question.options.map((option, optionIndex) => (
                <label className="assessment-option" key={option}>
                  <input
                    type="radio"
                    name={`diagnostic-${question.id}`}
                    checked={answers[question.id] === optionIndex}
                    onChange={() => setAnswers(current => ({ ...current, [question.id]: optionIndex }))}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </fieldset>
          ))}
          <button className="button primary assessment-submit" type="submit" disabled={answered !== questions.length}>Obtener recomendación de entrada</button>
        </form>
      </div>
    </section>
  );
}

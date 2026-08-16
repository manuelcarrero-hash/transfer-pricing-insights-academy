import { Link } from 'react-router-dom';
import { j1Course, j1Lessons } from '../content/curriculum/v1/j1';
import { useProgress } from '../hooks/useProgress';

export function MyPathPage() {
  const progress = useProgress();
  const completed = progress.completedLessons.length;
  const percent = Math.round((completed / j1Lessons.length) * 100);
  const resumeLesson = progress.lastLesson ?? 1;
  const resumeTitle = j1Lessons[resumeLesson - 1]?.title ?? j1Lessons[0].title;

  return (
    <section className="section my-path-page">
      <div className="container narrow">
        <div className="eyebrow">Mi Ruta</div>
        <h1>Tu progreso, claro y sin ruido.</h1>
        <p className="lead small">Puedes estudiar sin cuenta. Mientras uses este dispositivo y navegador, la Academy recuerda dónde te quedaste y qué lecciones has demostrado comprender mediante sus comprobaciones formativas.</p>

        <section className="progress-card" aria-labelledby="j1-progress-title">
          <div className="progress-card-top">
            <div>
              <span className="progress-kicker">Junior · J1</span>
              <h2 id="j1-progress-title">{j1Course.title}</h2>
            </div>
            <strong className="progress-percent">{percent}%</strong>
          </div>
          <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label={`Progreso de J1: ${percent}%`}>
            <span style={{ width: `${percent}%` }} />
          </div>
          <p className="progress-summary">{completed} de {j1Lessons.length} lecciones completadas.</p>
          <div className="progress-actions">
            <Link className="button primary" to={`/courses/j1/lesson/${resumeLesson}`}>{progress.lastLesson ? 'Continuar donde me quedé' : 'Comenzar J1'}</Link>
            <Link className="button secondary" to="/courses/j1/study-guide">Abrir guía de estudio</Link>
          </div>
          {progress.lastLesson && <p className="resume-note">Última lección visitada: <strong>{resumeLesson}. {resumeTitle}</strong></p>}
        </section>

        <section className="progress-lessons">
          <h2>Lecciones de J1</h2>
          <ol>
            {j1Lessons.map((lesson) => {
              const done = progress.completedLessons.includes(lesson.sequence);
              const current = progress.lastLesson === lesson.sequence;
              return (
                <li key={lesson.id} className={done ? 'progress-lesson done' : 'progress-lesson'}>
                  <span className="progress-status" aria-hidden="true">{done ? '✓' : lesson.sequence}</span>
                  <div>
                    <Link to={`/courses/j1/lesson/${lesson.sequence}`}>{lesson.title}</Link>
                    <small>{done ? 'Completada' : current ? 'Última visitada' : 'Pendiente'}</small>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <aside className="local-progress-note">
          <strong>Sobre este progreso</strong>
          <p>Por ahora se guarda sólo en este navegador mediante almacenamiento local. No contiene correo, nombre ni otra identidad. Cuando habilitemos cuentas, ofreceremos sincronización para conservar el avance entre dispositivos.</p>
        </aside>
      </div>
    </section>
  );
}

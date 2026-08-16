import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { j1Course, j1Lessons } from '../content/curriculum/v1/j1';
import { j2Course, j2Lessons } from '../content/curriculum/v1/j2';
import { j3Course, j3Lessons } from '../content/curriculum/v1/j3';
import { j4Course, j4Lessons } from '../content/curriculum/v1/j4';
import { useProgress } from '../hooks/useProgress';
import { courseProgressEventName, getCourseProgress } from '../services/courseProgress';

export function MyPathPage() {
  const j1Progress = useProgress();
  const [j2Progress, setJ2Progress] = useState(() => getCourseProgress('J2', j2Lessons.length));
  const [j3Progress, setJ3Progress] = useState(() => getCourseProgress('J3', j3Lessons.length));
  const [j4Progress, setJ4Progress] = useState(() => getCourseProgress('J4', j4Lessons.length));

  useEffect(() => {
    const sync = () => {
      setJ2Progress(getCourseProgress('J2', j2Lessons.length));
      setJ3Progress(getCourseProgress('J3', j3Lessons.length));
      setJ4Progress(getCourseProgress('J4', j4Lessons.length));
    };
    window.addEventListener(courseProgressEventName, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(courseProgressEventName, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const courses = [
    { code: 'J1', course: j1Course, lessons: j1Lessons, progress: j1Progress, href: '/courses/j1' },
    { code: 'J2', course: j2Course, lessons: j2Lessons, progress: j2Progress, href: '/courses/j2' },
    { code: 'J3', course: j3Course, lessons: j3Lessons, progress: j3Progress, href: '/courses/j3' },
    { code: 'J4', course: j4Course, lessons: j4Lessons, progress: j4Progress, href: '/courses/j4' },
  ];

  return (
    <section className="section my-path-page">
      <div className="container narrow">
        <div className="eyebrow">Mi Ruta</div>
        <h1>Tu progreso, claro y sin ruido.</h1>
        <p className="lead small">Puedes estudiar sin cuenta. Mientras uses este dispositivo y navegador, la Academy recuerda dónde te quedaste y qué lecciones has demostrado comprender mediante sus comprobaciones formativas.</p>

        {courses.map(({ code, course, lessons, progress, href }) => {
          const completed = progress.completedLessons.length;
          const percent = Math.round((completed / lessons.length) * 100);
          const resumeLesson = progress.lastLesson ?? 1;
          const resumeTitle = lessons[resumeLesson - 1]?.title ?? lessons[0].title;
          return (
            <section className="progress-card" aria-labelledby={`${code.toLowerCase()}-progress-title`} key={code}>
              <div className="progress-card-top">
                <div>
                  <span className="progress-kicker">Junior · {code}</span>
                  <h2 id={`${code.toLowerCase()}-progress-title`}>{course.title}</h2>
                </div>
                <strong className="progress-percent">{percent}%</strong>
              </div>
              <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label={`Progreso de ${code}: ${percent}%`}><span style={{ width: `${percent}%` }} /></div>
              <p className="progress-summary">{completed} de {lessons.length} lecciones completadas.</p>
              <div className="progress-actions">
                <Link className="button primary" to={`${href}/lesson/${resumeLesson}`}>{progress.lastLesson ? 'Continuar donde me quedé' : `Comenzar ${code}`}</Link>
                <Link className="button secondary" to={href}>Ver curso</Link>
              </div>
              {progress.lastLesson && <p className="resume-note">Última lección visitada: <strong>{resumeLesson}. {resumeTitle}</strong></p>}
            </section>
          );
        })}

        <aside className="local-progress-note">
          <strong>Sobre este progreso</strong>
          <p>Por ahora se guarda sólo en este navegador mediante almacenamiento local. No contiene correo, nombre ni otra identidad. Cuando habilitemos cuentas, ofreceremos sincronización para conservar el avance entre dispositivos.</p>
        </aside>
      </div>
    </section>
  );
}

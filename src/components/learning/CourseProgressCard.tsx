import { Link } from 'react-router-dom';

type LessonSummary = { sequence: number; title: string };
type CourseSummary = { title: string };
type ProgressSummary = { lastLesson: number | null; completedLessons: number[] };

type CourseProgressCardProps = {
  level: string;
  code: string;
  course: CourseSummary;
  lessons: LessonSummary[];
  progress: ProgressSummary;
};

export function CourseProgressCard({ level, code, course, lessons, progress }: CourseProgressCardProps) {
  const completed = progress.completedLessons.length;
  const percent = Math.round((completed / lessons.length) * 100);
  const resume = progress.lastLesson ?? 1;
  const href = `/courses/${code.toLowerCase()}`;
  const titleId = `${code.toLowerCase()}-progress-title`;

  return (
    <section className="progress-card" aria-labelledby={titleId}>
      <div className="progress-card-top">
        <div><span className="progress-kicker">{level} · {code}</span><h2 id={titleId}>{course.title}</h2></div>
        <strong className="progress-percent" aria-label={`${percent}% completado`}>{percent}%</strong>
      </div>
      <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label={`Progreso ${code}`}><span style={{ width: `${percent}%` }} /></div>
      <p className="progress-summary">{completed} de {lessons.length} lecciones completadas.</p>
      <div className="progress-actions">
        <Link className="button primary" to={`${href}/lesson/${resume}`}>{progress.lastLesson ? 'Continuar donde me quedé' : `Comenzar ${code}`}</Link>
        <Link className="button secondary" to={href}>Ver curso</Link>
      </div>
      {progress.lastLesson && <p className="resume-note">Última lección visitada: <strong>{progress.lastLesson}. {lessons[resume - 1]?.title}</strong></p>}
    </section>
  );
}

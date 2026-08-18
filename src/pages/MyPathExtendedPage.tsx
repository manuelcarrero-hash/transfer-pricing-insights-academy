import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CourseProgressCard } from '../components/learning/CourseProgressCard';
import { SeniorClosureProgress } from '../components/learning/SeniorClosureProgress';
import { LocalProgressNote, MyPathPage } from './MyPathPage';
import { ss6Course, ss6Lessons } from '../content/curriculum/v1/ss6';
import { ss7Course, ss7Lessons } from '../content/curriculum/v1/ss7';
import { ss8Course, ss8Lessons } from '../content/curriculum/v1/ss8';
import { s1Course, s1Lessons } from '../content/curriculum/v1/s1';
import { s2Course, s2Lessons } from '../content/curriculum/v1/s2';
import { s3Course, s3Lessons } from '../content/curriculum/v1/s3';
import { s4Course, s4Lessons } from '../content/curriculum/v1/s4';
import { s5Course, s5Lessons } from '../content/curriculum/v1/s5';
import { s6Course, s6Lessons } from '../content/curriculum/v1/s6';
import { s7Course, s7Lessons } from '../content/curriculum/v1/s7';
import { courseProgressEventName, getCourseProgress } from '../services/courseProgress';

const semiSeniorIntegralGuideUrl = 'https://drive.google.com/file/d/1piYwILWyWDkMYswmPdrNd0ZPuFB06x_A/view';

export function MyPathExtendedPage() {
  const codes = [
    ['SS6', ss6Lessons], ['SS7', ss7Lessons], ['SS8', ss8Lessons],
    ['S1', s1Lessons], ['S2', s2Lessons], ['S3', s3Lessons], ['S4', s4Lessons], ['S5', s5Lessons], ['S6', s6Lessons], ['S7', s7Lessons],
  ] as const;
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const sync = () => setVersion((value) => value + 1);
    window.addEventListener(courseProgressEventName, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(courseProgressEventName, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  void version;
  const progress = Object.fromEntries(codes.map(([code, lessons]) => [code, getCourseProgress(code, lessons.length)])) as Record<string, ReturnType<typeof getCourseProgress>>;
  const unlocked = (key: string) => typeof window !== 'undefined' && localStorage.getItem(key) === 'true';
  const seniorUnlocked = unlocked('tp-senior-track-unlocked');
  const levelComplete = unlocked('tp-semi-senior-foundations-complete');
  const cumulativePassed = unlocked('tp-semi-senior-cumulative-passed');
  const hasExtendedPath = unlocked('tp-ss6-unlocked') || unlocked('tp-ss7-unlocked') || unlocked('tp-ss8-unlocked') || seniorUnlocked;

  if (!hasExtendedPath) return <MyPathPage />;

  const semiSeniorExtension = (
    <>
      <div className="path-course-list path-course-list-extension">
        {unlocked('tp-ss6-unlocked') && <CourseProgressCard level="Semi Senior" code="SS6" course={ss6Course} lessons={ss6Lessons} progress={progress.SS6} />}
        {unlocked('tp-ss7-unlocked') && <CourseProgressCard level="Semi Senior" code="SS7" course={ss7Course} lessons={ss7Lessons} progress={progress.SS7} />}
        {unlocked('tp-ss8-unlocked') && <CourseProgressCard level="Semi Senior" code="SS8" course={ss8Course} lessons={ss8Lessons} progress={progress.SS8} />}
      </div>
      {levelComplete && <section className="progress-card level-closure-card completed-level"><div className="progress-card-top"><div><span className="progress-kicker">Cierre de nivel</span><h2>Advanced Transfer Pricing Practitioner</h2></div><strong className="progress-percent">{seniorUnlocked ? '✓' : 'Ready'}</strong></div><p className="progress-summary">{seniorUnlocked ? 'Nivel Semi Senior acreditado. Senior Knowledge Track habilitado.' : cumulativePassed ? 'Componente objetivo aprobado. Faltan los dos casos avanzados obligatorios.' : 'SS1–SS8 completados. Continúa con la evaluación acumulativa: 24 reactivos, 80% global y piso de 60% por dominio.'}</p><div className="progress-actions"><a className="button secondary" href={semiSeniorIntegralGuideUrl} target="_blank" rel="noreferrer">Guía integral Semi Senior</a>{seniorUnlocked ? <Link className="button primary" to="/advanced-practitioner/certificate">Ver certificado</Link> : cumulativePassed ? <Link className="button primary" to="/semi-senior/cases">Resolver casos avanzados</Link> : <Link className="button primary" to="/semi-senior/assessment">Presentar evaluación acumulativa</Link>}</div></section>}
    </>
  );

  const seniorExtension = seniorUnlocked ? (
    <>
      <div className="path-course-list">
        <CourseProgressCard level="Senior Knowledge" code="S1" course={s1Course} lessons={s1Lessons} progress={progress.S1} />
        {unlocked('tp-s2-unlocked') && <CourseProgressCard level="Senior Knowledge" code="S2" course={s2Course} lessons={s2Lessons} progress={progress.S2} />}
        {unlocked('tp-s3-unlocked') && <CourseProgressCard level="Senior Knowledge" code="S3" course={s3Course} lessons={s3Lessons} progress={progress.S3} />}
        {unlocked('tp-s4-unlocked') && <CourseProgressCard level="Senior Knowledge" code="S4" course={s4Course} lessons={s4Lessons} progress={progress.S4} />}
        {unlocked('tp-s5-unlocked') && <CourseProgressCard level="Senior Knowledge" code="S5" course={s5Course} lessons={s5Lessons} progress={progress.S5} />}
        {unlocked('tp-s6-unlocked') && <CourseProgressCard level="Senior Knowledge" code="S6" course={s6Course} lessons={s6Lessons} progress={progress.S6} />}
        {unlocked('tp-s7-unlocked') && <CourseProgressCard level="Senior Knowledge" code="S7" course={s7Course} lessons={s7Lessons} progress={progress.S7} />}
      </div>
      <SeniorClosureProgress />
    </>
  ) : null;

  return <><MyPathPage showLocalNote={false} semiSeniorExtension={semiSeniorExtension} seniorExtension={seniorExtension} /><div className="container path-container"><LocalProgressNote /></div></>;
}

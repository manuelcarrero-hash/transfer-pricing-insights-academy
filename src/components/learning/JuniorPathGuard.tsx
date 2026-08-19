import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { canAccessCourseLesson } from '../../services/courseProgress';
import { getProgress } from '../../services/progress';

const lessonCounts: Record<string, number> = {
  j1: 8,
  j2: 8,
  j3: 8,
  j4: 8,
  j5: 9,
};

function canAccessJ1(lessonNumber: number) {
  if (lessonNumber <= 1) return true;
  const progress = getProgress();
  return Array.from({ length: lessonNumber - 1 }, (_, index) => index + 1)
    .every((requiredLesson) => progress.completedLessons.includes(requiredLesson));
}

export function JuniorPathGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const match = location.pathname.match(/^\/courses\/(j[1-5])\/lesson\/(\d+)\/?$/i);
    if (!match) return;

    const course = match[1].toLowerCase();
    const lessonNumber = Number(match[2]);
    const lessonCount = lessonCounts[course];
    if (!lessonCount || !Number.isInteger(lessonNumber) || lessonNumber < 1 || lessonNumber > lessonCount) return;

    const allowed = course === 'j1'
      ? canAccessJ1(lessonNumber)
      : canAccessCourseLesson(course.toUpperCase(), lessonNumber, lessonCount);

    if (!allowed) {
      navigate(`/courses/${course}`, { replace: true, state: { blockedLesson: lessonNumber } });
    }
  }, [location.pathname, navigate]);

  return <>{children}</>;
}

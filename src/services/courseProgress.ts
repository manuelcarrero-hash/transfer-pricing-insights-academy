export type CourseProgress = {
  curriculumVersion: 'v1';
  courseCode: string;
  lastLesson: number | null;
  completedLessons: number[];
  updatedAt: string | null;
};

const EVENT_NAME = 'tpia-course-progress-change';

function key(courseCode: string) {
  return `tpia-course-progress-v1-${courseCode.toLowerCase()}`;
}

export function getCourseProgress(courseCode: string, lessonCount = 100): CourseProgress {
  const empty: CourseProgress = { curriculumVersion: 'v1', courseCode, lastLesson: null, completedLessons: [], updatedAt: null };
  if (typeof window === 'undefined') return empty;
  try {
    const raw = window.localStorage.getItem(key(courseCode));
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<CourseProgress>;
    return {
      curriculumVersion: 'v1',
      courseCode,
      lastLesson: typeof parsed.lastLesson === 'number' ? parsed.lastLesson : null,
      completedLessons: Array.isArray(parsed.completedLessons)
        ? [...new Set(parsed.completedLessons.filter((item): item is number => typeof item === 'number' && item >= 1 && item <= lessonCount))].sort((a, b) => a - b)
        : [],
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : null,
    };
  } catch {
    return empty;
  }
}

function save(progress: CourseProgress) {
  window.localStorage.setItem(key(progress.courseCode), JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { courseCode: progress.courseCode } }));
}

export function canAccessCourseLesson(courseCode: string, lessonNumber: number, lessonCount: number) {
  if (lessonNumber <= 1) return true;
  const current = getCourseProgress(courseCode, lessonCount);
  return Array.from({ length: lessonNumber - 1 }, (_, index) => index + 1)
    .every((requiredLesson) => current.completedLessons.includes(requiredLesson));
}

export function markCourseLessonVisited(courseCode: string, lessonNumber: number, lessonCount: number) {
  if (!canAccessCourseLesson(courseCode, lessonNumber, lessonCount)) return false;
  const current = getCourseProgress(courseCode, lessonCount);
  save({ ...current, lastLesson: lessonNumber, updatedAt: new Date().toISOString() });
  return true;
}

export function markCourseLessonCompleted(courseCode: string, lessonNumber: number, lessonCount: number) {
  if (!canAccessCourseLesson(courseCode, lessonNumber, lessonCount)) return false;
  const current = getCourseProgress(courseCode, lessonCount);
  const completedLessons = [...new Set([...current.completedLessons, lessonNumber])].sort((a, b) => a - b);
  save({ ...current, lastLesson: lessonNumber, completedLessons, updatedAt: new Date().toISOString() });
  return true;
}

export const courseProgressEventName = EVENT_NAME;

export type AcademyProgress = {
  curriculumVersion: 'v1';
  lastLesson: number | null;
  completedLessons: number[];
  updatedAt: string | null;
};

const STORAGE_KEY = 'tpia-progress-v1';
const EVENT_NAME = 'tpia-progress-change';

const emptyProgress: AcademyProgress = {
  curriculumVersion: 'v1',
  lastLesson: null,
  completedLessons: [],
  updatedAt: null,
};

export function getProgress(): AcademyProgress {
  if (typeof window === 'undefined') return emptyProgress;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress;
    const parsed = JSON.parse(raw) as Partial<AcademyProgress>;
    return {
      curriculumVersion: 'v1',
      lastLesson: typeof parsed.lastLesson === 'number' ? parsed.lastLesson : null,
      completedLessons: Array.isArray(parsed.completedLessons)
        ? [...new Set(parsed.completedLessons.filter((item): item is number => typeof item === 'number' && item >= 1 && item <= 8))].sort((a, b) => a - b)
        : [],
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : null,
    };
  } catch {
    return emptyProgress;
  }
}

function saveProgress(progress: AcademyProgress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function canAccessLesson(lessonNumber: number) {
  if (lessonNumber <= 1) return true;
  const current = getProgress();
  return Array.from({ length: lessonNumber - 1 }, (_, index) => index + 1)
    .every((requiredLesson) => current.completedLessons.includes(requiredLesson));
}

export function markLessonVisited(lessonNumber: number) {
  if (!canAccessLesson(lessonNumber)) return false;
  const current = getProgress();
  saveProgress({ ...current, lastLesson: lessonNumber, updatedAt: new Date().toISOString() });
  return true;
}

export function markLessonCompleted(lessonNumber: number) {
  if (!canAccessLesson(lessonNumber)) return false;
  const current = getProgress();
  const completedLessons = [...new Set([...current.completedLessons, lessonNumber])].sort((a, b) => a - b);
  saveProgress({ ...current, lastLesson: lessonNumber, completedLessons, updatedAt: new Date().toISOString() });
  return true;
}

export function clearProgress() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export const progressEventName = EVENT_NAME;

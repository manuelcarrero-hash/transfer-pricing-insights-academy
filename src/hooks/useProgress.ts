import { useEffect, useState } from 'react';
import { getProgress, progressEventName, type AcademyProgress } from '../services/progress';

export function useProgress() {
  const [progress, setProgress] = useState<AcademyProgress>(() => getProgress());

  useEffect(() => {
    const refresh = () => setProgress(getProgress());
    window.addEventListener(progressEventName, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(progressEventName, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return progress;
}

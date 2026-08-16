import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { CoursePage } from '../pages/CoursePage';
import { HomePage } from '../pages/HomePage';
import { LessonPage } from '../pages/LessonPage';
import { StartPage } from '../pages/StartPage';

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/start" element={<StartPage />} />
        <Route path="/courses/j1" element={<CoursePage />} />
        <Route path="/courses/j1/lesson-:lessonNumber" element={<LessonPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

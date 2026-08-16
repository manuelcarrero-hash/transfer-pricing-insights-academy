import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { ScrollToTop } from '../components/layout/ScrollToTop';
import { CoursePage } from '../pages/CoursePage';
import { HomePage } from '../pages/HomePage';
import { J2CoursePage } from '../pages/J2CoursePage';
import { J2LessonPage } from '../pages/J2LessonPage';
import { LessonPage } from '../pages/LessonPage';
import { MyPathPage } from '../pages/MyPathPage';
import { StartPage } from '../pages/StartPage';
import { StudyGuidePage } from '../pages/StudyGuidePage';

export function App() {
  return (
    <AppShell>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/start" element={<StartPage />} />
        <Route path="/path" element={<MyPathPage />} />
        <Route path="/courses/j1" element={<CoursePage />} />
        <Route path="/courses/j1/study-guide" element={<StudyGuidePage />} />
        <Route path="/courses/j1/lesson/:lessonNumber" element={<LessonPage />} />
        <Route path="/courses/j1/lesson-:lessonNumber" element={<Navigate to="/courses/j1" replace />} />
        <Route path="/courses/j2" element={<J2CoursePage />} />
        <Route path="/courses/j2/lesson/:lessonNumber" element={<J2LessonPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

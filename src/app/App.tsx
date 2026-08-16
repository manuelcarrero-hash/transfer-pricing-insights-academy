import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { ScrollToTop } from '../components/layout/ScrollToTop';
import { C1CoursePage } from '../pages/C1CoursePage';
import { C1LessonPage } from '../pages/C1LessonPage';
import { CoursePage } from '../pages/CoursePage';
import { HomePage } from '../pages/HomePage';
import { J2CoursePage } from '../pages/J2CoursePage';
import { J2LessonPage } from '../pages/J2LessonPage';
import { J3CoursePage } from '../pages/J3CoursePage';
import { J3LessonPage } from '../pages/J3LessonPage';
import { J4CoursePage } from '../pages/J4CoursePage';
import { J4LessonPage } from '../pages/J4LessonPage';
import { J5CoursePage } from '../pages/J5CoursePage';
import { J5LessonPage } from '../pages/J5LessonPage';
import { JuniorAssessmentPage } from '../pages/JuniorAssessmentPage';
import { JuniorCertificatePage } from '../pages/JuniorCertificatePage';
import { LessonPage } from '../pages/LessonPage';
import { MyPathPage } from '../pages/MyPathPage';
import { ResourcesPage } from '../pages/ResourcesPage';
import { StartPage } from '../pages/StartPage';
import { StudyGuidePage } from '../pages/StudyGuidePage';

export function App() {
  return <AppShell><ScrollToTop /><Routes><Route path="/" element={<HomePage />} /><Route path="/start" element={<StartPage />} /><Route path="/path" element={<MyPathPage />} /><Route path="/resources" element={<ResourcesPage />} /><Route path="/junior-foundations/assessment" element={<JuniorAssessmentPage />} /><Route path="/junior-foundations/certificate" element={<JuniorCertificatePage />} /><Route path="/courses/j1" element={<CoursePage />} /><Route path="/courses/j1/study-guide" element={<StudyGuidePage />} /><Route path="/courses/j1/lesson/:lessonNumber" element={<LessonPage />} /><Route path="/courses/j1/lesson-:lessonNumber" element={<Navigate to="/courses/j1" replace />} /><Route path="/courses/j2" element={<J2CoursePage />} /><Route path="/courses/j2/lesson/:lessonNumber" element={<J2LessonPage />} /><Route path="/courses/j3" element={<J3CoursePage />} /><Route path="/courses/j3/lesson/:lessonNumber" element={<J3LessonPage />} /><Route path="/courses/j4" element={<J4CoursePage />} /><Route path="/courses/j4/lesson/:lessonNumber" element={<J4LessonPage />} /><Route path="/courses/j5" element={<J5CoursePage />} /><Route path="/courses/j5/lesson/:lessonNumber" element={<J5LessonPage />} /><Route path="/courses/c1" element={<C1CoursePage />} /><Route path="/courses/c1/lesson/:lessonNumber" element={<C1LessonPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></AppShell>;
}

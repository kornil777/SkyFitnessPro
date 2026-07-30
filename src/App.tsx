import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CoursesPage from './pages/CoursesPage/CoursesPage';
import AuthPage from './pages/AuthPage/AuthPage';
import CoursePage from './pages/CoursePage/CoursePage';
import CoursePageAuthenticated from './pages/CoursePageAuthenticated/CoursePageAuthenticated';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import TrainingPage from './pages/TrainingPage/TrainingPage';
import TrainingPageWithModal from './pages/TrainingPageWithModal/TrainingPageWithModal';
import TrainingPageSuccess from './pages/TrainingPageSuccess/TrainingPageSuccess';
import TrainingPageUpdated from './pages/TrainingPageUpdated/TrainingPageUpdated';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CoursesPage />} />
        <Route path="/auth" element={<AuthPage onLogin={() => false} onRegister={() => false} />} />
        <Route path="/course/:id" element={<CoursePage />} />
        <Route path="/course/:id/authenticated" element={<CoursePageAuthenticated />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/training/:id" element={<TrainingPage />} />
        <Route path="/training/:id/progress" element={<TrainingPageWithModal />} />
        <Route path="/training/:id/success" element={<TrainingPageSuccess />} />
        <Route path="/training/:id/updated" element={<TrainingPageUpdated />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
// src/App.tsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
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
  const { user, login, register, logout } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Главная публичная страница — CoursesPage теперь не принимает пропсы, всё берёт из контекста */}
        <Route path="/" element={<CoursesPage />} />

        {/* Страница авторизации */}
        <Route path="/auth" element={<AuthPage onLogin={login} onRegister={register} />} />

        {/* Публичная страница курса (неавторизованный) */}
        <Route path="/course/:id" element={<CoursePage />} />

        {/* Приватные страницы */}
        <Route
          path="/course/:id/authenticated"
          element={
            <PrivateRoute>
              <CoursePageAuthenticated />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/training/:id"
          element={
            <PrivateRoute>
              <TrainingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/training/:id/progress"
          element={
            <PrivateRoute>
              <TrainingPageWithModal />
            </PrivateRoute>
          }
        />
        <Route
          path="/training/:id/success"
          element={
            <PrivateRoute>
              <TrainingPageSuccess />
            </PrivateRoute>
          }
        />
        <Route
          path="/training/:id/updated"
          element={
            <PrivateRoute>
              <TrainingPageUpdated />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
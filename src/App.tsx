// src/App.tsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

// Страницы
import CoursesPage from './pages/CoursesPage/CoursesPage';
import AuthPage from './pages/AuthPage/AuthPage';
import CoursePage from './pages/CoursePage/CoursePage';
import CoursePageAuthenticated from './pages/CoursePageAuthenticated/CoursePageAuthenticated';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import WorkoutChoice from './pages/WorkoutChoice/WorkoutChoice';
import TrainingPage from './pages/TrainingPage/TrainingPage';
import TrainingPageWithModal from './pages/TrainingPageWithModal/TrainingPageWithModal';

import TrainingPageUpdated from './pages/TrainingPageUpdated/TrainingPageUpdated';

function App() {
  const { user, login, register, logout } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/" element={<CoursesPage />} />
        <Route path="/auth" element={<AuthPage onLogin={login} onRegister={register} />} />
        <Route path="/course/:id" element={<CoursePage />} />

        {/* Приватные маршруты */}
        <Route
          path="/course/:id/authenticated"
          element={
            <PrivateRoute>
              <CoursePageAuthenticated />
            </PrivateRoute>
          }
        />
        <Route
          path="/course/:courseId/choose-workout"
          element={
            <PrivateRoute>
              <WorkoutChoice />
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
          path="/training/:courseId/:workoutId"
          element={
            <PrivateRoute>
              <TrainingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/training/:courseId/:workoutId/progress"
          element={
            <PrivateRoute>
              <TrainingPageWithModal />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/training/:courseId/:workoutId/updated"
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
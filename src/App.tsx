// src/App.tsx

import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AuthModal from './components/AuthModal/AuthModal';
import CoursesPage from './pages/CoursesPage/CoursesPage';
import CoursePage from './pages/CoursePage/CoursePage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import TrainingPage from './pages/TrainingPage/TrainingPage';
import TrainingPageWithModal from './pages/TrainingPageWithModal/TrainingPageWithModal';

function App() {
  const { user, login, register, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={<CoursesPage openAuthModal={openAuthModal} />}
        />
        <Route
  path="/course/:id"
  element={<CoursePage openAuthModal={openAuthModal} />}
/>
        
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage openAuthModal={openAuthModal} />
            </PrivateRoute>
          }
        />
        <Route
          path="/training/:courseId/:workoutId"
          element={
            <PrivateRoute>
              <TrainingPage openAuthModal={openAuthModal} />
            </PrivateRoute>
          }
        />
        <Route
          path="/training/:courseId/:workoutId/progress"
          element={
            <PrivateRoute>
              <TrainingPageWithModal openAuthModal={openAuthModal} />
            </PrivateRoute>
          }
        />
      </Routes>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onLogin={login}
        onRegister={register}
      />
    </HashRouter>
  );
}

export default App;
// src/components/Header/Header.tsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserProfile from "../UserProfile/UserProfile";
import styles from "./Header.module.css";

interface HeaderProps {
  openAuthModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ openAuthModal }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => navigate("/profile");
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const handleAddCourse = () => navigate("/");

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoLink}>
        <img
          src="/images/logo.svg"
          alt="SkyFitnessPro"
          className={styles.logo}
        />
      </Link>
      <div className={styles.rightSection}>
        {isAuthenticated ? (
          <UserProfile
            userName={
              user?.name || (user?.email ? user.email.split("@")[0] : "")
            }
            userEmail={user?.email || ""}
            onProfileClick={handleProfileClick}
            onLogout={handleLogout}
            onAddCourse={handleAddCourse}
          />
        ) : (
          <button className={styles.loginButton} onClick={openAuthModal}>
            Войти
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import styles from './Loader.module.css';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  fullPage?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ size = 'medium', fullPage = false }) => {
  const sizeClass = styles[size] || styles.medium;
  return (
    <div className={`${styles.container} ${fullPage ? styles.fullPage : ''}`}>
      <div className={`${styles.spinner} ${sizeClass}`}>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
      </div>
    </div>
  );
};

export default Loader;
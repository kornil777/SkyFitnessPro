// src/components/Icon/Icon.tsx

import React from 'react';
import styles from './Icon.module.css';

interface IconProps {
  isAdded?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const Icon: React.FC<IconProps> = ({ isAdded = false, onClick }) => {
  return (
    <div className={styles.iconContainer} onClick={onClick}>
      <div className={styles.crossIcon}>
        {isAdded ? (
          // Минус
          <div className={`${styles.line} ${styles.horizontal}`} />
        ) : (
          // Плюс
          <>
            <div className={`${styles.line} ${styles.horizontal}`} />
            <div className={`${styles.line} ${styles.vertical}`} />
          </>
        )}
      </div>
    </div>
  );
};

export default Icon;
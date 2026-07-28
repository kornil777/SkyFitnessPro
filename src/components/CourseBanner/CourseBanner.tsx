import React from 'react';
import { getBannerColor, getBannerSport } from '../../utils/imageMap';
import styles from './CourseBanner.module.css';

interface CourseBannerProps {
  nameRU: string;
}

const CourseBanner: React.FC<CourseBannerProps> = ({ nameRU }) => {
  const bgColor = getBannerColor(nameRU);
  const sportUrl = getBannerSport(nameRU);

  return (
    <div className={styles.banner} style={{ backgroundColor: bgColor }}>
      <img src={sportUrl} alt={nameRU} className={styles.sportImage} />
      <h2 className={styles.title}>{nameRU}</h2>
    </div>
  );
};

export default CourseBanner;
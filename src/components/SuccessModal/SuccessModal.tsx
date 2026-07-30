import React, { useEffect } from 'react';
import styles from './SuccessModal.module.css';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 2000); // закрываем через 2 секунды
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Ваш прогресс<br />засчитан!</h2>
        <div className={styles.icon}>
          <img src="images/br1.svg" alt="Success" />
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
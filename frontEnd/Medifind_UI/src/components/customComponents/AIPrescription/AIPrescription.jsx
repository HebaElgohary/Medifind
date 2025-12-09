import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './AIPrescription.module.css';
import { FaRobot } from 'react-icons/fa';
export function AIPrescription() {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);


  return (
    <div className={styles.aiContainer}>
      <button 
        className={styles.generateButton}
        disabled={loading}
        title="Generate AI Prescription"
      >
        <FaRobot size={20} />
      </button>
      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
          <div className={styles.prescriptionPopup}>
            <button className={styles.closeButton} onClick={() => setIsOpen(false)}>&times;</button>
            {loading ? (
            <div className={styles.loading}>
              <div className={styles.loadingSpinner}></div>
              Generating prescription...
            </div>
          ) : (
            <div className={styles.prescriptionBox}>
              <h4>AI Generated Prescription</h4>
              <div className={styles.prescriptionContent}>
           
              </div>
            </div>
          )}
          </div>
        </>
      )}
    </div>
  );
}

AIPrescription.propTypes = {
  medicineName: PropTypes.string.isRequired,
  concentration: PropTypes.string.isRequired
};

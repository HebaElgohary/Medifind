import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './AIPrescription.module.css';
//  const GITHUB_PAT = "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";
import { FaRobot } from 'react-icons/fa';
export function AIPrescription({ medicineName, concentration }) {
  // const [prescription, setPrescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);


  // const formatPrescription = (text) => {
  //   // Split the text into lines and clean them up
  //   return text
  //     .split('.')
  //     .map(line => line.trim())
  //     .filter(line => line.length > 0)
  //     .map(line => line + '.');
  // };

  // const getGPT4oResponse = async (userMessage) => {
  //   try {
  //     const response = await fetch(
  //       "https://models.inference.ai.azure.com/chat/completions",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "api-key": 'GITHUB_PAT',
  //         },
  //         body: JSON.stringify({
  //           model: "gpt-4.1",
  //           messages: [
  //             { role: "system", content: "You are a helpful medical assistant that generates simplified drug prescriptions. Keep responses concise and focus on basic dosage and usage information." },
  //             { role: "user", content: userMessage }
  //           ],
  //           max_tokens: 150,
  //           temperature: 0.7,
  //           stream: false
  //         })
  //       }
  //     );
      
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
  //     }
      
  //     const data = await response.json();
  //     if (!data.choices?.[0]?.message?.content) {
  //       throw new Error('Invalid response format from API');
  //     }
  //     const rawContent = data.choices[0].message.content;
  //     return formatPrescription(rawContent);
  //   } catch (error) {
  //     console.error('Error generating prescription:', error);
  //     return 'Failed to generate prescription. Please try again.';
  //   }
  // };

  // const generatePrescription = async () => {
  //   setLoading(true);
  //   setIsOpen(true);
  //   try {
  //     const prescription = await getGPT4oResponse(`Generate a simple prescription for ${medicineName} ${concentration}. Include basic dosage and usage information.`);
  //     setPrescription(prescription);
  //   } catch (error) {
  //     console.error('Error generating prescription:', error);
  //     setPrescription('Failed to generate prescription. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  return (
    <div className={styles.aiContainer}>
      <button 
        // onClick={generatePrescription} 
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
                {/* {prescription?.map((line, index) => (
                  <div key={index} className={styles.prescriptionLine}>
                    <span className={styles.bulletPoint}>•</span>
                    <span>{line}</span>
                  </div>
                ))} */}
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

import React from 'react';
import styles from './ResultsModal.module.css'; // Reusing styles

interface CampaignWinModalProps {
    onExit: () => void;
}

const CampaignWinModal: React.FC<CampaignWinModalProps> = ({ onExit }) => {
    return (
        <div className={styles.overlay}>
            <div className={`${styles.modal} glass-panel`}>
                <div className={styles.icon}>
                    🏆
                </div>

                <h2 className={styles.title}>
                    CAMPAIGN COMPLETED!
                </h2>

                <div className={styles.content}>
                    <p>Congratulations, Detective!</p>
                    <p>You have successfully solved all cases and proven yourself as a master investigator.</p>
                    <div className={styles.stars} style={{ marginTop: '20px' }}>
                        <span className={styles.starFilled}>⭐</span>
                        <span className={styles.starFilled}>⭐</span>
                        <span className={styles.starFilled}>⭐</span>
                        <span className={styles.starFilled}>⭐</span>
                        <span className={styles.starFilled}>⭐</span>
                    </div>
                    <p className={styles.time} style={{ marginTop: '10px' }}>The city is safe thanks to you.</p>
                </div>

                <div className={styles.actions}>
                    <button className={styles.primaryBtn} onClick={onExit}>Return to Menu</button>
                </div>
            </div>
        </div>
    );
};

export default CampaignWinModal;

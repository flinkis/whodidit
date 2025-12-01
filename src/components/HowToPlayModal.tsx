import React, { useState } from 'react';
import styles from './HowToPlayModal.module.css';
import desktopImage from '../assets/tutorial/desktop.png';
import mobileImage from '../assets/tutorial/mobile.png';

interface HowToPlayModalProps {
    onClose: () => void;
}

const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const handleStart = () => {
        if (dontShowAgain) {
            localStorage.setItem('whoDidIt_tutorial_seen', 'true');
        }
        onClose();
    };

    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <img
                    src={desktopImage}
                    alt="Game Board Desktop"
                    className={`${styles.image} ${styles.desktopImage}`}
                />
                <img
                    src={mobileImage}
                    alt="Game Board Mobile"
                    className={`${styles.image} ${styles.mobileImage}`}
                />
            </div>

            <div className={styles.instructions}>
                <div>
                    <h3>Objective</h3>
                    <p>Identify the culprit(s) based on the statements provided by the suspects before the timer runs out.</p>
                </div>

                <div className={styles.desktopInstructions}>
                    <h3>How to Play</h3>
                    <p>
                        Read the statements from each suspect. Some are telling the truth, some are lying.
                    </p>
                    <p>
                        <strong>Left Click</strong> to mark a suspect as a <strong>Culprit</strong>.
                        <br /> <strong>Right Click</strong> to mark as <strong>Innocent</strong>.
                        <br />Click statements to toggle markers (Lie/Truth).
                    </p>
                </div>

                <div className={styles.mobileInstructions}>
                    <h3>How to Play</h3>
                    <p>
                        <strong>Tap</strong> a suspect card to see its statement.
                        <br />Read the statements from each suspect. Some are telling the truth, some are lying.
                        <br /> <strong>Long press</strong> to open the <strong>Action Menu</strong> (Mark Innocent, Lie, Clear).
                    </p>
                </div>
            </div>

            <div className={styles.footer}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={dontShowAgain}
                        onChange={(e) => setDontShowAgain(e.target.checked)}
                    />
                    Don't show this again
                </label>

                <button className={styles.startButton} onClick={handleStart}>
                    Start Game
                </button>
            </div>
        </div>
    );
};

export default HowToPlayModal;

import React from 'react';
import styles from './ResultsModal.module.css';
import { Result } from '../types';

interface ResultsModalProps {
    result: Result | null;
    onNext: () => void;
    onRetry: () => void;
    onExit: () => void;
}

const ResultsModal: React.FC<ResultsModalProps> = ({ result, onNext, onRetry, onExit }) => {
    if (!result) return null;

    return (
        <div className={styles.overlay}>
            <div className={`${styles.modal} glass-panel`}>
                <div className={styles.icon}>
                    {result.success ? '🎉' : '🕵️'}
                </div>

                <h2 className={styles.title}>
                    {result.success ? 'CASE SOLVED!' : 'INCORRECT SOLUTION'}
                </h2>

                <div className={styles.content}>
                    {result.success ? (
                        <>
                            <p>You found the true culprit!</p>
                            <div className={styles.stars}>
                                {[...Array(3)].map((_, i) => (
                                    <span key={i} className={i < (result.stars || 0) ? styles.starFilled : styles.starEmpty}>⭐</span>
                                ))}
                            </div>
                            <p className={styles.time}>Time: {result.time}</p>
                        </>
                    ) : (
                        <>
                            {result.reason === 'timeout' ? (
                                <p>Time's up! The case has gone cold.</p>
                            ) : (
                                <p>That wasn't quite right. Review the clues and try again!</p>
                            )}
                        </>
                    )}
                </div>

                <div className={styles.actions}>
                    {result.success ? (
                        <button className={styles.primaryBtn} onClick={onNext}>Next Case</button>
                    ) : (
                        <button className={styles.primaryBtn} onClick={onRetry}>Continue Investigation</button>
                    )}
                    <button className={styles.secondaryBtn} onClick={onExit}>Exit to Menu</button>
                </div>
            </div>
        </div>
    );
};

export default ResultsModal;

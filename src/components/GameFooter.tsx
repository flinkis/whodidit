import React from 'react';
import styles from './GameFooter.module.css';

interface GameFooterProps {
    onEndCase: () => void;
    onHint: () => void;
    stars: number;
}

const GameFooter: React.FC<GameFooterProps> = ({ onEndCase, onHint, stars }) => {
    return (
        <div className={styles.footer}>
            <button
                className={`${styles.footerButton} ${styles.endCaseButton}`}
                onClick={onEndCase}
            >
                End Case
            </button>
            <button
                className={`${styles.footerButton} ${styles.hintButton}`}
                onClick={onHint}
                disabled={stars <= 0}
            >
                Hint (-1 ⭐)
            </button>
        </div>
    );
};

export default GameFooter;

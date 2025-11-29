import React from 'react';
import styles from './SuspectCard.module.css';
import { Animal } from '../types';

interface SuspectCardProps {
    suspect: Animal;
    state: 'default' | 'culprit' | 'innocent';
    onClick: () => void;
    onContextMenu: (e: React.MouseEvent) => void;
}

const SuspectCard: React.FC<SuspectCardProps> = ({ suspect, state, onClick, onContextMenu }) => {
    return (
        <div
            className={`${styles.card} ${styles[state]}`}
            onClick={onClick}
            onContextMenu={onContextMenu}
            style={{ '--suspect-color': suspect.color } as React.CSSProperties}
        >
            <div className={styles.innerContent}>
                <div className={styles.imageContainer}>
                    <img src={suspect.image} alt={suspect.name} className={styles.suspectImage} />
                </div>

                <div className={styles.infoContainer}>
                    <h3 className={styles.name} style={{ color: suspect.color }}>{suspect.name}</h3>
                    <div className={styles.stats}>
                        <span className={styles.statItem}>{suspect.height}cm</span>
                        <span className={styles.statDivider}>•</span>
                        <span className={`${styles.statItem} ${styles[suspect.diet]}`}>{suspect.diet}</span>
                    </div>
                </div>
            </div>

            {state === 'culprit' && <div className={styles.badge}>GUILTY?</div>}
            {state === 'innocent' && <div className={styles.badge}>INNOCENT</div>}
        </div>
    );
};

export default SuspectCard;

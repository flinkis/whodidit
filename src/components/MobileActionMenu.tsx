import React from 'react';
import styles from './MobileActionMenu.module.css';
import { Animal } from '../types';

interface MobileActionMenuProps {
    suspect: Animal;
    isOpen: boolean;
    onClose: () => void;
    onToggleCulprit: () => void;
    onToggleInnocent: () => void;
    onToggleLie: () => void;
    onClear: () => void;
    isCulprit: boolean;
    isInnocent: boolean;
    isLie: boolean;
}

const MobileActionMenu: React.FC<MobileActionMenuProps> = ({
    suspect,
    isOpen,
    onClose,
    onToggleCulprit,
    onToggleInnocent,
    onToggleLie,
    onClear,
    isCulprit,
    isInnocent,
    isLie
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.menu} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{suspect.name}</h3>
                </div>

                <button
                    className={`${styles.actionBtn} ${styles.culpritBtn}`}
                    onClick={() => { onToggleCulprit(); onClose(); }}
                >
                    {isCulprit ? 'Unmark as Culprit' : 'Mark as Culprit'}
                </button>

                <button
                    className={`${styles.actionBtn} ${styles.innocentBtn}`}
                    onClick={() => { onToggleInnocent(); onClose(); }}
                >
                    {isInnocent ? 'Unmark as Innocent' : 'Mark as Innocent'}
                </button>

                <button
                    className={`${styles.actionBtn} ${styles.lieBtn}`}
                    onClick={() => { onToggleLie(); onClose(); }}
                >
                    {isLie ? 'Unmark Statement as Lie' : 'Mark Statement as Lie'}
                </button>

                <button
                    className={`${styles.actionBtn} ${styles.clearBtn}`}
                    onClick={() => { onClear(); onClose(); }}
                >
                    Clear All Marks
                </button>

                <button className={`${styles.actionBtn} ${styles.cancelBtn}`} onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default MobileActionMenu;

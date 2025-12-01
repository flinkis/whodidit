import React from 'react';
import styles from './SuspectCard.module.css';
import { Animal } from '../types';
import StatementCard from './StatementCard';
import { useLongPress } from '../hooks/useLongPress';

interface SuspectCardProps {
    suspect: Animal;
    state: 'default' | 'culprit' | 'innocent';
    onClick: () => void;
    onContextMenu: (e: React.MouseEvent) => void;
    statementText?: string;
    isStatementMarkedFalse?: boolean;
    onStatementToggle?: () => void;
    isFlipped?: boolean;
    onFlip?: () => void;
    onLongPress?: () => void;
}

const SuspectCard: React.FC<SuspectCardProps> = ({
    suspect,
    state,
    onClick,
    onContextMenu,
    statementText,
    isStatementMarkedFalse,
    onStatementToggle,
    isFlipped = false,
    onFlip,
    onLongPress
}) => {
    const handleCardClick = () => {
        if (onFlip) {
            onFlip();
        } else {
            onClick();
        }
    };

    const longPressHandlers = useLongPress({
        onLongPress: onLongPress || (() => { }),
        onClick: handleCardClick,
        delay: 500
    });

    // If no onLongPress is provided, we still want click handling, but useLongPress handles both.
    // However, if onLongPress is undefined, the hook will still fire onClick.
    // We need to be careful about mixing onFlip/onClick logic.

    // Actually, the hook handles the distinction between click and long press.
    // If onLongPress is not provided, we might want standard click behavior without the delay check?
    // But for consistency on mobile, maybe always use it if onLongPress *could* be passed.
    // In this game, onLongPress is passed when isMobile is true.

    const handlers = onLongPress ? longPressHandlers : { onClick: handleCardClick };

    return (
        <div
            className={`${styles.card} ${isFlipped ? styles.flipped : ''} ${styles[state]}`}
            onContextMenu={onContextMenu}
            style={{ '--suspect-color': suspect.color } as React.CSSProperties}
            {...handlers}
        >
            <div className={styles.cardInner}>
                {/* Front Face */}
                <div className={styles.cardFront}>
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

                {/* Back Face */}
                <div
                    className={styles.cardBack}
                    onClick={(e) => {
                        e.stopPropagation();
                        // If it's a long press on the back, we probably don't want to trigger menu?
                        // But the main card handler handles long press.
                        // Here we just want to flip back if clicked.
                        if (onFlip) onFlip();
                    }}
                >
                    {statementText && onStatementToggle && (
                        <StatementCard
                            text={statementText}
                            suspect={suspect}
                            isMarkedFalse={!!isStatementMarkedFalse}
                            onToggle={() => {
                                // Allow bubble up to trigger flip
                            }}
                            minimal={true}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SuspectCard;

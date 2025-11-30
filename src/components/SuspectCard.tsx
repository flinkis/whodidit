import React, { useState, useRef, useCallback } from 'react';
import styles from './SuspectCard.module.css';
import { Animal } from '../types';

import StatementCard from './StatementCard';

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
    // Long Press Logic
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const isLongPress = useRef(false);

    const startPress = useCallback((e: React.TouchEvent | React.MouseEvent) => {
        if (onLongPress) {
            isLongPress.current = false;
            longPressTimer.current = setTimeout(() => {
                isLongPress.current = true;
                onLongPress();
            }, 500); // 500ms for long press
        }
    }, [onLongPress]);

    const cancelPress = useCallback(() => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        if (isLongPress.current) {
            return; // Ignore click if long press triggered
        }

        if (onFlip) {
            onFlip();
        } else {
            onClick();
        }
    };

    return (
        <div
            className={`${styles.card} ${isFlipped ? styles.flipped : ''} ${styles[state]}`}
            onClick={handleClick}
            onContextMenu={onContextMenu}
            onMouseDown={startPress}
            onMouseUp={cancelPress}
            onMouseLeave={cancelPress}
            onTouchStart={startPress}
            onTouchEnd={cancelPress}
            onTouchCancel={cancelPress}
            style={{ '--suspect-color': suspect.color } as React.CSSProperties}
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
                        if (isLongPress.current) return;
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
                                // onStatementToggle(); // Disable default toggle on mobile if using menu
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

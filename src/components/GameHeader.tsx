import React from 'react';
import styles from './GameHeader.module.css';

interface GameHeaderProps {
    caseNumber: number;
    caseName: string;
    suspectCount: number;
    culpritCount: number;
    minLiars: number;
    maxLiars: number;
    elapsedTime: number;
    stars: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({
    caseNumber,
    caseName,
    suspectCount,
    culpritCount,
    minLiars,
    maxLiars,
    elapsedTime,
    stars
}) => {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const renderStars = () => {
        return (
            <div className={styles.stars}>
                <span className={stars >= 1 ? styles.starFilled : styles.starEmpty}>★</span>
                <span className={stars >= 2 ? styles.starFilled : styles.starEmpty}>★</span>
                <span className={stars >= 3 ? styles.starFilled : styles.starEmpty}>★</span>
            </div>
        );
    };

    const formatLies = () => {
        if (minLiars === maxLiars) {
            return `${minLiars} ${minLiars === 1 ? 'Lie' : 'Lies'}`;
        }
        return `${minLiars}-${maxLiars} Lies`;
    };

    return (
        <header className={styles.header}>
            {/* Top Row: Title (5/8) */}
            <div className={styles.titleSection}>
                <h1 className={styles.titleMain}>A Carnivore Did It!</h1>
            </div>

            {/* Top Row: Case Name (3/8) */}
            <div className={styles.caseNameSection}>
                <div className={styles.caseNumber}>Case #{caseNumber}: {caseName}</div>
            </div>

            {/* Middle Row: Pills (6/8) */}
            <div className={styles.statsContainer}>
                <div className={`${styles.pillBadge} ${styles.pillSuspects}`}>
                    <span>👥</span>
                    <span>{suspectCount} Suspects</span>
                </div>
                <div className={`${styles.pillBadge} ${styles.pillCulprit}`}>
                    <span>🔍</span>
                    <span>{culpritCount} {culpritCount === 1 ? 'Culprit' : 'Culprits'}</span>
                </div>
                <div className={`${styles.pillBadge} ${styles.pillLies}`}>
                    <span>💬</span>
                    <span>{formatLies()}</span>
                </div>
            </div>

            {/* Middle Row: Timer/Stars (2/8) */}
            <div className={styles.timerSection}>
                <div className={styles.timerValue}>{formatTime(elapsedTime)}</div>
                {renderStars()}
            </div>
        </header>
    );
};

export default GameHeader;

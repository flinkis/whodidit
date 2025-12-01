import React, { useState, useEffect } from 'react';
import styles from './GameBoard.module.css';
import { GameData } from '../types';
import { ANIMALS } from '../data/animals';
import SuspectCard from './SuspectCard';
import StatementCard from './StatementCard';
import SubmitButton from './SubmitButton';

interface GameBoardProps {
    gameData: GameData;
    selectedCulprits: Set<number>;
    innocentSuspects: Set<number>;
    markedStatements: Set<number>;
    flippedSuspectIds: Set<number>;
    topCardId: number | null;
    isMobile: boolean;
    onSuspectClick: (id: number) => void;
    onSuspectRightClick: (e: React.MouseEvent, id: number) => void;
    onStatementToggle: (id: number) => void;
    onFlip: (id: number) => void;
    onLongPress: (id: number) => void;
    onSubmit: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
    gameData,
    selectedCulprits,
    innocentSuspects,
    markedStatements,
    flippedSuspectIds,
    topCardId,
    isMobile,
    onSuspectClick,
    onSuspectRightClick,
    onStatementToggle,
    onFlip,
    onLongPress,
    onSubmit
}) => {
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const calculateRadius = (total: number) => {
        const { width, height } = windowSize;

        const CARD_WIDTH = isMobile ? 120 : 220;
        const CARD_HEIGHT = isMobile ? 180 : 400;
        const SCREEN_PADDING = isMobile ? 10 : 40;
        const CENTER_CLEARANCE = isMobile ? 170 : 300;

        // 1. Calculate Maximum Possible Radius (Screen Bounds)
        const maxRadiusX = (width / 2) - (CARD_WIDTH / 2) - SCREEN_PADDING;
        // On mobile, we need to be careful about vertical space
        const availableHeight = isMobile ? (height - 180) : height;
        const maxRadiusY = (availableHeight / 2) - (CARD_HEIGHT / 2) - SCREEN_PADDING;

        // 2. Calculate Ideal Radius based on card count (Circumference)
        // We want enough space so cards don't overlap too much, but not too spread out for few cards.
        // Circumference ~ total * CARD_WIDTH * factor
        // factor > 1 means gaps, < 1 means overlap.
        // For 3 cards, we want them close to center.
        const spacingFactor = isMobile ? 1.5 : 1.6;
        const idealCircumference = total * (CARD_WIDTH * spacingFactor);
        const idealRadiusOverlap = idealCircumference / (2 * Math.PI);

        const targetRadius = Math.max(CENTER_CLEARANCE, idealRadiusOverlap);

        if (isMobile) {
            return {
                x: Math.min(targetRadius, maxRadiusX),
                y: Math.min(targetRadius, maxRadiusY)
            };
        }

        const finalRadius = Math.min(targetRadius, Math.min(maxRadiusX, maxRadiusY));
        return { x: finalRadius, y: finalRadius };
    };

    const totalSuspects = gameData.suspectIds.length;
    const radius = calculateRadius(totalSuspects);

    return (
        <div className={styles.circleContainer}>
            {gameData.suspectIds.map((id, index) => {
                const angle = (index * (360 / totalSuspects)) - 90;

                const x = Math.cos((angle * Math.PI) / 180) * radius.x;
                const y = Math.sin((angle * Math.PI) / 180) * radius.y;

                const suspect = ANIMALS[id];
                const statement = gameData.statements[id];

                let state: 'default' | 'culprit' | 'innocent' = 'default';
                if (selectedCulprits.has(id)) state = 'culprit';
                if (innocentSuspects.has(id)) state = 'innocent';

                return (
                    <div
                        key={id}
                        className={styles.suspectWrapper}
                        style={{
                            transform: `translate(${x}px, ${y}px)`,
                            zIndex: topCardId === id ? 100 : 1
                        }}
                    >
                        <SuspectCard
                            suspect={suspect}
                            state={state}
                            onClick={() => onSuspectClick(id)}
                            onContextMenu={(e) => onSuspectRightClick(e, id)}
                            statementText={statement.text}
                            isStatementMarkedFalse={markedStatements.has(id)}
                            onStatementToggle={() => onStatementToggle(id)}
                            isFlipped={isMobile && flippedSuspectIds.has(id)}
                            onFlip={isMobile ? () => onFlip(id) : undefined}
                            onLongPress={isMobile ? () => onLongPress(id) : undefined}
                        />
                        {!isMobile && (
                            <div className={styles.statementWrapper}>
                                <StatementCard
                                    text={statement.text}
                                    suspect={suspect}
                                    isMarkedFalse={markedStatements.has(id)}
                                    onToggle={() => onStatementToggle(id)}
                                />
                            </div>
                        )}
                    </div>
                );
            })}

            <div className={styles.centerActions}>
                <SubmitButton onClick={onSubmit} />
            </div>
        </div>
    );
};

export default GameBoard;

import React, { useState, useEffect, useRef } from 'react';
import { generateCase } from '../logic/caseGenerator';
import { ANIMALS } from '../data/animals';
import { CASE_NAMES } from '../data/caseNames';
import SuspectCard from './SuspectCard';
import StatementCard from './StatementCard';
import ResultsModal from './ResultsModal';
import GameHeader from './GameHeader';
import SubmitButton from './SubmitButton';
import MobileActionMenu from './MobileActionMenu';
import styles from './GameScreen.module.css';
import { GameConfig, GameData, Result } from '../types';

interface GameScreenProps {
    config: GameConfig;
    onExit: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ config, onExit }) => {
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [caseNumber, setCaseNumber] = useState(Math.floor(Math.random() * 1000));
    const [caseName, setCaseName] = useState(CASE_NAMES[Math.floor(Math.random() * CASE_NAMES.length)]);

    // Game State
    const [selectedCulprits, setSelectedCulprits] = useState<Set<number>>(new Set());
    const [innocentSuspects, setInnocentSuspects] = useState<Set<number>>(new Set());
    const [markedStatements, setMarkedStatements] = useState<Set<number>>(new Set());
    const [startTime, setStartTime] = useState(Date.now());
    const [timeLeft, setTimeLeft] = useState(600);
    const [result, setResult] = useState<Result | null>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [flippedSuspectIds, setFlippedSuspectIds] = useState<Set<number>>(new Set());
    const [menuSuspectId, setMenuSuspectId] = useState<number | null>(null);
    const [topCardId, setTopCardId] = useState<number | null>(null);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize Game
    useEffect(() => {
        startNewCase();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [config]);

    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const calculateRadius = (total: number) => {
        const { width, height } = windowSize;

        const CARD_WIDTH = isMobile ? 120 : 220;
        const CARD_HEIGHT = isMobile ? 180 : 400;

        const CENTER_CLEARANCE = isMobile ? 60 : 100;
        const SCREEN_PADDING = isMobile ? 10 : 40;

        const minCircumference = total * (CARD_WIDTH * (isMobile ? 1.05 : 1.1));
        const minRadiusOverlap = minCircumference / (2 * Math.PI);

        const minRadiusCenter = CENTER_CLEARANCE + (isMobile ? 80 : 120);

        const minRadius = Math.max(minRadiusOverlap, minRadiusCenter);

        const maxRadiusX = (width / 2) - (CARD_WIDTH / 2) - SCREEN_PADDING;
        const maxRadiusY = (height / 2) - (CARD_HEIGHT / 2) - SCREEN_PADDING;

        const maxRadius = Math.min(maxRadiusX, maxRadiusY);

        return Math.min(Math.max(minRadius, maxRadius * 0.85), maxRadius);
    };

    // Timer Logic
    useEffect(() => {
        if (!loading && !result && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        setResult({
                            success: false,
                            solution: gameData!.solution,
                            reason: 'timeout'
                        });
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [loading, result, gameData]);

    const startNewCase = () => {
        setLoading(true);
        setResult(null);
        setSelectedCulprits(new Set());
        setInnocentSuspects(new Set());
        setMarkedStatements(new Set());
        setError(null);

        // Generate new case details
        setCaseNumber(Math.floor(Math.random() * 1000));
        setCaseName(CASE_NAMES[Math.floor(Math.random() * CASE_NAMES.length)]);

        setTimeout(() => {
            try {
                const newCase = generateCase(config);
                setGameData(newCase);
                setStartTime(Date.now());
                setTimeLeft(600);
                setLoading(false);
            } catch (err) {
                console.error("Failed to generate case:", err);
                setError("Failed to generate a valid case. Please try again.");
                setLoading(false);
            }
        }, 100);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getStarRating = (remainingTime: number) => {
        const elapsed = 600 - remainingTime;
        if (elapsed < 60) return 3;
        if (elapsed < 120) return 2;
        return 1;
    };

    const handleSuspectClick = (id: number) => {
        if (result) return;

        const newSelected = new Set(selectedCulprits);
        const newInnocent = new Set(innocentSuspects);

        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
            newInnocent.delete(id);
        }

        setSelectedCulprits(newSelected);
        setInnocentSuspects(newInnocent);
        setTopCardId(id);
    };

    const handleSuspectRightClick = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        if (result) return;

        const newInnocent = new Set(innocentSuspects);
        const newSelected = new Set(selectedCulprits);

        if (newInnocent.has(id)) {
            newInnocent.delete(id);
        } else {
            newInnocent.add(id);
            newSelected.delete(id);
        }

        setInnocentSuspects(newInnocent);
        setSelectedCulprits(newSelected);
        setTopCardId(id);
    };

    const handleStatementToggle = (id: number) => {
        if (result) return;

        const newMarked = new Set(markedStatements);
        if (newMarked.has(id)) {
            newMarked.delete(id);
        } else {
            newMarked.add(id);
        }
        setMarkedStatements(newMarked);
    };

    const handleMenuAction = (action: 'culprit' | 'innocent' | 'lie' | 'clear') => {
        if (!menuSuspectId) return;

        switch (action) {
            case 'culprit':
                handleSuspectClick(menuSuspectId);
                break;
            case 'innocent':
                // Custom logic to toggle innocent without affecting others if needed, 
                // but handleSuspectRightClick toggles innocent/selected correctly.
                // We need to simulate the event or extract logic.
                // Extracting logic:
                const newInnocent = new Set(innocentSuspects);
                const newSelected = new Set(selectedCulprits);
                if (newInnocent.has(menuSuspectId)) {
                    newInnocent.delete(menuSuspectId);
                } else {
                    newInnocent.add(menuSuspectId);
                    newSelected.delete(menuSuspectId);
                }
                setInnocentSuspects(newInnocent);
                setSelectedCulprits(newSelected);
                break;
            case 'lie':
                handleStatementToggle(menuSuspectId);
                break;
            case 'clear':
                const clearedInnocent = new Set(innocentSuspects);
                const clearedSelected = new Set(selectedCulprits);
                const clearedStatements = new Set(markedStatements);

                clearedInnocent.delete(menuSuspectId);
                clearedSelected.delete(menuSuspectId);
                clearedStatements.delete(menuSuspectId);

                setInnocentSuspects(clearedInnocent);
                setSelectedCulprits(clearedSelected);
                setMarkedStatements(clearedStatements);
                break;
        }
    };

    const handleSubmit = () => {
        if (!gameData) return;

        if (selectedCulprits.size !== config.culpritCount) {
            alert(`Please select exactly ${config.culpritCount} culprit(s).`);
            return;
        }

        const trueCulprits = gameData.solution.culprits;
        let isCorrect = true;

        if (selectedCulprits.size !== trueCulprits.size) isCorrect = false;
        for (const id of selectedCulprits) {
            if (!trueCulprits.has(id)) isCorrect = false;
        }

        if (isCorrect) {
            const stars = getStarRating(timeLeft);
            setResult({
                success: true,
                stars,
                time: formatTime(600 - timeLeft),
                solution: gameData.solution
            });
        } else {
            setResult({
                success: false,
                solution: gameData.solution
            });
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}>🔍</div>
                <h2>Generating Case...</h2>
                <p>Consulting the archives...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={onExit}>Return to Menu</button>
            </div>
        );
    }

    if (!gameData) return null;

    return (
        <div className={styles.gameContainer}>
            <GameHeader
                caseNumber={caseNumber}
                caseName={caseName}
                suspectCount={config.suspectCount}
                culpritCount={config.culpritCount}
                minLiars={config.constraints.minLiars ?? 0}
                maxLiars={config.constraints.maxLiars ?? 0}
                timeLeft={timeLeft}
                stars={getStarRating(timeLeft)}
            />

            {/* Main Game Area */}
            <div className={styles.circleContainer}>
                {/* Glowing Ring Background */}
                <div className={styles.ringBackground}></div>

                {gameData.suspectIds.map((id, index) => {
                    const total = gameData.suspectIds.length;
                    const angle = (index * (360 / total)) - 90;
                    const radius = calculateRadius(total);

                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;

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
                                onClick={() => handleSuspectClick(id)}
                                onContextMenu={(e) => handleSuspectRightClick(e, id)}
                                statementText={statement.text}
                                isStatementMarkedFalse={markedStatements.has(id)}
                                onStatementToggle={() => handleStatementToggle(id)}
                                isFlipped={isMobile && flippedSuspectIds.has(id)}
                                onFlip={isMobile ? () => {
                                    const newFlipped = new Set(flippedSuspectIds);
                                    if (newFlipped.has(id)) {
                                        newFlipped.delete(id);
                                    } else {
                                        newFlipped.add(id);
                                    }
                                    setFlippedSuspectIds(newFlipped);
                                    setTopCardId(id);
                                } : undefined}
                                onLongPress={isMobile ? () => setMenuSuspectId(id) : undefined}
                            />
                            {!isMobile && (
                                <div className={styles.statementWrapper}>
                                    <StatementCard
                                        text={statement.text}
                                        suspect={suspect}
                                        isMarkedFalse={markedStatements.has(id)}
                                        onToggle={() => handleStatementToggle(id)}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Center Button */}
                <div className={styles.centerActions}>
                    <SubmitButton onClick={handleSubmit} />
                </div>
            </div>

            <ResultsModal
                result={result}
                onNext={startNewCase}
                onRetry={() => setResult(null)}
                onExit={onExit}
            />

            {menuSuspectId !== null && gameData && (
                <MobileActionMenu
                    suspect={ANIMALS[menuSuspectId]}
                    isOpen={true}
                    onClose={() => setMenuSuspectId(null)}
                    onToggleCulprit={() => handleMenuAction('culprit')}
                    onToggleInnocent={() => handleMenuAction('innocent')}
                    onToggleLie={() => handleMenuAction('lie')}
                    onClear={() => handleMenuAction('clear')}
                    isCulprit={selectedCulprits.has(menuSuspectId)}
                    isInnocent={innocentSuspects.has(menuSuspectId)}
                    isLie={markedStatements.has(menuSuspectId)}
                />
            )}
        </div>
    );
};

export default GameScreen;

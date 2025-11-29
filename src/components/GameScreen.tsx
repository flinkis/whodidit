import React, { useState, useEffect, useRef } from 'react';
import { generateCase } from '../logic/caseGenerator';
import { ANIMALS } from '../data/animals';
import SuspectCard from './SuspectCard';
import StatementCard from './StatementCard';
import ResultsModal from './ResultsModal';
import styles from './GameScreen.module.css';
import { GameConfig, GameData } from '../types';

interface GameScreenProps {
    config: GameConfig;
    onExit: () => void;
}

interface Result {
    success: boolean;
    stars?: number;
    time?: string;
    solution: any;
}

const GameScreen: React.FC<GameScreenProps> = ({ config, onExit }) => {
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [caseNumber] = useState(Math.floor(Math.random() * 1000));

    // Game State
    const [selectedCulprits, setSelectedCulprits] = useState<Set<number>>(new Set());
    const [innocentSuspects, setInnocentSuspects] = useState<Set<number>>(new Set());
    const [markedStatements, setMarkedStatements] = useState<Set<number>>(new Set());
    const [startTime, setStartTime] = useState(Date.now());
    const [elapsedTime, setElapsedTime] = useState(0);
    const [result, setResult] = useState<Result | null>(null);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize Game
    useEffect(() => {
        startNewCase();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [config]);

    // Timer Logic
    useEffect(() => {
        if (!loading && !result) {
            timerRef.current = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [loading, result, startTime]);

    const startNewCase = () => {
        setLoading(true);
        setResult(null);
        setSelectedCulprits(new Set());
        setInnocentSuspects(new Set());
        setMarkedStatements(new Set());
        setError(null);

        setTimeout(() => {
            try {
                const newCase = generateCase(config);
                setGameData(newCase);
                setStartTime(Date.now());
                setElapsedTime(0);
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

    const getStarRating = (seconds: number) => {
        if (seconds < 60) return 3;
        if (seconds < 120) return 2;
        return 1;
    };

    const renderStars = () => {
        const rating = getStarRating(elapsedTime);
        return (
            <div className={styles.stars}>
                <span className={rating >= 1 ? styles.starFilled : styles.starEmpty}>★</span>
                <span className={rating >= 2 ? styles.starFilled : styles.starEmpty}>★</span>
                <span className={rating >= 3 ? styles.starFilled : styles.starEmpty}>★</span>
            </div>
        );
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
            const stars = getStarRating(elapsedTime);
            setResult({
                success: true,
                stars,
                time: formatTime(elapsedTime),
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
            {/* Header Pill */}
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <div className={styles.titleMain}>A Carnivore Did It! - Case #{caseNumber}</div>
                    <div className={styles.titleSub}>
                        <span className={styles.pillBadge}>{config.suspectCount} Suspects</span>
                        <span className={styles.pillBadge}>{config.culpritCount} Culprit</span>
                        <span className={styles.pillBadge}>{config.constraints.minLiars}-{config.constraints.maxLiars} Lies</span>
                    </div>
                </div>

                <div className={styles.timerContainer}>
                    <div className={styles.timerValue}>{formatTime(elapsedTime)}</div>
                    {renderStars()}
                </div>
            </header>

            {/* Main Game Area */}
            <div className={styles.circleContainer}>
                {/* Glowing Ring Background */}
                <div className={styles.ringBackground}></div>

                {gameData.suspectIds.map((id, index) => {
                    const total = gameData.suspectIds.length;
                    const angle = (index * (360 / total)) - 90;
                    const radius = (total === 7 ? 450 : total === 5 ? 350 : 300);// 450 for 7 suspects, 350 for 5 suspects, 275 for 3 suspects

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
                                transform: `translate(${x}px, ${y}px)`
                            }}
                        >
                            <SuspectCard
                                suspect={suspect}
                                state={state}
                                onClick={() => handleSuspectClick(id)}
                                onContextMenu={(e) => handleSuspectRightClick(e, id)}
                            />
                            <div className={styles.statementWrapper}>
                                <StatementCard
                                    text={statement.text}
                                    suspect={suspect}
                                    isMarkedFalse={markedStatements.has(id)}
                                    onToggle={() => handleStatementToggle(id)}
                                />
                            </div>
                        </div>
                    );
                })}

                {/* Center Button */}
                <div className={styles.centerActions}>
                    <button className={styles.submitBtn} onClick={handleSubmit}>
                        <div className={styles.btnIcon}>🔍</div>
                        <div className={styles.btnText}>SUBMIT<br />SOLUTION</div>
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className={styles.footerControls}>
                <button className={styles.hintBtn} onClick={() => alert("Hint: Try marking statements as false if they contradict known facts!")}>
                    Get Hint
                </button>

                <div className={styles.progressContainer}>
                    {/* Placeholder for progress/stars remaining */}
                    <div className={styles.progressBar} style={{ width: '80%' }}></div>
                </div>
            </div>

            <ResultsModal
                result={result}
                onNext={startNewCase}
                onRetry={() => setResult(null)}
                onExit={onExit}
            />
        </div>
    );
};

export default GameScreen;

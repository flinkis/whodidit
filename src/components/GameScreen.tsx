import React, { useState, useEffect } from 'react';
import { generateCase } from '../logic/caseGenerator';
import { ANIMALS } from '../data/animals';
import { CASE_NAMES } from '../data/caseNames';
import GameHeader from './GameHeader';
import GameBoard from './GameBoard';
import Toast from './Toast';
import MobileActionMenu from './MobileActionMenu';
import styles from './GameScreen.module.css';
import { GameConfig, GameData, Result } from '../types';
import { useGame } from '../context/GameContext';
import GameFooter from './GameFooter';
import { useModal } from '../context/ModalContext';
import modalStyles from './Modal.module.css'; // Import modal styles for content rendering
import HowToPlayModal from './HowToPlayModal';

interface GameScreenProps {
    config: GameConfig;
    onExit: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ config, onExit }) => {
    const { gameState, advanceCampaign, timeLeft, stopTimer, startTimer, stars, decrementStars, startOpenCase, startCampaign } = useGame();
    const { openModal, closeModal } = useModal();
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [caseNumber, setCaseNumber] = useState(Math.floor(Math.random() * 1000));
    const [caseName, setCaseName] = useState(CASE_NAMES[Math.floor(Math.random() * CASE_NAMES.length)]);

    // Game State
    const [selectedCulprits, setSelectedCulprits] = useState<Set<number>>(new Set());
    const [innocentSuspects, setInnocentSuspects] = useState<Set<number>>(new Set());
    const [markedStatements, setMarkedStatements] = useState<Set<number>>(new Set());
    // Removed local startTime and timeLeft
    const [result, setResult] = useState<Result | null>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [flippedSuspectIds, setFlippedSuspectIds] = useState<Set<number>>(new Set());
    const [menuSuspectId, setMenuSuspectId] = useState<number | null>(null);
    const [topCardId, setTopCardId] = useState<number | null>(null);

    // Toast State
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Initialize Game
    useEffect(() => {
        startNewCase();
        // Ensure timer is running when component mounts/updates
        startTimer();
        return () => {
            // Optional: stop timer on unmount if needed, but context handles exitToMenu
        };
    }, [config]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);

        // Check for tutorial
        const hasSeenTutorial = localStorage.getItem('whoDidIt_tutorial_seen');
        if (!hasSeenTutorial) {
            // Small delay to ensure modal context is ready and to not conflict with other potential modals
            setTimeout(() => {
                openModal({
                    title: 'HOW TO PLAY',
                    icon: !isMobile ? '🎓' : null,
                    children: <HowToPlayModal onClose={closeModal} />,
                    actions: null
                });
            }, 500);
        }

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Watch for timeout from context
    useEffect(() => {
        if (timeLeft === 0 && !result && !loading) {
            const newResult: Result = {
                success: false,
                solution: gameData?.solution || { culprits: new Set(), liars: new Set() },
                reason: 'timeout'
            };
            setResult(newResult);
            stopTimer();
            // Modal will be opened by the result effect
        }
    }, [timeLeft, result, loading, gameData, stopTimer]);

    const startNewCase = (reset: boolean = false) => {
        if (reset) {
            if (gameState.mode === 'campaign') {
                startCampaign();
            } else {
                startOpenCase(gameState.currentLevelId);
            }
        }

        setLoading(true);
        setResult(null);
        setSelectedCulprits(new Set());
        setInnocentSuspects(new Set());
        setMarkedStatements(new Set());
        setFlippedSuspectIds(new Set());
        setError(null);

        // Generate new case details
        setCaseNumber(Math.floor(Math.random() * 1000));
        setCaseName(CASE_NAMES[Math.floor(Math.random() * CASE_NAMES.length)]);

        setTimeout(() => {
            try {
                const newCase = generateCase(config);
                setGameData(newCase);
                setLoading(false);
                // Timer is managed by context, just ensure it's running
                startTimer();
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

    // Effect to handle result changes and open modal
    useEffect(() => {
        if (!result) return;

        const isCampaign = gameState.mode === 'campaign';

        const handleNext = () => {
            closeModal();
            if (isCampaign) {
                advanceCampaign();
            } else {
                startNewCase(true); // Reset stats for new open case
            }
        };

        const handleRetry = () => {
            startNewCase(true); // Reset stats on retry
            closeModal();
        };

        const handleExit = () => {
            closeModal();
            onExit();
        };

        const actions = (
            <>
                {result.success ? (
                    <button className={modalStyles.primaryBtn} onClick={handleNext}>
                        {isCampaign ? 'Next Level' : 'Another Case?'}
                    </button>
                ) : isCampaign && result.reason !== 'given_up' ? (
                    null
                ) : (
                    <button className={modalStyles.primaryBtn} onClick={handleRetry}>Try Again</button>
                )}
                <button className={modalStyles.secondaryBtn} onClick={handleExit}>Exit to Menu</button>
            </>
        );

        const content = result.success ? (
            <>
                <p>You found the true culprit!</p>
                <div className={modalStyles.stars} style={{ fontSize: '2.5rem', margin: '1rem 0', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    {[...Array(isCampaign ? 5 : 3)].map((_, i) => (
                        <span key={i} className={i < (result.stars || 0) ? modalStyles.starFilled : modalStyles.starEmpty}>⭐</span>
                    ))}
                </div>
                <p className={modalStyles.time} style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Time: {result.time}</p>
            </>
        ) : (
            <>
                {result.reason === 'timeout' ? (
                    <p>You're too late! The case has gone cold.</p>
                ) : result.reason === 'stars' ? (
                    <p>You've lost all your stars! <br />The chief has taken you off the case.</p>
                ) : result.reason === 'given_up' ? (
                    <p>Nobody remembers a quitter, don't give up yet!</p>
                ) : (
                    <p>That wasn't quite right. Review the clues and try again!</p>
                )}
            </>
        );

        const title = result.reason === 'timeout' ? 'TIME IS UP' : result.reason === 'stars' ? 'BETTER LUCK NEXT TIME' : result.reason === 'given_up' ? 'GIVING UP?' : result.success ? 'CASE SOLVED!' : 'INCORRECT SOLUTION';

        openModal({
            icon: result.success ? '🎉' : '🕵️',
            title: title,
            children: content,
            actions: actions
        });

    }, [result]);

    // Effect for Campaign Win
    useEffect(() => {
        if (gameState.isCampaignComplete) {
            const handleExit = () => {
                closeModal();
                onExit();
            };

            const actions = (
                <button className={modalStyles.primaryBtn} onClick={handleExit}>Return to Menu</button>
            );

            openModal({
                icon: '🏆',
                title: 'CAMPAIGN COMPLETED!',
                actions: actions,
                children: (
                    <>
                        <p>Congratulations, Detective!</p>
                        <p>You have successfully solved all cases and proven yourself as a master investigator.</p>
                        <div className={modalStyles.stars} style={{ marginTop: '20px', fontSize: '2.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                            <span className={modalStyles.starFilled}>⭐</span>
                            <span className={modalStyles.starFilled}>⭐</span>
                            <span className={modalStyles.starFilled}>⭐</span>
                            <span className={modalStyles.starFilled}>⭐</span>
                            <span className={modalStyles.starFilled}>⭐</span>
                        </div>
                        <p className={modalStyles.time} style={{ marginTop: '10px', fontFamily: 'monospace', fontSize: '1.2rem', color: 'var(--text-primary)' }}>The city is safe thanks to you.</p>
                    </>
                )
            });
        }
    }, [gameState.isCampaignComplete]);



    const handleSuspectClick = (id: number) => {
        if (result) return;

        const newSelected = new Set(selectedCulprits);
        const newInnocent = new Set(innocentSuspects);

        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            if (newSelected.size >= config.culpritCount) {
                setToastMessage(`You can only select ${config.culpritCount} culprit(s).`);
                setShowToast(true);
                return;
            }
            newSelected.add(id);
            newInnocent.delete(id);
        }

        setSelectedCulprits(newSelected);
        setInnocentSuspects(newInnocent);
        setTopCardId(id);
    };

    const handleSuspectRightClick = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        if (result || isMobile) return;

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

    const handleFlip = (id: number) => {
        const newFlipped = new Set(flippedSuspectIds);
        if (newFlipped.has(id)) {
            newFlipped.delete(id);
        } else {
            newFlipped.add(id);
        }
        setFlippedSuspectIds(newFlipped);
        setTopCardId(id);
    };

    const handleSubmit = () => {
        if (!gameData) return;

        if (selectedCulprits.size !== config.culpritCount) {
            setToastMessage(`Please select exactly ${config.culpritCount} culprit(s).`);
            setShowToast(true);
            return;
        }

        const trueCulprits = gameData.solution.culprits;
        let isCorrect = true;

        setFlippedSuspectIds(new Set());

        if (selectedCulprits.size !== trueCulprits.size) isCorrect = false;
        for (const id of selectedCulprits) {
            if (!trueCulprits.has(id)) isCorrect = false;
        }

        if (isCorrect) {
            setResult({
                success: true,
                stars,
                time: formatTime(gameState.mode === 'open' ? 300 - timeLeft : 900 - timeLeft),
                solution: gameData.solution
            });
            stopTimer();
        } else {
            decrementStars();
            // Check if this was the last star (state update is async, so check current value - 1)
            if (stars <= 1) {
                setResult({
                    success: false,
                    solution: gameData.solution,
                    reason: 'stars' // New reason for running out of stars
                });
                stopTimer();
            } else {
                setToastMessage("Incorrect! You lost a star.");
                setShowToast(true);
            }
        }
    };

    const handleToastClose = React.useCallback(() => {
        setShowToast(false);
    }, []);

    const handleEndCase = () => {
        if (!gameData) return;
        setResult({
            success: false,
            solution: gameData.solution,
            reason: 'given_up'
        });
        stopTimer();
    };

    const handleHint = () => {
        if (!gameData) return;

        if (stars <= 0) {
            setToastMessage("Not enough stars for a hint!");
            setShowToast(true);
            return;
        }

        // Find innocent suspects (not culprits)
        const allInnocents = gameData.suspectIds.filter(id => !gameData.solution.culprits.has(id));

        // Filter out those already known (in innocentSuspects set)
        const unknownInnocents = allInnocents.filter(id => !innocentSuspects.has(id));

        if (unknownInnocents.length === 0) {
            setToastMessage("No more hints available!");
            setShowToast(true);
            return;
        }

        // Pick one at random
        const hintId = unknownInnocents[Math.floor(Math.random() * unknownInnocents.length)];
        const suspectName = ANIMALS[hintId].name;

        // Reveal it
        const newInnocent = new Set(innocentSuspects);
        newInnocent.add(hintId);
        setInnocentSuspects(newInnocent);

        // Also remove from selected culprits if present (just in case)
        if (selectedCulprits.has(hintId)) {
            const newSelected = new Set(selectedCulprits);
            newSelected.delete(hintId);
            setSelectedCulprits(newSelected);
        }

        decrementStars();
        setToastMessage(`Hint: ${suspectName} is innocent! (-1 Star)`);
        setShowToast(true);
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
            />

            {/* Main Game Area */}
            <GameBoard
                gameData={gameData}
                selectedCulprits={selectedCulprits}
                innocentSuspects={innocentSuspects}
                markedStatements={markedStatements}
                flippedSuspectIds={flippedSuspectIds}
                topCardId={topCardId}
                isMobile={isMobile}
                onSuspectClick={handleSuspectClick}
                onSuspectRightClick={handleSuspectRightClick}
                onStatementToggle={handleStatementToggle}
                onFlip={handleFlip}
                onLongPress={(id) => setMenuSuspectId(id)}
                onSubmit={handleSubmit}
            />

            {/* Modals are now handled by ModalContext */}

            {
                menuSuspectId !== null && gameData && (
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
                )
            }

            <Toast
                message={toastMessage}
                isVisible={showToast}
                onClose={handleToastClose}
            />

            <GameFooter
                onEndCase={handleEndCase}
                onHint={handleHint}
                stars={stars}
            />
        </div >
    );
};

export default GameScreen;

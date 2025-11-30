import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { GameConfig } from '../types';
import { LEVELS } from '../data/levels';

interface GameState {
    screen: 'menu' | 'game';
    mode: 'open' | 'campaign';
    currentLevelId: string;
    campaignProgress: number; // 1-8
    isCampaignComplete: boolean;
}

interface GameContextType {
    gameState: GameState;
    currentConfig: GameConfig | null;
    timeLeft: number;
    isTimerRunning: boolean;
    stars: number;
    startOpenCase: (levelId: string) => void;
    startCampaign: () => void;
    advanceCampaign: () => void;
    exitToMenu: () => void;
    stopTimer: () => void;
    startTimer: () => void;
    decrementStars: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [gameState, setGameState] = useState<GameState>({
        screen: 'menu',
        mode: 'open',
        currentLevelId: 'level1',
        campaignProgress: 1,
        isCampaignComplete: false
    });

    const [timeLeft, setTimeLeft] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const [stars, setStars] = useState(3);

    const currentConfig = LEVELS[gameState.currentLevelId] || null;

    // Timer Logic
    useEffect(() => {
        if (isTimerRunning && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsTimerRunning(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isTimerRunning, timeLeft]);

    const startOpenCase = (levelId: string) => {
        setGameState({
            screen: 'game',
            mode: 'open',
            currentLevelId: levelId,
            campaignProgress: 1, // Not relevant in open mode
            isCampaignComplete: false
        });
        setTimeLeft(300); // 5 minutes
        setStars(3);
        setIsTimerRunning(true);
    };

    const startCampaign = () => {
        setGameState({
            screen: 'game',
            mode: 'campaign',
            currentLevelId: 'level1',
            campaignProgress: 1,
            isCampaignComplete: false
        });
        setTimeLeft(900); // 15 minutes
        setStars(3);
        setIsTimerRunning(true);
    };

    const advanceCampaign = () => {
        if (gameState.mode !== 'campaign') return;

        const nextProgress = gameState.campaignProgress + 1;
        const nextLevelId = `level${nextProgress}`;

        if (LEVELS[nextLevelId]) {
            setGameState(prev => ({
                ...prev,
                currentLevelId: nextLevelId,
                campaignProgress: nextProgress
            }));
            // Do NOT reset timer for campaign
            setIsTimerRunning(true);
        } else {
            // Campaign finished!
            setGameState(prev => ({
                ...prev,
                isCampaignComplete: true
            }));
            setIsTimerRunning(false);
        }
    };

    const exitToMenu = () => {
        setGameState(prev => ({
            ...prev,
            screen: 'menu'
        }));
        setIsTimerRunning(false);
    };

    const stopTimer = () => setIsTimerRunning(false);
    const startTimer = () => setIsTimerRunning(true);

    const decrementStars = () => {
        setStars(prev => Math.max(0, prev - 1));
    };

    return (
        <GameContext.Provider value={{
            gameState,
            currentConfig,
            timeLeft,
            isTimerRunning,
            stars,
            startOpenCase,
            startCampaign,
            advanceCampaign,
            exitToMenu,
            stopTimer,
            startTimer,
            decrementStars
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};

import React from 'react';
import styles from './MenuScreen.module.css';
import { GameConfig } from '../types';

interface MenuScreenProps {
    onStartGame: (config: GameConfig) => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ onStartGame }) => {
    const startOpenCase = (difficulty: 'easy' | 'medium' | 'hard') => {
        const config: GameConfig = {
            mode: 'open',
            suspectCount: difficulty === 'easy' ? 3 : (difficulty === 'medium' ? 5 : 7),
            culpritCount: difficulty === 'easy' ? 1 : (difficulty === 'medium' ? 1 : 2),
            difficulty: difficulty === 'easy' ? 1 : (difficulty === 'medium' ? 3 : 5),
            constraints: {
                minLiars: difficulty === 'easy' ? 0 : 1,
                maxLiars: difficulty === 'easy' ? 1 : 3
            }
        };
        onStartGame(config);
    };

    return (
        <div className={styles.menuContainer}>
            <header className={styles.header}>
                <div className={styles.logoIcon}>🔍</div>
                <h1 className={styles.title}>A CARNIVORE DID IT!</h1>
                <p className={styles.subtitle}>A Logic Mystery Game</p>
            </header>

            <div className={styles.modeSelection}>
                <div className={`${styles.modeCard} glass-panel`}>
                    <div className={styles.cardIcon}>📂</div>
                    <h2>Open Case Mode</h2>
                    <p>Solve a single random case. Perfect for practice.</p>

                    <div className={styles.difficultyButtons}>
                        <button
                            className={`${styles.diffBtn} ${styles.easy}`}
                            onClick={() => startOpenCase('easy')}
                        >
                            Beginner (3 Suspects)
                        </button>
                        <button
                            className={`${styles.diffBtn} ${styles.medium}`}
                            onClick={() => startOpenCase('medium')}
                        >
                            Intermediate (5 Suspects)
                        </button>
                        <button
                            className={`${styles.diffBtn} ${styles.hard}`}
                            onClick={() => startOpenCase('hard')}
                        >
                            Expert (7 Suspects)
                        </button>
                    </div>
                </div>

                <div className={`${styles.modeCard} glass-panel ${styles.campaignCard}`}>
                    <div className={styles.cardIcon}>🏆</div>
                    <h2>Campaign Mode</h2>
                    <p>Race against time through 8 increasingly difficult cases.</p>
                    <button className={styles.startBtn} disabled title="Coming Soon">
                        Start Campaign (Coming Soon)
                    </button>
                </div>
            </div>

            <footer className={styles.footer}>
                <p>Procedurally Generated Logic Puzzles</p>
            </footer>
        </div>
    );
};

export default MenuScreen;

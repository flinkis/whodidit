import React from 'react';
import styles from './MenuScreen.module.css';
import { GameConfig } from '../types';
import { LEVELS } from '../data/levels';

interface MenuScreenProps {
    onStartGame: (config: GameConfig) => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ onStartGame }) => {
    const startOpenCase = (level: string) => {
        const config = LEVELS[level];
        if (config) {
            onStartGame(config);
        }
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
                            onClick={() => startOpenCase('level1')}
                        >
                            Introductory (3 Suspects)
                        </button>
                        <button
                            className={`${styles.diffBtn} ${styles.medium}`}
                            onClick={() => startOpenCase('level3')}
                        >
                            Intermediate (5 Suspects)
                        </button>
                        <button
                            className={`${styles.diffBtn} ${styles.medium}`}
                            onClick={() => startOpenCase('level7')}
                        >
                            Advanced (7 Suspects)
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

import React from 'react';
import styles from './StatementCard.module.css';
import { ANIMALS } from '../data/animals';
import { Animal } from '../types';

interface StatementCardProps {
    text: string;
    suspect: Animal;
    isMarkedFalse: boolean;
    onToggle: (e?: React.MouseEvent) => void;
    minimal?: boolean;
}

const StatementCard: React.FC<StatementCardProps> = ({ text, suspect, isMarkedFalse, onToggle, minimal = false }) => {
    const highlightKeywords = (content: string) => {
        const keywords = ["did", "didn't", "lying", "truth", "shorter", "taller"];
        const suspectNames = Object.values(ANIMALS).map(a => a.name);

        // Combine keywords and names, sort by length descending to match longest phrases first
        const allPatterns = [...keywords, ...suspectNames].sort((a, b) => b.length - a.length);
        const regex = new RegExp(`(${allPatterns.join('|')})`, 'gi');

        const parts = content.split(regex);

        return parts.map((part, index) => {
            const lowerPart = part.toLowerCase();

            // Check if it's a keyword
            if (keywords.some(k => k.toLowerCase() === lowerPart)) {
                return <span key={index} className={styles.highlight}>{part}</span>;
            }

            // Check if it's a suspect name
            const matchedAnimal = Object.values(ANIMALS).find(a => a.name.toLowerCase() === lowerPart);
            if (matchedAnimal) {
                return <span key={index} style={{ color: matchedAnimal.color, fontWeight: 'bold' }}>{part}</span>;
            }

            return part;
        });
    };

    return (
        <div
            className={`${styles.card} ${isMarkedFalse ? styles.markedFalse : ''} ${minimal ? styles.minimal : ''}`}
            onClick={onToggle}
            title="Click to mark as False/True"
        >
            <div className={styles.header}>
                <span className={styles.suspectName} style={{ color: suspect.color }}>
                    {suspect.name} says:
                </span>
            </div>
            <p className={styles.text}>
                {highlightKeywords(text)}
            </p>
        </div>
    );
};

export default StatementCard;

import React from 'react';
import styles from './SubmitButton.module.css';

interface SubmitButtonProps {
    onClick: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick }) => {
    return (
        <div className={styles.container}>
            <button className={styles.submitBtn} onClick={onClick}>
                <span className={styles.btnText}>SUBMIT<br />SOLUTION</span>
            </button>
        </div>
    );
};

export default SubmitButton;

import React, { useEffect } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
    type?: 'error' | 'success' | 'info';
}

const Toast: React.FC<ToastProps> = ({
    message,
    isVisible,
    onClose,
    duration = 3000,
    type = 'error'
}) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    return (
        <div className={`${styles.toast} ${styles[type]}`}>
            <span className={styles.icon}>
                {type === 'error' && '⚠️'}
                {type === 'success' && '✅'}
                {type === 'info' && 'ℹ️'}
            </span>
            <span className={styles.message}>{message}</span>
        </div>
    );
};

export default Toast;

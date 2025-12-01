import React, { ReactNode } from 'react';
import styles from './Modal.module.css';

interface GenericModalProps {
    icon?: ReactNode;
    title: string;
    children: ReactNode;
    actions?: ReactNode;
}

const GenericModal: React.FC<GenericModalProps> = ({ icon, title, children, actions }) => {
    return (
        <div className={styles.overlay}>
            <div className={`${styles.modal} glass-panel`}>
                {icon && (
                    <div className={styles.icon}>
                        {icon}
                    </div>
                )}

                <h2 className={styles.title}>
                    {title}
                </h2>

                <div className={styles.content}>
                    {children}
                </div>

                {actions && (
                    <div className={styles.actions}>
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenericModal;

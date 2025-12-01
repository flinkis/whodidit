import React from 'react';
import { useModal } from '../context/ModalContext';
import GenericModal from './GenericModal';

const ModalRoot: React.FC = () => {
    const { isOpen, content } = useModal();

    if (!isOpen || !content) return null;

    return (
        <GenericModal
            icon={content.icon}
            title={content.title}
            actions={content.actions}
        >
            {content.children}
        </GenericModal>
    );
};

export default ModalRoot;

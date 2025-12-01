import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface ModalContent {
    icon?: ReactNode;
    title: string;
    children: ReactNode;
    actions?: ReactNode;
}

interface ModalContextType {
    isOpen: boolean;
    content: ModalContent | null;
    openModal: (content: ModalContent) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState<ModalContent | null>(null);

    const openModal = useCallback((newContent: ModalContent) => {
        setContent(newContent);
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setContent(null);
    }, []);

    return (
        <ModalContext.Provider value={{ isOpen, content, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

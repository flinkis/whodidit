import { useRef, useCallback } from 'react';

interface LongPressOptions {
    onLongPress: () => void;
    onClick?: () => void;
    delay?: number;
}

export const useLongPress = ({ onLongPress, onClick, delay = 500 }: LongPressOptions) => {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const isLongPress = useRef(false);

    const startPress = useCallback((e: React.TouchEvent | React.MouseEvent) => {
        isLongPress.current = false;
        timerRef.current = setTimeout(() => {
            isLongPress.current = true;
            onLongPress();
        }, delay);
    }, [onLongPress, delay]);

    const cancelPress = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const handleClick = useCallback((e: React.MouseEvent) => {
        if (isLongPress.current) {
            return;
        }
        if (onClick) {
            onClick();
        }
    }, [onClick]);

    return {
        onMouseDown: startPress,
        onMouseUp: cancelPress,
        onMouseLeave: cancelPress,
        onTouchStart: startPress,
        onTouchEnd: cancelPress,
        onTouchCancel: cancelPress,
        onClick: handleClick
    };
};

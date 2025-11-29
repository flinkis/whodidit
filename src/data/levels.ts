import { GameConfig } from '../types';

export const LEVELS: Record<string, GameConfig> = {
    level1: {
        mode: 'open',
        suspectCount: 3,
        culpritCount: 1,
        difficulty: 1,
        constraints: { minLiars: 1, maxLiars: 1 }
    },
    level2: {
        mode: 'open',
        suspectCount: 3,
        culpritCount: 1,
        difficulty: 2,
        constraints: { minLiars: 1, maxLiars: 2 }
    },
    level3: {
        mode: 'open',
        suspectCount: 5,
        culpritCount: 1,
        difficulty: 3,
        constraints: { minLiars: 2, maxLiars: 2 }
    },
    level4: {
        mode: 'open',
        suspectCount: 5,
        culpritCount: 1,
        difficulty: 4,
        constraints: { minLiars: 2, maxLiars: 3 }
    },
    level5: {
        mode: 'open',
        suspectCount: 7,
        culpritCount: 1,
        difficulty: 5,
        constraints: { minLiars: 2, maxLiars: 2 }
    },
    level6: {
        mode: 'open',
        suspectCount: 7,
        culpritCount: 1,
        difficulty: 6,
        constraints: { minLiars: 2, maxLiars: 4 }
    },
    level7: {
        mode: 'open',
        suspectCount: 7,
        culpritCount: 2,
        difficulty: 7,
        constraints: { minLiars: 3, maxLiars: 3 }
    },
    level8: {
        mode: 'open',
        suspectCount: 7,
        culpritCount: 2,
        difficulty: 8,
        constraints: { minLiars: 2, maxLiars: 4 }
    },
};

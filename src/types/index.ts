export interface Animal {
    id: number;
    name: string;
    height: number;
    diet: 'carnivore' | 'herbivore';
    image: string;
    color: string;
}

export interface Suspect extends Animal {
    // Runtime status is handled separately in World
}

export interface World {
    culprits: Set<number>;
    liars: Set<number>;
}

export interface GameConfig {
    mode: 'open' | 'campaign';
    suspectCount: number;
    culpritCount: number;
    difficulty: number;
    constraints: {
        minLiars?: number;
        maxLiars?: number;
        minTruths?: number;
        maxTruths?: number;
    };
}

export interface StatementContext {
    allSuspectIds: number[];
    targetId?: number;
    secondTargetId?: number;
}

export interface StatementTemplate {
    id: string;
    type: string;
    difficulty: number;
    text: string | ((t1: any, t2?: any) => string);
    requiresTarget?: boolean;
    requiresSecondTarget?: boolean;
    disabled?: boolean;
    isAccusation?: boolean;
    evaluate: (speakerId: number, world: World, context: StatementContext) => boolean;
}

export interface GeneratedStatement {
    templateId: string;
    targets: {
        targetId?: number;
        secondTargetId?: number;
    };
    text: string;
    isAccusation?: boolean;
}

export interface GameData {
    suspectIds: number[];
    statements: Record<number, GeneratedStatement>;
    solution: World;
    config: GameConfig;
}

export interface Result {
    success: boolean;
    stars?: number;
    time?: string;
    solution: World;
    reason?: 'timeout' | 'incorrect' | 'stars' | 'given_up';
}

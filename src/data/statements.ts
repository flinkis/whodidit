import { ANIMALS } from './animals';
import { StatementTemplate, StatementContext, World, Animal } from '../types';

// Helper to get neighbors in a circle
const getNeighbors = (suspectId: number, allSuspectIds: number[]): number[] => {
    const index = allSuspectIds.indexOf(suspectId);
    const leftIndex = (index - 1 + allSuspectIds.length) % allSuspectIds.length;
    const rightIndex = (index + 1) % allSuspectIds.length;
    return [allSuspectIds[leftIndex], allSuspectIds[rightIndex]];
};

export const STATEMENT_TYPES = {
    SIMPLE: 'simple',
    COMPARATIVE: 'comparative',
    REFERENTIAL: 'referential',
    CULPRIT: 'culprit',
    POSITIONAL: 'positional',
    CONDITIONAL: 'conditional'
};

export const TEMPLATES: StatementTemplate[] = [
    // --- SIMPLE STATEMENTS ---
    {
        id: 'diet_carnivore',
        type: STATEMENT_TYPES.SIMPLE,
        difficulty: 1,
        text: "A carnivore did it",
        evaluate: (speakerId: number, world: World, context: StatementContext) => {
            // True if AT LEAST ONE culprit is a carnivore
            return Array.from(world.culprits).some(id => ANIMALS[id].diet === 'carnivore');
        }
    },
    {
        id: 'diet_herbivore',
        type: STATEMENT_TYPES.SIMPLE,
        difficulty: 1,
        text: "A herbivore did it",
        evaluate: (speakerId: number, world: World, context: StatementContext) => {
            return Array.from(world.culprits).some(id => ANIMALS[id].diet === 'herbivore');
        }
    },
    {
        id: 'i_didnt_do_it',
        type: STATEMENT_TYPES.SIMPLE,
        difficulty: 1,
        text: "I didn't do it",
        evaluate: (speakerId: number, world: World, context: StatementContext) => {
            return !world.culprits.has(speakerId);
        }
    },
    {
        id: 'i_did_it',
        type: STATEMENT_TYPES.SIMPLE,
        difficulty: 1,
        text: "I did it",
        evaluate: (speakerId: number, world: World, context: StatementContext) => {
            return world.culprits.has(speakerId);
        }
    },

    // --- COMPARATIVE ---
    {
        id: 'taller_than_me',
        type: STATEMENT_TYPES.COMPARATIVE,
        difficulty: 2,
        text: "Someone taller than me did it",
        evaluate: (speakerId: number, world: World, context: StatementContext) => {
            const myHeight = ANIMALS[speakerId].height;
            return Array.from(world.culprits).some(id => ANIMALS[id].height > myHeight);
        }
    },
    {
        id: 'shorter_than_target',
        type: STATEMENT_TYPES.COMPARATIVE,
        difficulty: 2,
        requiresTarget: true,
        text: (target: Animal) => `Someone shorter than ${target.name} did it`,
        evaluate: (speakerId: number, world: World, context: StatementContext) => {
            if (!context.targetId) return false;
            const targetHeight = ANIMALS[context.targetId].height;
            return Array.from(world.culprits).some(id => ANIMALS[id].height < targetHeight);
        }
    },

    // --- REFERENTIAL (TRUTH/LIE) ---
    {
        id: 'target_is_lying',
        type: STATEMENT_TYPES.REFERENTIAL,
        difficulty: 2,
        requiresTarget: true,
        text: (target: Animal) => `${target.name} is lying`,
        evaluate: (speakerId: number, world: World, context: StatementContext) => {
            if (!context.targetId) return false;
            return world.liars.has(context.targetId);
        }
    },
    {
        id: 'target_is_truthful',
        type: STATEMENT_TYPES.REFERENTIAL,
        difficulty: 2,
        requiresTarget: true,
        text: (target: Animal) => `${target.name} is telling the truth`,
        evaluate: (speakerId: number, world: World, context: StatementContext) => {
            if (!context.targetId) return false;
            return !world.liars.has(context.targetId);
        }
    },
    {
        id: 'i_am_lying',
        type: STATEMENT_TYPES.REFERENTIAL,
        difficulty: 3,
        text: "I am lying",
        evaluate: (speakerId: number, world: World, context: StatementContext) => {
            return false; // Paradox
        },
        disabled: true
    },

    // --- REFERENTIAL (AND/OR) ---
    {
        id: 'target_and_target2_lying',
        type: STATEMENT_TYPES.REFERENTIAL,
        difficulty: 3,
        requiresTarget: true,
        requiresSecondTarget: true,
        text: (t1: Animal, t2: Animal) => `${t1.name} and ${t2.name} are lying`,
        evaluate: (speakerId: number, world: World, context: StatementContext) => {
            if (!context.targetId || !context.secondTargetId) return false;
            return world.liars.has(context.targetId) && world.liars.has(context.secondTargetId);
        }
    },
    {
        id: 'target_or_target2_lying',
        type: STATEMENT_TYPES.REFERENTIAL,
        difficulty: 3,
        requiresTarget: true,
        requiresSecondTarget: true,
        text: (t1: Animal, t2: Animal) => `${t1.name} or ${t2.name} is lying`,
        evaluate: (speakerId: number, world: World, context: StatementContext) => {
            if (!context.targetId || !context.secondTargetId) return false;
            return world.liars.has(context.targetId) || world.liars.has(context.secondTargetId);
        }
    },

    // --- CULPRIT ACCUSATIONS ---
    {
        id: 'target_did_it',
        type: STATEMENT_TYPES.CULPRIT,
        difficulty: 1,
        requiresTarget: true,
        text: (target: Animal) => `${target.name} did it`,
        evaluate: (speakerId: number, world: World, context: StatementContext) => {
            if (!context.targetId) return false;
            return world.culprits.has(context.targetId);
        }
    },
    {
        id: 'target_didnt_do_it',
        type: STATEMENT_TYPES.CULPRIT,
        difficulty: 1,
        requiresTarget: true,
        text: (target: Animal) => `${target.name} didn't do it`,
        evaluate: (speakerId: number, world: World, context: StatementContext) => {
            if (!context.targetId) return false;
            return !world.culprits.has(context.targetId);
        }
    },
    {
        id: 'target_and_target2_did_it',
        type: STATEMENT_TYPES.CULPRIT,
        difficulty: 4,
        requiresTarget: true,
        requiresSecondTarget: true,
        text: (t1: Animal, t2: Animal) => `${t1.name} and ${t2.name} did it`,
        evaluate: (speakerId: number, world: World, context: StatementContext) => {
            if (!context.targetId || !context.secondTargetId) return false;
            return world.culprits.has(context.targetId) && world.culprits.has(context.secondTargetId);
        }
    },
    {
        id: 'target_or_target2_did_it',
        type: STATEMENT_TYPES.CULPRIT,
        difficulty: 3,
        requiresTarget: true,
        requiresSecondTarget: true,
        text: (t1: Animal, t2: Animal) => `${t1.name} or ${t2.name} did it`,
        evaluate: (speakerId: number, world: World, context: StatementContext) => {
            if (!context.targetId || !context.secondTargetId) return false;
            return world.culprits.has(context.targetId) || world.culprits.has(context.secondTargetId);
        }
    },

    // --- POSITIONAL ---
    {
        id: 'neighbor_did_it',
        type: STATEMENT_TYPES.POSITIONAL,
        difficulty: 2,
        text: "Someone next to me did it",
        evaluate: (speakerId: number, world: World, context: StatementContext) => {
            const neighbors = getNeighbors(speakerId, context.allSuspectIds);
            return neighbors.some(nId => world.culprits.has(nId));
        }
    },
    {
        id: 'neighbor_is_lying',
        type: STATEMENT_TYPES.POSITIONAL,
        difficulty: 2,
        text: "A suspect next to me is lying",
        evaluate: (speakerId: number, world: World, context: StatementContext) => {
            const neighbors = getNeighbors(speakerId, context.allSuspectIds);
            return neighbors.some(nId => world.liars.has(nId));
        }
    },

    // --- CONDITIONAL ---
    {
        id: 'if_target_guilty_then_target2_lying',
        type: STATEMENT_TYPES.CONDITIONAL,
        difficulty: 5,
        requiresTarget: true,
        requiresSecondTarget: true,
        text: (t1: Animal, t2: Animal) => `If ${t1.name} did it, then ${t2.name} is lying`,
        evaluate: (speakerId: number, world: World, context: StatementContext) => {
            if (!context.targetId || !context.secondTargetId) return false;
            const condition = world.culprits.has(context.targetId);
            const consequence = world.liars.has(context.secondTargetId);
            return !condition || consequence;
        }
    }
];

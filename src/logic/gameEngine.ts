import { TEMPLATES } from '../data/statements';
import { GeneratedStatement, StatementContext, World } from '../types';

// --- EVALUATION LOGIC ---

/**
 * Evaluates if a specific statement is true in a given world.
 */
export const evaluateStatement = (statement: GeneratedStatement, speakerId: number, world: World, context: StatementContext): boolean => {
    const template = TEMPLATES.find(t => t.id === statement.templateId);
    if (!template) {
        console.error(`Template not found: ${statement.templateId}`);
        return false;
    }

    // Context includes targets, allSuspectIds, etc.
    return template.evaluate(speakerId, world, { ...context, ...statement.targets });
};

/**
 * Checks if a world is consistent with all statements.
 * In a consistent world:
 * - If a suspect is a LIAR, their statement MUST be FALSE.
 * - If a suspect is TRUTHFUL, their statement MUST be TRUE.
 */
export const isWorldConsistent = (world: World, statements: Record<number, GeneratedStatement>, context: StatementContext): boolean => {
    for (const [suspectId, statement] of Object.entries(statements)) {
        const id = parseInt(suspectId);
        const isLiar = world.liars.has(id);
        const isStatementTrue = evaluateStatement(statement, id, world, context);

        if (isLiar && isStatementTrue) return false; // Liar told the truth -> Inconsistent
        if (!isLiar && !isStatementTrue) return false; // Truth-teller lied -> Inconsistent
    }
    return true;
};

/**
 * Generates all possible worlds for a given set of suspects and constraints.
 */
export const generateAllPossibleWorlds = (
    suspectIds: number[],
    numCulprits: number,
    constraints: { minLiars?: number; maxLiars?: number; minTruths?: number; maxTruths?: number } = {}
): World[] => {
    const worlds: World[] = [];

    // Helper to generate combinations
    const getCombinations = (arr: number[], k: number): number[][] => {
        if (k === 0) return [[]];
        if (arr.length === 0) return [];
        const [first, ...rest] = arr;
        const withFirst = getCombinations(rest, k - 1).map(c => [first, ...c]);
        const withoutFirst = getCombinations(rest, k);
        return [...withFirst, ...withoutFirst];
    };

    // 1. Generate all culprit combinations
    const culpritCombos = getCombinations(suspectIds, numCulprits);

    // 2. Generate all liar combinations (power set, filtered by constraints)
    const numSuspects = suspectIds.length;
    const totalLiarStates = 1 << numSuspects; // 2^N

    for (const culprits of culpritCombos) {
        const culpritsSet = new Set(culprits);

        for (let i = 0; i < totalLiarStates; i++) {
            const liars = new Set<number>();
            let liarCount = 0;

            for (let j = 0; j < numSuspects; j++) {
                if ((i >> j) & 1) {
                    liars.add(suspectIds[j]);
                    liarCount++;
                }
            }

            // Check liar constraints
            if (constraints.minLiars !== undefined && liarCount < constraints.minLiars) continue;
            if (constraints.maxLiars !== undefined && liarCount > constraints.maxLiars) continue;

            // Truth constraints are just inverse of liar constraints
            const truthCount = numSuspects - liarCount;
            if (constraints.minTruths !== undefined && truthCount < constraints.minTruths) continue;
            if (constraints.maxTruths !== undefined && truthCount > constraints.maxTruths) continue;

            worlds.push({
                culprits: culpritsSet,
                liars: liars
            });
        }
    }

    return worlds;
};

/**
 * Solves the case by finding all worlds consistent with the statements.
 */
export const solveCase = (
    statements: Record<number, GeneratedStatement>,
    suspectIds: number[],
    numCulprits: number,
    constraints: any
): World[] => {
    const allWorlds = generateAllPossibleWorlds(suspectIds, numCulprits, constraints);
    const context: StatementContext = { allSuspectIds: suspectIds };

    return allWorlds.filter(world => isWorldConsistent(world, statements, context));
};

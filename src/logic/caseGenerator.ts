import { TEMPLATES } from '../data/statements';
import { ANIMALS } from '../data/animals';
import { solveCase } from './gameEngine';
import { GameConfig, GeneratedStatement, StatementContext, World, GameData } from '../types';

// --- CASE GENERATOR ---

/**
 * Generates a valid case with a unique solution.
 */
export const generateCase = (config: GameConfig): GameData => {
    const { suspectCount, culpritCount, constraints, difficulty } = config;

    // 1. Select Suspects
    const allAnimalIds = Object.keys(ANIMALS).map(Number);
    const shuffledAnimals = allAnimalIds.sort(() => 0.5 - Math.random());
    const suspectIds = shuffledAnimals.slice(0, suspectCount).sort((a, b) => a - b);

    // 2. Define the "True World" (The Solution)
    const shuffledSuspects = [...suspectIds].sort(() => 0.5 - Math.random());
    const trueCulprits = new Set(shuffledSuspects.slice(0, culpritCount));

    // Randomly pick liars based on constraints
    const minLiars = constraints.minLiars ?? 0;
    const maxLiars = constraints.maxLiars ?? suspectCount;
    const numLiars = Math.floor(Math.random() * (maxLiars - minLiars + 1)) + minLiars;

    const shuffledForLiars = [...suspectIds].sort(() => 0.5 - Math.random());
    const trueLiars = new Set(shuffledForLiars.slice(0, numLiars));

    const trueWorld: World = {
        culprits: trueCulprits,
        liars: trueLiars
    };

    // 3. Generate Statements
    let attempts = 0;
    const MAX_ATTEMPTS = 5000;

    while (attempts < MAX_ATTEMPTS) {
        attempts++;
        const statements: Record<number, GeneratedStatement> = {};
        const context: StatementContext = { allSuspectIds: suspectIds };
        const usedStatements = new Set<string>();
        let hasAccusation = false;

        for (const suspectId of suspectIds) {
            const isLiar = trueWorld.liars.has(suspectId);

            const validStatement = generateValidStatementForSuspect(
                suspectId,
                isLiar,
                trueWorld,
                context,
                difficulty,
                usedStatements
            );

            if (!validStatement) {
                break;
            }

            statements[suspectId] = validStatement;
            usedStatements.add(validStatement.text);

            // Check if this statement helps solve the case (is an accusation or direct evidence)
            if (validStatement.isAccusation) {
                hasAccusation = true;
            }
        }

        if (Object.keys(statements).length !== suspectCount) continue;

        // Constraint: Must have at least one accusation/clue that points to someone
        if (!hasAccusation) continue;

        // 4. Verify Uniqueness
        const solutions = solveCase(statements, suspectIds, culpritCount, constraints);

        if (solutions.length === 1) {
            return {
                suspectIds,
                statements,
                solution: trueWorld,
                config
            };
        }
    }

    throw new Error("Failed to generate a valid case after max attempts");
};

/**
 * Helper to pick a random template and fill it such that it satisfies the truth requirement.
 */
const generateValidStatementForSuspect = (
    speakerId: number,
    mustBeFalse: boolean,
    world: World,
    context: StatementContext,
    difficulty: number,
    usedStatements: Set<string>
): GeneratedStatement | null => {
    const allowedTemplates = TEMPLATES.filter(t => !t.disabled && t.difficulty <= difficulty + 1);
    const shuffledTemplates = allowedTemplates.sort(() => 0.5 - Math.random());

    for (const template of shuffledTemplates) {
        // Generate all possible target combinations
        const allTargets: { targetId?: number; secondTargetId?: number }[] = [];

        if (template.requiresTarget) {
            const potentialTargets = context.allSuspectIds.filter(id => id !== speakerId);
            potentialTargets.forEach(tId => {
                if (template.requiresSecondTarget) {
                    const potentialSeconds = context.allSuspectIds.filter(id => id !== speakerId && id !== tId);
                    potentialSeconds.forEach(t2Id => {
                        allTargets.push({ targetId: tId, secondTargetId: t2Id });
                    });
                } else {
                    allTargets.push({ targetId: tId });
                }
            });
        } else {
            allTargets.push({});
        }

        // Shuffle targets to keep it random
        const shuffledTargets = allTargets.sort(() => 0.5 - Math.random());

        for (const targets of shuffledTargets) {
            const result = template.evaluate(speakerId, world, { ...context, ...targets });

            if (result !== mustBeFalse) {
                const text = typeof template.text === 'function'
                    ? template.text(
                        targets.targetId ? ANIMALS[targets.targetId] : undefined,
                        targets.secondTargetId ? ANIMALS[targets.secondTargetId] : undefined
                    )
                    : template.text;

                if (!usedStatements.has(text)) {
                    return {
                        templateId: template.id,
                        targets: targets,
                        text: text,
                        isAccusation: template.isAccusation
                    };
                }
            }
        }
    }

    return null;
};

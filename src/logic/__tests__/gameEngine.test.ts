import { describe, it, expect } from 'vitest';
import { evaluateStatement, isWorldConsistent, generateAllPossibleWorlds, solveCase } from '../gameEngine';
import { World, GeneratedStatement, StatementContext } from '../../types';

describe('Game Engine', () => {
    describe('evaluateStatement', () => {
        it('should correctly evaluate simple statements', () => {
            // Mock world: Suspect 1 is culprit
            const world: World = { culprits: new Set([1]), liars: new Set() };
            const context: StatementContext = { allSuspectIds: [1, 2, 3] };

            // "I did it" by Suspect 1
            const stmt1: GeneratedStatement = { templateId: 'i_did_it', targets: {}, text: "I did it" };
            expect(evaluateStatement(stmt1, 1, world, context)).toBe(true);

            // "I did it" by Suspect 2
            expect(evaluateStatement(stmt1, 2, world, context)).toBe(false);
        });

        it('should correctly evaluate referential statements', () => {
            // Mock world: Suspect 2 is a liar
            const world: World = { culprits: new Set(), liars: new Set([2]) };
            const context: StatementContext = { allSuspectIds: [1, 2, 3] };

            // "Suspect 2 is lying"
            const stmt: GeneratedStatement = {
                templateId: 'target_is_lying',
                targets: { targetId: 2 },
                text: "Suspect 2 is lying"
            };

            expect(evaluateStatement(stmt, 1, world, context)).toBe(true);
        });
    });

    describe('isWorldConsistent', () => {
        it('should return true for a consistent world', () => {
            // World: 1 is culprit, 2 is liar.
            // 1 (Truthful): "I did it" -> True. Consistent.
            // 2 (Liar): "I did it" -> False (since 1 did it). Consistent (Liar tells False).
            const world: World = { culprits: new Set([1]), liars: new Set([2]) };
            const context: StatementContext = { allSuspectIds: [1, 2] };

            const statements: Record<number, GeneratedStatement> = {
                1: { templateId: 'i_did_it', targets: {}, text: "I did it" },
                2: { templateId: 'i_did_it', targets: {}, text: "I did it" }
            };

            expect(isWorldConsistent(world, statements, context)).toBe(true);
        });

        it('should return false if a liar tells the truth', () => {
            // World: 1 is culprit, 2 is liar.
            // 2 (Liar): "Suspect 1 did it" -> True. Inconsistent (Liar MUST tell False).
            const world: World = { culprits: new Set([1]), liars: new Set([2]) };
            const context: StatementContext = { allSuspectIds: [1, 2] };

            const statements: Record<number, GeneratedStatement> = {
                1: { templateId: 'i_did_it', targets: {}, text: "I did it" },
                2: { templateId: 'target_did_it', targets: { targetId: 1 }, text: "Suspect 1 did it" }
            };

            expect(isWorldConsistent(world, statements, context)).toBe(false);
        });
    });

    describe('solveCase', () => {
        it('should find the unique solution for a simple case', () => {
            // Case: 3 suspects, 1 culprit.
            // 1: "I did it"
            // 2: "Suspect 1 did it"
            // 3: "Suspect 1 did it"
            // If 1 is culprit and all truthful -> All statements True. Consistent.

            const statements: Record<number, GeneratedStatement> = {
                1: { templateId: 'i_did_it', targets: {}, text: "I did it" },
                2: { templateId: 'target_did_it', targets: { targetId: 1 }, text: "Suspect 1 did it" },
                3: { templateId: 'target_did_it', targets: { targetId: 1 }, text: "Suspect 1 did it" }
            };

            const solutions = solveCase(statements, [1, 2, 3], 1, {});

            // We expect at least one solution where 1 is culprit and no liars.
            const correctSolution = solutions.find(w => w.culprits.has(1) && w.liars.size === 0);
            expect(correctSolution).toBeDefined();
        });
    });
});

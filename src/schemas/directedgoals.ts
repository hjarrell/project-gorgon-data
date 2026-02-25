import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const DirectedGoalSchema = z
  .object({
    Id: z.number().int(),
    Label: z.string(),
    LargeHint: z.string(),
    SmallHint: z.string(),
    Zone: z.string(),
    CategoryGateId: z.number().int().optional(),
    ForRaces: z.array(z.string()).optional(),
    IsCategoryGate: z.boolean().optional(),
  })
  .strict();

export const DirectedGoalsArraySchema = z.array(DirectedGoalSchema);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type DirectedGoal = z.infer<typeof DirectedGoalSchema>;
export type DirectedGoalsArray = z.infer<typeof DirectedGoalsArraySchema>;

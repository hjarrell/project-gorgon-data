import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

/**
 * Each advancement table entry maps Level_XX keys to an object
 * of attribute name → numeric modifier pairs.
 * e.g. { "Level_01": { "VULN_CRUSHING": 0.25, "VULN_FIRE": 0.25 } }
 */
export const AdvancementTableSchema = z.record(
  z.string(),
  z.record(z.string(), z.number()),
);

export const AdvancementTablesRecordSchema = z.record(
  z.string(),
  AdvancementTableSchema,
);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type AdvancementTable = z.infer<typeof AdvancementTableSchema>;
export type AdvancementTablesRecord = z.infer<
  typeof AdvancementTablesRecordSchema
>;

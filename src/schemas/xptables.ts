import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const XpTableSchema = z
  .object({
    InternalName: z.string(),
    XpAmounts: z.array(z.number()),
  })
  .strict();

export const XpTablesRecordSchema = z.record(z.string(), XpTableSchema);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type XpTable = z.infer<typeof XpTableSchema>;
export type XpTablesRecord = z.infer<typeof XpTablesRecordSchema>;

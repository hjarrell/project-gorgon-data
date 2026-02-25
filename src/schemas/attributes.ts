import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const AttributeSchema = z
  .object({
    DisplayRule: z.string(),
    DisplayType: z.string(),
    DefaultValue: z.number().optional(),
    IconIds: z.array(z.number().int()).optional(),
    IsHidden: z.boolean().optional(),
    Label: z.string().optional(),
    Tooltip: z.string().optional(),
  })
  .strict();

export const AttributesRecordSchema = z.record(z.string(), AttributeSchema);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type Attribute = z.infer<typeof AttributeSchema>;
export type AttributesRecord = z.infer<typeof AttributesRecordSchema>;

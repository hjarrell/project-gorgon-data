import { z } from 'zod';

// ============================================================
// Schemas
// ============================================================

export const TsysProfilesRecordSchema = z.record(
  z.string(),
  z.array(z.string()),
);

// ============================================================
// Types (inferred from schemas)
// ============================================================

export type TsysProfilesRecord = z.infer<typeof TsysProfilesRecordSchema>;

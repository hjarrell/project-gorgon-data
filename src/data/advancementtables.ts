import type { AdvancementTable } from '../schemas';

import RAW_ADVANCEMENT_TABLES from './raw/advancementtables.json';

export const advancementTables = new Map<string, AdvancementTable>(
  Object.entries(
    RAW_ADVANCEMENT_TABLES as Record<string, AdvancementTable>,
  ),
);

export { RAW_ADVANCEMENT_TABLES };

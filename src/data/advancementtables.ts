import type { AdvancementTable } from '../schemas';
import { loadJSON } from '../load-json';

const RAW_ADVANCEMENT_TABLES = loadJSON('data/raw/advancementtables.json');

export const advancementTables = new Map<string, AdvancementTable>(
  Object.entries(
    RAW_ADVANCEMENT_TABLES as Record<string, AdvancementTable>,
  ),
);

export { RAW_ADVANCEMENT_TABLES };

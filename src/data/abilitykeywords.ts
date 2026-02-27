import type { AbilityKeywordEntry } from '../schemas';
import { loadJSON } from '../load-json';

const RAW_ABILITY_KEYWORDS = loadJSON('data/raw/abilitykeywords.json');

export const abilityKeywords: AbilityKeywordEntry[] =
  RAW_ABILITY_KEYWORDS as AbilityKeywordEntry[];

export { RAW_ABILITY_KEYWORDS };

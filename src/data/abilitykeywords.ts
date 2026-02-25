import type { AbilityKeywordEntry } from '../schemas';

import RAW_ABILITY_KEYWORDS from './raw/abilitykeywords.json';

export const abilityKeywords: AbilityKeywordEntry[] =
  RAW_ABILITY_KEYWORDS as AbilityKeywordEntry[];

export { RAW_ABILITY_KEYWORDS };

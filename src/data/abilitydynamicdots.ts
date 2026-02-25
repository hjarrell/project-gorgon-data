import type { AbilityDynamicDoT } from '../schemas';

import RAW_ABILITY_DYNAMIC_DOTS from './raw/abilitydynamicdots.json';

export const abilityDynamicDots: AbilityDynamicDoT[] =
  RAW_ABILITY_DYNAMIC_DOTS as AbilityDynamicDoT[];

export { RAW_ABILITY_DYNAMIC_DOTS };

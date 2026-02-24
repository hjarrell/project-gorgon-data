import type { Ability } from '../schemas';

import RAW_ABILITIES from './abilities.json';
import RAW_ABILITY_DYNAMIC_DOTS from './abilitydynamicdots.json';
import RAW_ABILITY_DYNAMIC_SPECIAL_VALUES from './abilitydynamicspecialvalues.json';
export const abilities = new Map<string, Ability>(
  Object.entries(RAW_ABILITIES as Record<string, Ability>),
);

export {
  RAW_ABILITIES,
  RAW_ABILITY_DYNAMIC_DOTS,
  RAW_ABILITY_DYNAMIC_SPECIAL_VALUES,
};

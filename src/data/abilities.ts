import type { Ability, AbilityDynamicSpecialValue } from '../schemas';

import RAW_ABILITIES from './raw/abilities.json';
import RAW_ABILITY_DYNAMIC_DOTS from './raw/abilitydynamicdots.json';
import RAW_ABILITY_DYNAMIC_SPECIAL_VALUES from './raw/abilitydynamicspecialvalues.json';

export const abilities = new Map<string, Ability>(
  Object.entries(RAW_ABILITIES as Record<string, Ability>),
);

export const abilityDynamicSpecialValues =
  RAW_ABILITY_DYNAMIC_SPECIAL_VALUES as AbilityDynamicSpecialValue[];

export {
  RAW_ABILITIES,
  RAW_ABILITY_DYNAMIC_DOTS,
  RAW_ABILITY_DYNAMIC_SPECIAL_VALUES,
};

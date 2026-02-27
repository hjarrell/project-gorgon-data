import type { Ability, AbilityDynamicSpecialValue } from '../schemas';
import { loadJSON } from '../load-json';

const RAW_ABILITIES = loadJSON('data/raw/abilities.json');
const RAW_ABILITY_DYNAMIC_DOTS = loadJSON('data/raw/abilitydynamicdots.json');
const RAW_ABILITY_DYNAMIC_SPECIAL_VALUES = loadJSON('data/raw/abilitydynamicspecialvalues.json');

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

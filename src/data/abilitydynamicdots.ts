import type { AbilityDynamicDoT } from '../schemas';
import { loadJSON } from '../load-json';

const RAW_ABILITY_DYNAMIC_DOTS = loadJSON('data/raw/abilitydynamicdots.json');

export const abilityDynamicDots: AbilityDynamicDoT[] =
  RAW_ABILITY_DYNAMIC_DOTS as AbilityDynamicDoT[];

export { RAW_ABILITY_DYNAMIC_DOTS };

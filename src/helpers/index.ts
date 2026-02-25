export {
  getItemByCode,
  getItemName,
} from './item-helpers';

export {
  buildKeywordIndex,
  findItemsByKeyword,
  findItemsByKeywords,
} from './keyword-helpers';

export type {
  KeywordMatch,
  KeywordIndex,
} from './keyword-helpers';

export {
  resolveRecipeIngredients,
  resolveRecipeResults,
  resolveRecipe,
} from './recipe-helpers';

export type {
  ResolvedIngredient,
  ResolvedResultItem,
  ResolvedRecipe,
} from './recipe-helpers';

export {
  GEAR_SLOTS,
  GEAR_SLOT_LABELS,
  RARITIES,
  RARITY_MOD_SLOTS,
  parseEffectDesc,
  isParsedEffect,
  parseTierEffects,
  getAvailablePowers,
  getAvailableTiers,
  collectAbilityAttributes,
  calculateAbilityDamage,
  getCombatAbilities,
  encodeBuildToHash,
  decodeBuildFromHash,
  createDefaultGearSlots,
} from './build-helpers';

export type {
  GearSlot,
  Rarity,
  ModAssignment,
  ParsedEffect,
  UnparsedEffect,
  EffectDesc,
  ModSelection,
  GearSlotConfig,
  AbilityAttributes,
  DamageResult,
  DamageContribution,
  DoTDamageResult,
  EquippedEffect,
  DecodedBuild,
  BuildHashInput,
} from './build-helpers';

export {
  resolveManualEffect,
  MANUAL_EFFECT_MAPPINGS,
} from './manual-effect-mappings';

export type { ManualEffectMapping } from './manual-effect-mappings';

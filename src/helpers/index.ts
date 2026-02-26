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
  buildInternalKeywordMap,
  collectAbilityAttributes,
  calculateAbilityDamage,
  calculateStat,
  getCombatAbilities,
  encodeBuildToHash,
  decodeBuildFromHash,
  createDefaultGearSlots,
  parseTextEffect,
  textEffectMatchesAbility,
  applyTextEffects,
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
  AttributeBucket,
  SpecialValueAttributes,
  AbilityAttributes,
  StatResult,
  CritResult,
  SpecialValueResult,
  RestoreResult,
  DamageResult,
  DamageContribution,
  DoTDamageResult,
  EquippedEffect,
  DecodedBuild,
  BuildHashInput,
  TextEffect,
  TextEffectType,
} from './build-helpers';

export {
  resolveManualEffect,
  MANUAL_EFFECT_MAPPINGS,
} from './manual-effect-mappings';

export type { ManualEffectMapping } from './manual-effect-mappings';

export {
  register as registerSkillEffects,
  resolveSkillEffects,
  resolvedEffectMatchesAbility,
  applyResolvedEffects,
  getRegisteredConfig,
  getAllRegisteredPowerIds,
} from './skill-effects/index';

export type {
  PowerEffectConfig,
  EffectExtraction,
  ResolvedEffect,
  SkillEffectType,
} from './skill-effects/index';

export {
  simulateCombat,
  initCombatSim,
} from './combat-simulator/index';

export type {
  CombatSimConfig,
  CombatSimResult,
  RotationEntry,
  AbilityRole,
  NeedBasedConfig,
  EnemyConfig,
  EnemySimResult,
  AbilitySimResult,
  TimelineEvent,
  TimelineEventType,
} from './combat-simulator/index';

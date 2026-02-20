export {
  buildXpTableLookup,
  getXpRequiredForLevel,
  calcDropOffMultiplier,
  calcRecipeXp,
  calcRecipeEffort,
} from './xp';

export type { ItemEffortMap } from './xp';

export {
  planCraftingSkill,
  planCraftQuantity,
} from './crafting-planner';

export type {
  CraftStep,
  IngredientUsage,
  PlanResult,
  PlannerOptions,
  QuantityPlanResult,
} from './crafting-planner';

export {
  buildItemRecipeLookup,
  findRecipesForItem,
  resolveIngredientTree,
  annotateCraftableIngredients,
  computeIngredientTotalsFromSteps,
  extractSkillDependencies,
} from './ingredient-helpers';

export type {
  RecipeSource,
  IngredientNode,
  CraftableIngredientInfo,
  SkillDependency,
} from './ingredient-helpers';

export {
  buildCompositePlan,
} from './composite-plan';

export type {
  SubCraftPlan,
  CompositePlanResult,
} from './composite-plan';

export {
  xpScorer,
  efficientScorer,
} from './scorers';

export type { RecipeScorer } from './scorers';

export {
  initSimulation,
  canCraftRecipe,
  scoreCandidate,
  findBestCandidate,
  applyCraft,
  stepSimulation,
  isSimulationDone,
  buildPlanResult,
} from './simulation';

export type {
  SimulationState,
  RecipeCandidate,
  CandidateScore,
  BestCandidate,
} from './simulation';

export {
  groupStepsIntoRuns,
} from './step-grouping';

export type { CraftRun } from './step-grouping';

// ── Gardening Planner ─────────────────────────────────────

export {
  planGardeningSkill,
  groupActionsIntoHarvestRuns,
  DEFAULT_GARDENING_TIMING,
} from './gardening-planner';

export type {
  GardeningSeedEntry,
  SeedCategory,
  SlotGroup,
  GardeningTimingConfig,
  GardeningPlannerOptions,
  GardenActionType,
  GardenAction,
  GardeningHarvestRun,
  GardeningPlanResult,
} from './gardening-types';

export {
  gardeningSeeds,
  gardeningSeedsByCode,
  DEFAULT_SLOT_GROUPS,
  getAvailableSeeds,
  getSeedSlotGroup,
  classifySeed,
  WATER_BOTTLE_ITEM_CODE,
  FERTILIZER_BOTTLE_ITEM_CODE,
} from './gardening-data';

export {
  initGardeningSimulation,
  stepGardeningSimulation,
  isGardeningSimulationDone,
} from './gardening-simulation';

export type { GardeningSimulationState } from './gardening-simulation';

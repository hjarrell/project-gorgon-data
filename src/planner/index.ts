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
} from './ingredient-helpers';

export type {
  RecipeSource,
  IngredientNode,
  CraftableIngredientInfo,
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

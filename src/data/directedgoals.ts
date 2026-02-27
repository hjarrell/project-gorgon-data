import type { DirectedGoal } from '../schemas';
import { loadJSON } from '../load-json';

const RAW_DIRECTED_GOALS = loadJSON('data/raw/directedgoals.json');

export const directedGoals = RAW_DIRECTED_GOALS as DirectedGoal[];

export { RAW_DIRECTED_GOALS };

import type { DirectedGoal } from '../schemas';

import RAW_DIRECTED_GOALS from './raw/directedgoals.json';

export const directedGoals = RAW_DIRECTED_GOALS as DirectedGoal[];

export { RAW_DIRECTED_GOALS };

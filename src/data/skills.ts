import type { Skill } from '../schemas';

import RAW_SKILLS from './skills.json';
import RAW_XP_TABLES from './xptables.json';

export const skills = new Map<string, Skill>(
  Object.entries(RAW_SKILLS as Record<string, Skill>),
);

export { RAW_SKILLS, RAW_XP_TABLES };

import type { Skill, XpTable } from '../schemas';
import { loadJSON } from '../load-json';

const RAW_SKILLS = loadJSON('data/raw/skills.json');
const RAW_XP_TABLES = loadJSON('data/raw/xptables.json');

export const skills = new Map<string, Skill>(
  Object.entries(RAW_SKILLS as Record<string, Skill>),
);

export const xpTables = new Map<string, XpTable>(
  Object.entries(RAW_XP_TABLES as Record<string, XpTable>),
);

export { RAW_SKILLS, RAW_XP_TABLES };

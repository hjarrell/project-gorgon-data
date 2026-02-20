import RAW_SKILLS from './skills.json';
import RAW_XP_TABLES from './xptables.json';
export const skills = new Map(Object.entries(RAW_SKILLS));
export { RAW_SKILLS, RAW_XP_TABLES };

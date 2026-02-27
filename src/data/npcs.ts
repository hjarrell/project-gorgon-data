import type { Npc } from '../schemas';
import { loadJSON } from '../load-json';

const RAW_NPCS = loadJSON('data/raw/npcs.json');

export const npcs = new Map<string, Npc>(
  Object.entries(RAW_NPCS as Record<string, Npc>),
);

export { RAW_NPCS };

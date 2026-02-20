import type { Npc } from '../schemas';

import RAW_NPCS from './npcs.json';

export const npcs = new Map<string, Npc>(
  Object.entries(RAW_NPCS as Record<string, Npc>),
);

export { RAW_NPCS };

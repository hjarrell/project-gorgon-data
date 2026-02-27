import type { LorebookInfo } from '../schemas';
import { loadJSON } from '../load-json';

const RAW_LOREBOOK_INFO = loadJSON('data/raw/lorebookinfo.json');

export const lorebookInfo = RAW_LOREBOOK_INFO as LorebookInfo;

export { RAW_LOREBOOK_INFO };

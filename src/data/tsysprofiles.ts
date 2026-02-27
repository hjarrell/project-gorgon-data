import type { TsysProfilesRecord } from '../schemas';
import { loadJSON } from '../load-json';

const RAW_TSYS_PROFILES = loadJSON('data/raw/tsysprofiles.json');

export const tsysProfiles = new Map<string, string[]>(
  Object.entries(RAW_TSYS_PROFILES as TsysProfilesRecord),
);

export { RAW_TSYS_PROFILES };

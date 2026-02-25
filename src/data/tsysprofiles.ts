import type { TsysProfilesRecord } from '../schemas';

import RAW_TSYS_PROFILES from './raw/tsysprofiles.json';

export const tsysProfiles = new Map<string, string[]>(
  Object.entries(RAW_TSYS_PROFILES as TsysProfilesRecord),
);

export { RAW_TSYS_PROFILES };

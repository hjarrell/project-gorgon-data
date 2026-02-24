import type { TsysPower } from '../schemas/tsysclientinfo';

import RAW_TSYS_CLIENT_INFO from './tsysclientinfo.json';

export const tsysClientInfo = new Map<string, TsysPower>(
  Object.entries(RAW_TSYS_CLIENT_INFO as Record<string, TsysPower>),
);

export { RAW_TSYS_CLIENT_INFO };

import type { StorageVault } from '../schemas';

import RAW_STORAGE_VAULTS from './raw/storagevaults.json';

export const storageVaults = new Map<string, StorageVault>(
  Object.entries(RAW_STORAGE_VAULTS as Record<string, StorageVault>),
);

export { RAW_STORAGE_VAULTS };

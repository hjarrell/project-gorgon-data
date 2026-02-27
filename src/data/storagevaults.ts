import type { StorageVault } from '../schemas';
import { loadJSON } from '../load-json';

const RAW_STORAGE_VAULTS = loadJSON('data/raw/storagevaults.json');

export const storageVaults = new Map<string, StorageVault>(
  Object.entries(RAW_STORAGE_VAULTS as Record<string, StorageVault>),
);

export { RAW_STORAGE_VAULTS };

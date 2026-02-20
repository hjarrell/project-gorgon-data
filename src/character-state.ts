import { z } from 'zod';
import {
  CharacterReportSchema,
  type CharacterReport,
  type CharacterSkillEntry,
  type NpcFavor,
} from './schemas/character_report';
import {
  StorageReportSchema,
  type StorageReport,
  type StorageItem,
} from './schemas/storage_report';

// ============================================================
// Discriminated report parsing
// ============================================================

const ReportDiscriminator = z.object({ Report: z.string() }).passthrough();

/**
 * Parse a raw JSON object that is either a CharacterSheet or Storage report.
 * Returns the validated, typed report or throws a ZodError.
 */
export function parseReport(data: unknown): CharacterReport | StorageReport {
  const { Report } = ReportDiscriminator.parse(data);
  switch (Report) {
    case 'CharacterSheet':
      return CharacterReportSchema.parse(data);
    case 'Storage':
      return StorageReportSchema.parse(data);
    default:
      throw new Error(`Unknown report type: "${Report}". Expected "CharacterSheet" or "Storage".`);
  }
}

/**
 * Parse raw JSON that is specifically a CharacterSheet report.
 */
export function parseCharacterReport(data: unknown): CharacterReport {
  return CharacterReportSchema.parse(data);
}

/**
 * Parse raw JSON that is specifically a Storage report.
 */
export function parseStorageReport(data: unknown): StorageReport {
  return StorageReportSchema.parse(data);
}

// ============================================================
// CharacterState — mutable container for loaded report data
// ============================================================

export class CharacterState {
  characterName: string | null = null;
  race: string | null = null;

  /** Timestamp of the most recently loaded character sheet. */
  characterSheetTimestamp: string | null = null;
  /** Timestamp of the most recently loaded storage report. */
  storageTimestamp: string | null = null;

  skills = new Map<string, CharacterSkillEntry>();
  recipeCompletions = new Map<string, number>();
  currentStats = new Map<string, number>();
  currencies = new Map<string, number>();
  activeQuests: string[] = [];
  activeWorkOrders: string[] = [];
  completedWorkOrders: string[] = [];
  npcs = new Map<string, NpcFavor>();

  /** All items from the storage report. */
  allItems: StorageItem[] = [];

  // -----------------------------------------------------------
  // Loaders
  // -----------------------------------------------------------

  /**
   * Load a report of either type. Detects the type automatically
   * and delegates to the appropriate loader.
   */
  loadReport(data: unknown): void {
    const report = parseReport(data);
    if (report.Report === 'CharacterSheet') {
      this.applyCharacterSheet(report);
    } else {
      this.applyStorage(report);
    }
  }

  /**
   * Load a CharacterSheet report into this state.
   */
  loadCharacterSheet(data: unknown): void {
    this.applyCharacterSheet(parseCharacterReport(data));
  }

  /**
   * Load a Storage report into this state.
   */
  loadStorage(data: unknown): void {
    this.applyStorage(parseStorageReport(data));
  }

  // -----------------------------------------------------------
  // Queries
  // -----------------------------------------------------------

  /** Get items currently in the player's active inventory. */
  get inventoryItems(): StorageItem[] {
    return this.allItems.filter((i) => i.IsInInventory === true);
  }

  /** Get items stored in vaults/chests (not in active inventory). */
  get vaultItems(): StorageItem[] {
    return this.allItems.filter((i) => i.StorageVault != null);
  }

  /** Get items stored in a specific vault by name. */
  getItemsByVault(vaultName: string): StorageItem[] {
    return this.allItems.filter((i) => i.StorageVault === vaultName);
  }

  /** Get all unique vault names that contain items. */
  get vaultNames(): string[] {
    const names = new Set<string>();
    for (const item of this.allItems) {
      if (item.StorageVault != null) {
        names.add(item.StorageVault);
      }
    }
    return [...names];
  }

  /** Get all equipped items (items in inventory that have an equipment slot). */
  get equippedItems(): StorageItem[] {
    return this.allItems.filter((i) => i.IsInInventory === true && i.Slot != null);
  }

  // -----------------------------------------------------------
  // Internal
  // -----------------------------------------------------------

  private applyCharacterSheet(report: CharacterReport): void {
    this.characterName = report.Character;
    this.characterSheetTimestamp = report.Timestamp;
    this.race = report.Race;

    this.skills = new Map(Object.entries(report.Skills));
    this.recipeCompletions = new Map(Object.entries(report.RecipeCompletions));
    this.currentStats = new Map(Object.entries(report.CurrentStats));
    this.currencies = new Map(Object.entries(report.Currencies));
    this.activeQuests = [...report.ActiveQuests];
    this.activeWorkOrders = [...report.ActiveWorkOrders];
    this.completedWorkOrders = [...report.CompletedWorkOrders];
    this.npcs = new Map(Object.entries(report.NPCs));
  }

  private applyStorage(report: StorageReport): void {
    this.characterName = report.Character;
    this.storageTimestamp = report.Timestamp;
    this.allItems = [...report.Items];
  }
}

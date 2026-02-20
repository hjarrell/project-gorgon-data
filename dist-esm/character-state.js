import { z } from 'zod';
import { CharacterReportSchema, } from './schemas/character_report';
import { StorageReportSchema, } from './schemas/storage_report';
// ============================================================
// Discriminated report parsing
// ============================================================
const ReportDiscriminator = z.object({ Report: z.string() }).passthrough();
/**
 * Parse a raw JSON object that is either a CharacterSheet or Storage report.
 * Returns the validated, typed report or throws a ZodError.
 */
export function parseReport(data) {
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
export function parseCharacterReport(data) {
    return CharacterReportSchema.parse(data);
}
/**
 * Parse raw JSON that is specifically a Storage report.
 */
export function parseStorageReport(data) {
    return StorageReportSchema.parse(data);
}
// ============================================================
// CharacterState — mutable container for loaded report data
// ============================================================
export class CharacterState {
    constructor() {
        this.characterName = null;
        this.race = null;
        /** Timestamp of the most recently loaded character sheet. */
        this.characterSheetTimestamp = null;
        /** Timestamp of the most recently loaded storage report. */
        this.storageTimestamp = null;
        this.skills = new Map();
        this.recipeCompletions = new Map();
        this.currentStats = new Map();
        this.currencies = new Map();
        this.activeQuests = [];
        this.activeWorkOrders = [];
        this.completedWorkOrders = [];
        this.npcs = new Map();
        /** All items from the storage report. */
        this.allItems = [];
    }
    // -----------------------------------------------------------
    // Loaders
    // -----------------------------------------------------------
    /**
     * Load a report of either type. Detects the type automatically
     * and delegates to the appropriate loader.
     */
    loadReport(data) {
        const report = parseReport(data);
        if (report.Report === 'CharacterSheet') {
            this.applyCharacterSheet(report);
        }
        else {
            this.applyStorage(report);
        }
    }
    /**
     * Load a CharacterSheet report into this state.
     */
    loadCharacterSheet(data) {
        this.applyCharacterSheet(parseCharacterReport(data));
    }
    /**
     * Load a Storage report into this state.
     */
    loadStorage(data) {
        this.applyStorage(parseStorageReport(data));
    }
    // -----------------------------------------------------------
    // Queries
    // -----------------------------------------------------------
    /** Get items currently in the player's active inventory. */
    get inventoryItems() {
        return this.allItems.filter((i) => i.IsInInventory === true);
    }
    /** Get items stored in vaults/chests (not in active inventory). */
    get vaultItems() {
        return this.allItems.filter((i) => i.StorageVault != null);
    }
    /** Get items stored in a specific vault by name. */
    getItemsByVault(vaultName) {
        return this.allItems.filter((i) => i.StorageVault === vaultName);
    }
    /** Get all unique vault names that contain items. */
    get vaultNames() {
        const names = new Set();
        for (const item of this.allItems) {
            if (item.StorageVault != null) {
                names.add(item.StorageVault);
            }
        }
        return [...names];
    }
    /** Get all equipped items (items in inventory that have an equipment slot). */
    get equippedItems() {
        return this.allItems.filter((i) => i.IsInInventory === true && i.Slot != null);
    }
    // -----------------------------------------------------------
    // Internal
    // -----------------------------------------------------------
    applyCharacterSheet(report) {
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
    applyStorage(report) {
        this.characterName = report.Character;
        this.storageTimestamp = report.Timestamp;
        this.allItems = [...report.Items];
    }
}

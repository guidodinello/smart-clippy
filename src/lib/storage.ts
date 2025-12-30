import type { CopyOptions } from "@/lib/types/format";
import { STORAGE_KEYS, DEFAULT_OPTIONS } from "@/lib/constants";
import { logger } from "@/lib/utils/logger";

/**
 * Retrieve user's copy format preferences from browser storage
 * Falls back to defaults if storage is unavailable or empty
 * @returns Promise resolving to CopyOptions (defaults if not set)
 */
export async function getCopyOptions(): Promise<CopyOptions> {
    try {
        const result = await browser.storage.sync.get([
            STORAGE_KEYS.COPY_FORMAT,
            STORAGE_KEYS.CUSTOM_FORMAT,
        ]);

        logger.debug("Retrieved copy options:", result);

        return {
            copyFormat: result[STORAGE_KEYS.COPY_FORMAT] || DEFAULT_OPTIONS.copyFormat,
            customFormat: result[STORAGE_KEYS.CUSTOM_FORMAT] || DEFAULT_OPTIONS.customFormat,
        };
    } catch (error) {
        logger.error("Error getting copy options:", error);
        return DEFAULT_OPTIONS;
    }
}

/**
 * Save user's copy format preferences to browser storage (synced across devices)
 * @param options The copy options to save
 * @throws Error if storage quota exceeded or write fails
 */
export async function saveCopyOptions(options: CopyOptions): Promise<void> {
    try {
        await browser.storage.sync.set({
            [STORAGE_KEYS.COPY_FORMAT]: options.copyFormat,
            [STORAGE_KEYS.CUSTOM_FORMAT]: options.customFormat,
        });
        logger.debug("Saved copy options:", options);
    } catch (error) {
        logger.error("Error saving copy options:", error);
        throw error;
    }
}

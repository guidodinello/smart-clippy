/**
 * Simple deduplicator to prevent duplicate actions within a time window
 * Useful for debouncing user interactions, preventing spam, etc.
 */
export class Deduplicator {
    private recent = new Map<string, number>();
    private window: number;

    /**
     * Create a new deduplicator
     * @param window Time window in milliseconds for deduplication
     */
    constructor(window: number = 1000) {
        this.window = window;
    }

    /**
     * Check if a key should be allowed (not a duplicate)
     * @param key The key to check
     * @returns True if allowed (not a duplicate), false if duplicate
     */
    check(key: string): boolean {
        const now = Date.now();
        const lastSeen = this.recent.get(key);

        // If seen recently, it's a duplicate
        if (lastSeen && now - lastSeen < this.window) {
            return false;
        }

        // Record this key and clean up after window expires
        this.recent.set(key, now);
        setTimeout(() => {
            this.recent.delete(key);
        }, this.window);

        return true;
    }

    /**
     * Clear all tracked keys
     */
    clear(): void {
        this.recent.clear();
    }
}

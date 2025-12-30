/**
 * Get the configured keyboard shortcut for the copy-page-info command
 * @returns The keyboard shortcut string (e.g., "Alt+Shift+C") or null if not configured
 */
export async function getCopyShortcut(): Promise<string | null> {
    try {
        const commands = await browser.commands.getAll();
        const copyCommand = commands.find((cmd) => cmd.name === "copy-page-info");
        return copyCommand?.shortcut || null;
    } catch (error) {
        console.error("Error getting keyboard shortcut:", error);
        return null;
    }
}

/**
 * Format keyboard shortcut for display (replace modifiers with symbols on Mac)
 * @param shortcut The keyboard shortcut string
 * @returns Formatted shortcut string
 */
export function formatShortcut(shortcut: string): string {
    const isMac = navigator.platform.includes("Mac");

    if (!isMac) {
        return shortcut;
    }

    // Replace modifier keys with Mac symbols
    return shortcut
        .replace(/Command/gi, "⌘")
        .replace(/Cmd/gi, "⌘")
        .replace(/Alt/gi, "⌥")
        .replace(/Shift/gi, "⇧")
        .replace(/Ctrl/gi, "⌃");
}

/**
 * Validate a custom format string
 * @param format The custom format string to validate
 * @returns True if valid, false otherwise
 */
export function isValidCustomFormat(format: string): boolean {
    if (!format || !format.trim()) {
        return false;
    }

    // Must contain at least {title} or {url}
    return format.includes("{title}") || format.includes("{url}");
}

/**
 * Get validation error message for custom format
 * @param format The custom format string to validate
 * @returns Error message if invalid, null if valid
 */
export function getCustomFormatError(format: string): string | null {
    if (!format || !format.trim()) {
        return "Custom format cannot be empty";
    }

    if (!format.includes("{title}") && !format.includes("{url}")) {
        return "Custom format must contain at least {title} or {url}";
    }

    return null;
}

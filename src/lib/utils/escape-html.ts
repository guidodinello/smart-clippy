/**
 * Escape HTML special characters to prevent XSS
 * @param text The text to escape
 * @returns HTML-safe string
 * @example
 * ```ts
 * escapeHtml('<script>alert("xss")</script>');
 * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * ```
 */
export function escapeHtml(text: string): string {
    const htmlEscapeMap: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    };
    return text.replace(/[&<>"']/g, (char) => htmlEscapeMap[char]);
}

/**
 * Escape markdown special characters to prevent syntax breaking
 * @param text The text to escape
 * @returns Markdown-safe string
 * @example
 * ```ts
 * escapeMarkdown('Link: ](javascript:alert("xss"))');
 * // Returns: 'Link: \\]\\(javascript:alert("xss")\\)'
 * ```
 */
export function escapeMarkdown(text: string): string {
    const markdownEscapeMap: Record<string, string> = {
        "\\": "\\\\",
        "[": "\\[",
        "]": "\\]",
        "(": "\\(",
        ")": "\\)",
    };
    return text.replace(/[\\[\]()]/g, (char) => markdownEscapeMap[char]);
}

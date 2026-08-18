import { COPY_FORMATS } from "@/lib/types/format";
import type { CopyFormat, PageInfo } from "@/lib/types/format";
import { logger } from "@/lib/utils/logger";
import { escapeHtml, escapeMarkdown } from "@/lib/utils/escape-html";

// Limits for very long content
const MAX_TITLE_LENGTH = 200;
const MAX_URL_LENGTH = 2000;

/**
 * Truncate a string to a maximum length with ellipsis
 * @param text The text to truncate
 * @param maxLength The maximum length (including ellipsis)
 * @returns Truncated string with "..." if needed
 */
function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength - 3) + "...";
}

/**
 * Format a page link according to the specified format
 * @param pageInfo The page information (title, URL, selected text)
 * @param format The copy format to use (markdown, HTML, plaintext, custom)
 * @param customFormat The custom format template (used only when format is CUSTOM)
 * @returns Formatted link string ready to copy to clipboard
 * @example
 * ```ts
 * const formatted = formatLink(
 *   { title: "Example", url: "https://example.com" },
 *   COPY_FORMATS.MARKDOWN,
 *   ""
 * );
 * // Returns: "[Example](https://example.com)"
 * ```
 */
export function formatLink(pageInfo: PageInfo, format: CopyFormat, customFormat: string): string {
    logger.debug("Formatting link:", { pageInfo, format });

    let { url, selectedText } = pageInfo;

    // Truncate extremely long URLs
    if (url.length > MAX_URL_LENGTH) {
        logger.warn("URL exceeds maximum length, truncating");
        url = truncate(url, MAX_URL_LENGTH);
    }

    // Fallback for empty titles
    let title = pageInfo.title?.trim();
    if (!title) {
        try {
            const hostname = new URL(url).hostname;
            title = hostname || "Untitled Page";
        } catch {
            title = "Untitled Page";
        }
    }

    // Truncate extremely long titles
    if (title.length > MAX_TITLE_LENGTH) {
        logger.debug("Title exceeds maximum length, truncating");
        title = truncate(title, MAX_TITLE_LENGTH);
    }

    let formattedLink = "";
    let escapeSelectedText: (text: string) => string = (text) => text;

    switch (format) {
        case COPY_FORMATS.MARKDOWN:
            formattedLink = `[${escapeMarkdown(title)}](${escapeMarkdown(url)})`;
            escapeSelectedText = escapeMarkdown;
            break;
        case COPY_FORMATS.HTML:
            formattedLink = `<a href="${escapeHtml(url)}">${escapeHtml(title)}</a>`;
            escapeSelectedText = escapeHtml;
            break;
        case COPY_FORMATS.PLAINTEXT:
            formattedLink = `${title} - ${url}`;
            break;
        case COPY_FORMATS.CUSTOM: {
            // Detect if custom format contains HTML tags and escape accordingly
            const containsHtml = /<[a-z][^>]*>/i.test(customFormat);
            const escapedTitle = containsHtml ? escapeHtml(title) : title;
            const escapedUrl = containsHtml ? escapeHtml(url) : url;
            escapeSelectedText = containsHtml ? escapeHtml : (text) => text;
            formattedLink = customFormat
                .replaceAll("{title}", escapedTitle)
                .replaceAll("{url}", escapedUrl);
            break;
        }
        default:
            logger.warn("Unknown format, using markdown:", format);
            formattedLink = `[${escapeMarkdown(title)}](${escapeMarkdown(url)})`;
            escapeSelectedText = escapeMarkdown;
    }

    // Append selected text as blockquote if present
    if (selectedText && selectedText.trim()) {
        formattedLink += `\n\n> ${escapeSelectedText(selectedText.trim())}`;
    }

    return formattedLink;
}

/**
 * Copy text to the system clipboard using the Clipboard API
 * @param text The text to copy
 * @throws Error if clipboard access is denied or fails
 * @example
 * ```ts
 * await copyToClipboard("[Example](https://example.com)");
 * ```
 */
export async function copyToClipboard(text: string): Promise<void> {
    try {
        await navigator.clipboard.writeText(text);
        logger.debug("Copied to clipboard:", text);
    } catch (error) {
        logger.error("Failed to copy to clipboard:", error);
        throw error;
    }
}

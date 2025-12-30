import { COPY_FORMATS } from "@/lib/types/format";
import type { CopyFormat, PageInfo } from "@/lib/types/format";
import { logger } from "@/lib/utils/logger";

// Limits for very long content
const MAX_TITLE_LENGTH = 200;
const MAX_URL_LENGTH = 2000;

/**
 * Truncate a string to a maximum length with ellipsis
 */
function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength - 3) + "...";
}

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

    switch (format) {
        case COPY_FORMATS.MARKDOWN:
            formattedLink = `[${title}](${url})`;
            break;
        case COPY_FORMATS.HTML:
            formattedLink = `<a href="${url}">${title}</a>`;
            break;
        case COPY_FORMATS.PLAINTEXT:
            formattedLink = `${title} - ${url}`;
            break;
        case COPY_FORMATS.CUSTOM:
            formattedLink = customFormat.replace("{title}", title).replace("{url}", url);
            break;
        default:
            logger.warn("Unknown format, using markdown:", format);
            formattedLink = `[${title}](${url})`;
    }

    // Append selected text as blockquote if present
    if (selectedText && selectedText.trim()) {
        formattedLink += `\n\n> ${selectedText.trim()}`;
    }

    return formattedLink;
}

export async function copyToClipboard(text: string): Promise<void> {
    try {
        await navigator.clipboard.writeText(text);
        logger.debug("Copied to clipboard:", text);
    } catch (error) {
        logger.error("Failed to copy to clipboard:", error);
        throw error;
    }
}

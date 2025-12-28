import { COPY_FORMATS } from "@/lib/types/format";
import type { CopyFormat, PageInfo } from "@/lib/types/format";
import { logger } from "@/lib/utils/logger";

export function formatLink(pageInfo: PageInfo, format: CopyFormat, customFormat: string): string {
    logger.debug("Formatting link:", { pageInfo, format });

    const { title, url, selectedText } = pageInfo;
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

/**
 * Check if a URL is a restricted page where content scripts cannot run
 * @param url The URL to check
 * @returns True if the page is restricted
 */
export function isRestrictedPage(url: string): boolean {
    if (!url) {
        return true;
    }

    const restrictedProtocols = ["about:", "chrome:", "edge:", "moz-extension:", "chrome-extension:"];
    const restrictedDomains = ["chromewebstore.google.com", "addons.mozilla.org"];

    // Check protocol
    if (restrictedProtocols.some((protocol) => url.startsWith(protocol))) {
        return true;
    }

    // Check domain
    try {
        const urlObj = new URL(url);
        if (restrictedDomains.some((domain) => urlObj.hostname.includes(domain))) {
            return true;
        }
    } catch {
        return true; // Invalid URL
    }

    return false;
}

/**
 * Get a user-friendly message for why copying failed on a restricted page
 * @param url The URL that failed
 * @returns User-friendly error message
 */
export function getRestrictedPageMessage(url: string): string {
    if (url.startsWith("about:")) {
        return "Cannot copy from browser pages (about:)";
    }
    if (url.startsWith("chrome:") || url.startsWith("edge:")) {
        return "Cannot copy from browser settings pages";
    }
    if (url.includes("chromewebstore.google.com") || url.includes("addons.mozilla.org")) {
        return "Cannot copy from extension store pages";
    }
    return "Cannot copy from this page";
}

import { logger } from "@/lib/utils/logger";
import { getCopyOptions } from "@/lib/storage";
import { formatLink, copyToClipboard } from "@/lib/utils/format";
import { showToast } from "@/lib/utils/toast";
import { TOAST_TYPES } from "@/lib/types/toast";
import { TOAST_MESSAGES } from "@/lib/constants";
import type { PageInfo } from "@/lib/types/format";

export default defineContentScript({
    matches: ["<all_urls>"],
    async main() {
        logger.info("Smart Clippy content script activated");

        // Listen for keyboard shortcut via background script
        browser.runtime.onMessage.addListener((message) => {
            if (message.action === "copy-page-info") {
                handleCopyPageInfo();
            }
        });

        async function handleCopyPageInfo() {
            logger.debug("Copying page info to clipboard");

            try {
                // Get page info
                const pageInfo: PageInfo = {
                    title: document.title,
                    url: window.location.href,
                    selectedText: window.getSelection()?.toString().trim(),
                };

                // Get user preferences
                const options = await getCopyOptions();

                // Format the link
                const formattedLink = formatLink(
                    pageInfo,
                    options.copyFormat,
                    options.customFormat
                );

                // Copy to clipboard
                await copyToClipboard(formattedLink);

                // Show success toast
                showToast(TOAST_MESSAGES.COPY_SUCCESS, TOAST_TYPES.SUCCESS);
            } catch (error) {
                logger.error("Error copying link:", error);
                showToast(TOAST_MESSAGES.COPY_ERROR, TOAST_TYPES.ERROR);
            }
        }
    },
});

import { logger } from "@/lib/utils/logger";
import { isRestrictedPage, getRestrictedPageMessage } from "@/lib/utils/page-utils";

export default defineBackground(() => {
    logger.info("Smart Clippy background script initialized", {
        id: browser.runtime.id,
        version: browser.runtime.getManifest().version,
    });

    // Handle keyboard command
    browser.commands.onCommand.addListener((command) => {
        if (command === "copy-page-info") {
            logger.debug("Keyboard command triggered:", command);
            handleCopyCommand();
        }
    });

    async function handleCopyCommand() {
        try {
            // Get active tab
            const [activeTab] = await browser.tabs.query({
                active: true,
                currentWindow: true,
            });

            if (!activeTab || !activeTab.id) {
                logger.error("No active tab found");
                return;
            }

            // Check if page is restricted
            if (activeTab.url && isRestrictedPage(activeTab.url)) {
                const message = getRestrictedPageMessage(activeTab.url);
                logger.warn("Restricted page:", activeTab.url);

                // Show notification badge (optional visual feedback)
                try {
                    await browser.action.setBadgeText({ text: "✗", tabId: activeTab.id });
                    await browser.action.setBadgeBackgroundColor({ color: "#f44336", tabId: activeTab.id });
                    setTimeout(() => {
                        browser.action.setBadgeText({ text: "", tabId: activeTab.id });
                    }, 2000);
                } catch (badgeError) {
                    logger.debug("Could not set badge:", badgeError);
                }

                // Note: Can't show toast on restricted pages, only log
                logger.info(message);
                return;
            }

            // Execute content script to copy
            await browser.tabs.sendMessage(activeTab.id, {
                action: "copy-page-info",
            });
        } catch (error) {
            logger.error("Error handling copy command:", error);

            // If message failed to send, content script might not be injected
            if (error instanceof Error && error.message.includes("Could not establish connection")) {
                logger.warn("Content script not ready. Page might still be loading.");
            }
        }
    }
});

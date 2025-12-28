import { logger } from "@/lib/utils/logger";

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

            // Execute content script to copy
            await browser.tabs.sendMessage(activeTab.id, {
                action: "copy-page-info",
            });
        } catch (error) {
            logger.error("Error handling copy command:", error);
        }
    }
});

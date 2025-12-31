<script lang="ts">
    import { TOAST_TYPES } from "@/lib/types/toast";
    import { TOAST_MESSAGES } from "@/lib/constants";
    import { getCopyOptions } from "@/lib/storage";
    import { formatLink, copyToClipboard } from "@/lib/utils/format";
    import { getCopyShortcut, formatShortcut } from "@/lib/utils/keyboard-shortcut";
    import { isRestrictedPage, getRestrictedPageMessage } from "@/lib/utils/page-utils";
    import { logger } from "@/lib/utils/logger";
    import type { PageInfo } from "@/lib/types/format";
    import Toast from "@/lib/components/Toast.svelte";

    let showSuccessToast = $state(false);
    let showErrorToast = $state(false);
    let errorMessage = $state<string>(TOAST_MESSAGES.COPY_ERROR);
    let isLoading = $state(false);
    let keyboardShortcut = $state<string | null>(null);

    // Load keyboard shortcut on mount
    $effect(() => {
        getCopyShortcut().then((shortcut) => {
            if (shortcut) {
                keyboardShortcut = formatShortcut(shortcut);
            }
        });
    });

    async function handleCopyClick() {
        isLoading = true;
        try {
            // Get active tab
            const [activeTab] = await browser.tabs.query({
                active: true,
                currentWindow: true,
            });

            if (!activeTab?.url) {
                throw new Error("Unable to get tab information");
            }

            // Check if page is restricted
            if (isRestrictedPage(activeTab.url)) {
                errorMessage = getRestrictedPageMessage(activeTab.url);
                showErrorToast = true;
                return;
            }

            if (!activeTab.title) {
                throw new Error("Unable to get tab title");
            }

            const pageInfo: PageInfo = {
                title: activeTab.title,
                url: activeTab.url,
                // Popup can't access selected text from the page
            };

            // Get user preferences
            const options = await getCopyOptions();

            // Format and copy
            const formattedLink = formatLink(pageInfo, options.copyFormat, options.customFormat);
            await copyToClipboard(formattedLink);

            showSuccessToast = true;
        } catch (error) {
            logger.error("Error copying link:", error);
            errorMessage = TOAST_MESSAGES.COPY_ERROR;
            showErrorToast = true;
        } finally {
            isLoading = false;
        }
    }

    function handleOpenOptions() {
        browser.runtime.openOptionsPage();
    }
</script>

<main class="w-72 p-4">
    <div class="mb-4 flex items-center justify-between">
        <h1 class="text-lg font-bold">Smart Clippy</h1>
        <img src="/icons/icon-32.png" alt="Logo" class="size-6" />
    </div>

    <div class="space-y-2">
        <button
            class="w-full rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            onclick={handleCopyClick}
            disabled={isLoading}
            aria-busy={isLoading}
            aria-label={isLoading
                ? "Copying link to clipboard"
                : "Copy current page link to clipboard"}
        >
            {isLoading ? "Copying..." : "Copy Link"}
        </button>

        <button
            class="w-full rounded border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onclick={handleOpenOptions}
            aria-label="Open Smart Clippy options page"
        >
            Options
        </button>
    </div>

    {#if keyboardShortcut}
        <div class="mt-4 text-center text-xs text-gray-500">
            Press {keyboardShortcut} to copy
        </div>
    {/if}
</main>

{#if showSuccessToast}
    <Toast
        message={TOAST_MESSAGES.COPY_SUCCESS}
        type={TOAST_TYPES.SUCCESS}
        duration={3000}
        onClose={() => (showSuccessToast = false)}
    />
{/if}

{#if showErrorToast}
    <Toast
        message={errorMessage}
        type={TOAST_TYPES.ERROR}
        duration={3000}
        onClose={() => (showErrorToast = false)}
    />
{/if}

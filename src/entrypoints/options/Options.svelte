<script lang="ts">
    import { onMount } from "svelte";
    import { COPY_FORMATS } from "@/lib/types/format";
    import type { CopyOptions } from "@/lib/types/format";
    import { getCopyOptions, saveCopyOptions } from "@/lib/storage";
    import { getCopyShortcut, formatShortcut } from "@/lib/utils/keyboard-shortcut";
    import { getCustomFormatError } from "@/lib/utils/validation";
    import { cn } from "@/lib/utils/cn";
    import { logger } from "@/lib/utils/logger";
    import { TOAST_TYPES } from "@/lib/types/toast";
    import { TOAST_MESSAGES } from "@/lib/constants";
    import Toast from "@/lib/components/Toast.svelte";

    let options = $state<CopyOptions>({
        copyFormat: COPY_FORMATS.MARKDOWN,
        customFormat: "",
    });
    let isLoading = $state(true);
    let showSavedToast = $state(false);
    let showCustomInput = $derived(options.copyFormat === COPY_FORMATS.CUSTOM);
    let keyboardShortcut = $state<string | null>(null);
    let customFormatError = $derived(
        showCustomInput ? getCustomFormatError(options.customFormat) : null
    );

    // Live preview for custom format
    let customFormatPreview = $derived(() => {
        if (!showCustomInput || !options.customFormat) {
            return null;
        }

        const exampleTitle = "Example Page";
        const exampleUrl = "https://example.com";

        return options.customFormat
            .replace(/{title}/g, exampleTitle)
            .replace(/{url}/g, exampleUrl);
    });

    onMount(async () => {
        try {
            options = await getCopyOptions();
            const shortcut = await getCopyShortcut();
            if (shortcut) {
                keyboardShortcut = formatShortcut(shortcut);
            }
        } catch (error) {
            logger.error("Error loading options:", error);
        } finally {
            isLoading = false;
        }
    });

    async function handleSave() {
        // Validate custom format if selected
        if (showCustomInput && customFormatError) {
            logger.warn("Cannot save: invalid custom format");
            return;
        }

        try {
            await saveCopyOptions(options);
            showSavedToast = true;
        } catch (error) {
            logger.error("Error saving options:", error);
        }
    }
</script>

<main class="mx-auto max-w-2xl p-8">
    <div class="mb-6 flex items-center justify-between">
        <h1 class="text-3xl font-bold">Smart Clippy Options</h1>
        <img src="/icons/icon-48.png" alt="Logo" class="size-12" />
    </div>

    {#if isLoading}
        <div class="flex justify-center py-8">
            <div
                class="size-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
            ></div>
        </div>
    {:else}
        <div class="space-y-6">
            <div class="rounded-lg bg-blue-50 p-4">
                <p class="text-sm text-gray-700">
                    Configure how Smart Clippy formats your copied links.
                    {#if keyboardShortcut}
                        Use the keyboard shortcut
                        <kbd class="rounded bg-white px-2 py-1 text-xs font-semibold shadow">
                            {keyboardShortcut}
                        </kbd>
                        to quickly copy the current page.
                    {/if}
                </p>
            </div>

            <div>
                <label for="format-select" class="mb-2 block text-sm font-medium text-gray-700">
                    Copy Format
                </label>
                <select
                    id="format-select"
                    bind:value={options.copyFormat}
                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value={COPY_FORMATS.MARKDOWN}> Markdown - [Page Title](URL) </option>
                    <option value={COPY_FORMATS.HTML}>
                        HTML - &lt;a href="URL"&gt;Page Title&lt;/a&gt;
                    </option>
                    <option value={COPY_FORMATS.PLAINTEXT}> Plain Text - Page Title - URL </option>
                    <option value={COPY_FORMATS.CUSTOM}> Custom Format </option>
                </select>
            </div>

            {#if showCustomInput}
                <div>
                    <label for="custom-format" class="mb-2 block text-sm font-medium text-gray-700">
                        Custom Format
                    </label>
                    <input
                        id="custom-format"
                        type="text"
                        bind:value={options.customFormat}
                        placeholder="Use {'{title}'} and {'{url}'} as placeholders"
                        class={cn(
                            "w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1",
                            customFormatError
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        )}
                    />
                    {#if customFormatError}
                        <p class="mt-1 text-xs text-red-600">{customFormatError}</p>
                    {:else}
                        <p class="mt-1 text-xs text-gray-500">
                            Example: <code class="rounded bg-gray-100 px-1">{"{title}"}: {"{url}"}</code
                            >
                        </p>
                    {/if}

                    {#if customFormatPreview && !customFormatError}
                        <div class="mt-3 rounded-md bg-blue-50 p-3">
                            <p class="mb-1 text-xs font-medium text-gray-700">Preview:</p>
                            <code class="block break-all text-sm text-gray-800">{customFormatPreview}</code>
                        </div>
                    {/if}
                </div>
            {/if}

            <div class="flex items-center gap-4 pt-4">
                <button
                    onclick={handleSave}
                    disabled={!!customFormatError}
                    aria-label="Save copy format options"
                    aria-disabled={!!customFormatError}
                    class="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Save Options
                </button>
                {#if customFormatError}
                    <span class="text-xs text-red-600" role="alert">
                        Fix errors before saving
                    </span>
                {/if}
            </div>

            <div class="border-t pt-6">
                <h2 class="mb-3 text-xl font-semibold">Format Examples</h2>
                <div class="space-y-2 text-sm">
                    <div>
                        <strong>Markdown:</strong>
                        <code class="ml-2 rounded bg-gray-100 px-2 py-1">
                            [Example Page](https://example.com)
                        </code>
                    </div>
                    <div>
                        <strong>HTML:</strong>
                        <code class="ml-2 rounded bg-gray-100 px-2 py-1">
                            &lt;a href="https://example.com"&gt;Example Page&lt;/a&gt;
                        </code>
                    </div>
                    <div>
                        <strong>Plain Text:</strong>
                        <code class="ml-2 rounded bg-gray-100 px-2 py-1">
                            Example Page - https://example.com
                        </code>
                    </div>
                </div>
            </div>
        </div>
    {/if}

    <footer class="mt-8 border-t pt-6 text-center text-sm text-gray-500">
        <p>Smart Clippy v{browser.runtime.getManifest().version}</p>
        <p class="mt-1">by guidodinello</p>
    </footer>
</main>

{#if showSavedToast}
    <Toast
        message={TOAST_MESSAGES.OPTIONS_SAVED}
        type={TOAST_TYPES.SUCCESS}
        duration={3000}
        onClose={() => (showSavedToast = false)}
    />
{/if}

import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
    srcDir: "src",
    modules: ["@wxt-dev/module-svelte"],
    manifest: {
        name: "Smart Clippy",
        description: "Copies tab title and URL to clipboard in various formats.",
        permissions: ["activeTab", "clipboardWrite", "storage"],
        icons: {
            16: "icons/icon-16.png",
            32: "icons/icon-32.png",
            48: "icons/icon-48.png",
            128: "icons/icon-128.png",
        },
        browser_specific_settings: {
            gecko: {
                id: "smart-clippy@guidodinello.dev",
                // Required by Firefox for all new extensions. This extension does not collect any user data
                // @ts-ignore
                data_collection_permissions: { required: ["none"] },
            },
        },
        commands: {
            "copy-page-info": {
                suggested_key: {
                    default: "Alt+Shift+C",
                    mac: "Alt+Shift+C",
                },
                description: "Copy page title and URL to clipboard",
            },
        },
    },
    vite: () => ({
        plugins: [tailwindcss()],
    }),
});

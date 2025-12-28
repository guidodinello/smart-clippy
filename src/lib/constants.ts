import { COPY_FORMATS } from "@/lib/types/format";

export const STORAGE_KEYS = {
    COPY_FORMAT: "copyFormat",
    CUSTOM_FORMAT: "customFormat",
} as const;

export const DEFAULT_OPTIONS = {
    copyFormat: COPY_FORMATS.MARKDOWN,
    customFormat: "",
} as const;

export const TOAST_DURATION = {
    SHORT: 2000,
    DEFAULT: 3000,
    LONG: 5000,
} as const;

export const KEYBOARD_SHORTCUT = {
    DEFAULT: "Ctrl+Shift+V",
    MAC: "Command+Shift+V",
} as const;

export const TOAST_MESSAGES = {
    COPY_SUCCESS: "Link copied!",
    COPY_ERROR: "Failed to copy link. Check the console for more details.",
    OPTIONS_SAVED: "Options saved!",
} as const;

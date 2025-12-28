export const COPY_FORMATS = {
    MARKDOWN: "markdown",
    HTML: "html",
    PLAINTEXT: "plaintext",
    CUSTOM: "custom",
} as const;

export type CopyFormat = (typeof COPY_FORMATS)[keyof typeof COPY_FORMATS];

export interface CopyOptions {
    copyFormat: CopyFormat;
    customFormat: string;
}

export interface PageInfo {
    title: string;
    url: string;
    selectedText?: string;
}

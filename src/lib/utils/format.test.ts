import { describe, it, expect, vi, beforeEach } from "vitest";
import { formatLink, copyToClipboard } from "./format";
import { COPY_FORMATS } from "@/lib/types/format";
import type { PageInfo } from "@/lib/types/format";

describe("formatLink", () => {
    const basicPageInfo: PageInfo = {
        title: "Example Page",
        url: "https://example.com",
        selectedText: "",
    };

    describe("Markdown format", () => {
        it("should format basic page info as markdown", () => {
            const result = formatLink(basicPageInfo, COPY_FORMATS.MARKDOWN, "");
            expect(result).toBe("[Example Page](https://example.com)");
        });

        it("should append selected text as blockquote", () => {
            const pageInfo = { ...basicPageInfo, selectedText: "Selected text" };
            const result = formatLink(pageInfo, COPY_FORMATS.MARKDOWN, "");
            expect(result).toBe("[Example Page](https://example.com)\n\n> Selected text");
        });

        it("should handle empty title with URL fallback", () => {
            const pageInfo = { ...basicPageInfo, title: "" };
            const result = formatLink(pageInfo, COPY_FORMATS.MARKDOWN, "");
            expect(result).toBe("[example.com](https://example.com)");
        });

        it("should truncate very long titles", () => {
            const longTitle = "a".repeat(250);
            const pageInfo = { ...basicPageInfo, title: longTitle };
            const result = formatLink(pageInfo, COPY_FORMATS.MARKDOWN, "");
            expect(result.length).toBeLessThan(250);
            expect(result).toContain("...");
        });

        it("should truncate very long URLs", () => {
            const longUrl = "https://example.com/" + "a".repeat(2500);
            const pageInfo = { ...basicPageInfo, url: longUrl };
            const result = formatLink(pageInfo, COPY_FORMATS.MARKDOWN, "");
            expect(result).toContain("...");
        });
    });

    describe("HTML format", () => {
        it("should format basic page info as HTML", () => {
            const result = formatLink(basicPageInfo, COPY_FORMATS.HTML, "");
            expect(result).toBe('<a href="https://example.com">Example Page</a>');
        });

        it("should escape HTML special characters in title", () => {
            const pageInfo = { ...basicPageInfo, title: "<script>alert('xss')</script>" };
            const result = formatLink(pageInfo, COPY_FORMATS.HTML, "");
            expect(result).toBe(
                '<a href="https://example.com">&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;</a>'
            );
        });

        it("should escape HTML special characters in URL", () => {
            const pageInfo = {
                ...basicPageInfo,
                url: 'https://example.com/?q=test&param="value"',
            };
            const result = formatLink(pageInfo, COPY_FORMATS.HTML, "");
            expect(result).toContain("&amp;");
            expect(result).toContain("&quot;");
        });

        it("should escape all HTML entities", () => {
            const pageInfo = {
                ...basicPageInfo,
                title: '& < > " \'',
            };
            const result = formatLink(pageInfo, COPY_FORMATS.HTML, "");
            expect(result).toBe(
                '<a href="https://example.com">&amp; &lt; &gt; &quot; &#39;</a>'
            );
        });
    });

    describe("Plain text format", () => {
        it("should format basic page info as plain text", () => {
            const result = formatLink(basicPageInfo, COPY_FORMATS.PLAINTEXT, "");
            expect(result).toBe("Example Page - https://example.com");
        });
    });

    describe("Custom format", () => {
        it("should replace {title} and {url} placeholders", () => {
            const result = formatLink(basicPageInfo, COPY_FORMATS.CUSTOM, "{title}: {url}");
            expect(result).toBe("Example Page: https://example.com");
        });

        it("should replace all occurrences of placeholders", () => {
            const result = formatLink(
                basicPageInfo,
                COPY_FORMATS.CUSTOM,
                "{title} - {title} ({url})"
            );
            expect(result).toBe("Example Page - Example Page (https://example.com)");
        });

        it("should handle custom format without placeholders", () => {
            const result = formatLink(basicPageInfo, COPY_FORMATS.CUSTOM, "Static text");
            expect(result).toBe("Static text");
        });
    });

    describe("Selected text handling", () => {
        it("should trim selected text", () => {
            const pageInfo = { ...basicPageInfo, selectedText: "  text with spaces  " };
            const result = formatLink(pageInfo, COPY_FORMATS.MARKDOWN, "");
            expect(result).toBe("[Example Page](https://example.com)\n\n> text with spaces");
        });

        it("should not add blockquote for empty selected text", () => {
            const pageInfo = { ...basicPageInfo, selectedText: "   " };
            const result = formatLink(pageInfo, COPY_FORMATS.MARKDOWN, "");
            expect(result).toBe("[Example Page](https://example.com)");
        });
    });
});

describe("copyToClipboard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should call navigator.clipboard.writeText with provided text", async () => {
        const text = "Test text";
        await copyToClipboard(text);
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text);
    });

    it("should throw error if clipboard write fails", async () => {
        const error = new Error("Clipboard access denied");
        vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(error);

        await expect(copyToClipboard("test")).rejects.toThrow();
    });
});

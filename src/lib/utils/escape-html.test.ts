import { describe, it, expect } from "vitest";
import { escapeHtml, escapeMarkdown } from "./escape-html";

describe("escapeHtml", () => {
    it("should escape ampersand", () => {
        expect(escapeHtml("a & b")).toBe("a &amp; b");
    });

    it("should escape less than", () => {
        expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
    });

    it("should escape greater than", () => {
        expect(escapeHtml("x > y")).toBe("x &gt; y");
    });

    it("should escape double quotes", () => {
        expect(escapeHtml('say "hello"')).toBe("say &quot;hello&quot;");
    });

    it("should escape single quotes", () => {
        expect(escapeHtml("it's")).toBe("it&#39;s");
    });

    it("should escape all HTML special characters", () => {
        expect(escapeHtml(`& < > " '`)).toBe("&amp; &lt; &gt; &quot; &#39;");
    });

    it("should handle XSS attempt", () => {
        expect(escapeHtml('<script>alert("xss")</script>')).toBe(
            "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
        );
    });

    it("should not modify text without special characters", () => {
        expect(escapeHtml("Hello World")).toBe("Hello World");
    });
});

describe("escapeMarkdown", () => {
    it("should escape opening bracket", () => {
        expect(escapeMarkdown("a [bracket]")).toBe("a \\[bracket\\]");
    });

    it("should escape closing bracket", () => {
        expect(escapeMarkdown("test]")).toBe("test\\]");
    });

    it("should escape opening parenthesis", () => {
        expect(escapeMarkdown("test(1)")).toBe("test\\(1\\)");
    });

    it("should escape closing parenthesis", () => {
        expect(escapeMarkdown("test)")).toBe("test\\)");
    });

    it("should escape backslash", () => {
        expect(escapeMarkdown("path\\to\\file")).toBe("path\\\\to\\\\file");
    });

    it("should escape all markdown special characters", () => {
        expect(escapeMarkdown("[link](url)")).toBe("\\[link\\]\\(url\\)");
    });

    it("should handle markdown injection attempt", () => {
        expect(escapeMarkdown("](javascript:alert('xss'))")).toBe(
            "\\]\\(javascript:alert\\('xss'\\)\\)"
        );
    });

    it("should not modify text without special characters", () => {
        expect(escapeMarkdown("Hello World")).toBe("Hello World");
    });

    it("should handle mixed special characters", () => {
        expect(escapeMarkdown("Test [title] with (parens) and \\backslash")).toBe(
            "Test \\[title\\] with \\(parens\\) and \\\\backslash"
        );
    });
});

/**
 * Conditionally join CSS class names, filtering out falsy values
 * Useful for conditional Tailwind classes in Svelte components
 * @param classes Class names to join (falsy values are filtered out)
 * @returns Joined class string
 * @example
 * ```ts
 * cn("base-class", isActive && "active", "another-class")
 * // Returns: "base-class active another-class" (if isActive is true)
 * ```
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
    return classes.filter(Boolean).join(" ");
}

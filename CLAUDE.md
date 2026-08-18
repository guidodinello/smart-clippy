# Claude Code Guidelines for Smart Clippy

This document outlines codebase patterns, standards, and conventions for working on the Smart Clippy browser extension.

## Git Workflow

### Branch Naming

Follow conventional branch naming patterns:

-   `feat/feature-name` - New features
-   `fix/bug-description` - Bug fixes
-   `docs/documentation-change` - Documentation updates
-   `refactor/refactor-description` - Code refactoring
-   `style/style-change` - Code style changes
-   `test/test-description` - Test additions or changes
-   `chore/chore-description` - Build process or auxiliary tool changes

**Always create a new branch from `main` before starting work.**

### Commit Messages

**Use Conventional Commits format with single-line messages (no description):**

```bash
<type>: <subject>
```

**Types:**

-   `feat` - New feature
-   `fix` - Bug fix
-   `docs` - Documentation changes
-   `style` - Code style changes (formatting, missing semicolons, etc.)
-   `refactor` - Code refactoring
-   `test` - Adding or updating tests
-   `chore` - Build process, dependencies, or tooling changes

**Examples:**

```bash
feat: add custom format templates
fix: resolve clipboard copy on Firefox
docs: update installation instructions for Firefox
refactor: simplify format utilities logic
```

### Pre-commit and Pre-push Hooks

The project uses Husky for Git hooks:

**Pre-commit:**

-   Runs `lint-staged` which:
    -   Formats and lints `.js`, `.ts`, `.svelte` files with Prettier and ESLint
    -   Formats `.json`, `.md`, `.css`, `.html` files with Prettier

**Pre-push:**

-   Runs `pnpm check` (svelte-check for type checking)
-   Runs `pnpm build` (ensures the project builds successfully)

**Important:** Never bypass hooks unless absolutely necessary. If hooks fail, fix the issues before committing or pushing.

### Pull Requests

1. Create a new branch from `main`
2. Make your changes following the coding standards
3. Commit using conventional commit format
4. Push branch to remote: `git push -u origin <branch-name>`
5. Create PR with the same title as the commit message
6. Add a brief summary in the PR description explaining the changes

## Code Organization

### Project Structure

```
src/
├── entrypoints/          # Extension entry points (background, content, popup, options)
├── lib/
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── components/      # Shared UI components
│   ├── storage.ts       # Browser storage wrapper
│   └── constants.ts     # Application constants
└── public/
    └── icons/           # Extension icons
```

### File Naming Conventions

-   **Components:** PascalCase (e.g., `Toast.svelte`, `ErrorDisplay.svelte`)
-   **Utilities:** kebab-case (e.g., `logger.ts`, `format.ts`, `toast.ts`)
-   **Types:** kebab-case (e.g., `format.ts`, `toast.ts`)

## Coding Standards

### TypeScript

-   Use TypeScript for all new files
-   Define explicit types for function parameters and return values
-   Use `interface` for object shapes, `type` for unions/intersections
-   Leverage `satisfies` for type checking without widening

**Example:**

```typescript
const pageInfo = {
    title: document.title,
    url: window.location.href,
} satisfies PageInfo;
```

### Svelte 5 (Runes API)

-   Use Svelte 5's new runes API (`$state`, `$derived`, `$effect`)
-   For compositions, use `.svelte.ts` files
-   Keep components focused and single-responsibility

### State Management

-   Use Svelte stores for global state
-   Browser storage sync happens through stores
-   Storage change listeners enable cross-tab sync
-   Always handle loading and error states

**Store pattern:**

```typescript
interface StoreState {
    data: T[];
    isLoading: boolean;
    error: string | null;
}
```

### Styling

-   Use Tailwind CSS 4 for styling
-   Follow utility-first approach
-   Prefer Tailwind utilities over custom CSS
-   Use `@/lib/utils/cn.ts` for conditional class names

### Logging

-   Use the centralized logger from `@/lib/utils/logger.ts`
-   Log levels: `debug`, `info`, `warn`, `error`
-   Include context in log messages

**Example:**

```typescript
logger.debug("Copying page info", pageInfo);
logger.error("Failed to copy to clipboard", err);
```

### Error Handling

-   Always handle errors in async operations
-   Provide user-friendly error messages
-   Update store error state for UI feedback
-   Log errors with appropriate context

### Browser Extension Patterns

**Storage:**

-   Always use `wxt/storage` (not `browser.storage` directly) — it provides key namespacing, typed getters, and a `watch()` API
-   Use `sync:` prefix for cross-device sync, `local:` for device-local data
-   Define storage keys in `constants.ts`

**Content Scripts:**

-   Wait for DOM elements before manipulation
-   Use debouncing for URL change handlers
-   Clean up listeners on component destroy

## Testing

Before pushing:

1. Test in Chrome (primary target)
2. Test in Firefox (secondary target)
3. Verify keyboard shortcut works (Alt+Shift+C)
4. Check that all copy formats work correctly
5. Test selected text appending
6. Verify options page saves and loads preferences

## Available Scripts

```bash
pnpm dev              # Development mode (Chrome)
pnpm dev:firefox      # Development mode (Firefox)
pnpm build            # Production build (Chrome)
pnpm build:firefox    # Production build (Firefox)
pnpm check            # Type checking with svelte-check
pnpm lint             # Lint code
pnpm lint:fix         # Lint and auto-fix
pnpm format           # Format code with Prettier
pnpm format:check     # Check formatting
pnpm fix              # Run lint:fix, format, and check
```

## Key Principles

1. **Cross-browser compatibility** - Test on both Chrome and Firefox
2. **Type safety** - Leverage TypeScript's type system
3. **User experience** - Provide clear feedback and error messages
4. **Performance** - Use debouncing, efficient DOM queries
5. **Maintainability** - Write clean, documented, and testable code
6. **Consistency** - Follow existing patterns and conventions

## Documentation

-   Add JSDoc comments for public APIs and complex functions
-   Keep README.md concise and user-focused
-   Update documentation when changing behavior
-   Use inline comments sparingly, prefer self-documenting code

## Dependencies

-   Prefer `pnpm` as the package manager
-   Keep dependencies up to date
-   Review dependency changes carefully
-   Use exact versions for critical dependencies

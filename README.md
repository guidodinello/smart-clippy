# Smart Clippy

> Copy tab title and URL to clipboard in various formats with a simple keyboard shortcut

A modern browser extension that lets you quickly copy the current page's title and URL in multiple formats (Markdown, HTML, Plain text, or custom formats) using a keyboard shortcut.

## Features

-   **Quick Copy**: Press `Ctrl+Shift+V` (Windows/Linux) or `Cmd+Shift+V` (Mac) to instantly copy page info
-   **Multiple Formats**:
    -   Markdown: `[Page Title](URL)`
    -   HTML: `<a href="URL">Page Title</a>`
    -   Plain Text: `Page Title - URL`
    -   Custom: Define your own format using `{title}` and `{url}` placeholders
-   **Selected Text**: Automatically appends selected text as a blockquote
-   **Toast Notifications**: Visual feedback on copy success/failure
-   **Cross-Browser**: Works on Chrome, Firefox, and Chromium-based browsers
-   **Modern Stack**: Built with WXT, Svelte 5, TypeScript, and Tailwind CSS 4

## Installation

### From Source

1. Clone the repository:

```bash
git clone https://github.com/guidodinello/smart-clippy.git
cd smart-clippy
```

2. Install dependencies:

```bash
pnpm install
```

3. Build for your browser:

```bash
# For Chrome/Chromium
pnpm build

# For Firefox
pnpm build:firefox
```

4. Load the extension:
    - **Chrome**: Navigate to `chrome://extensions/`, enable "Developer mode", click "Load unpacked", and select the `.output/chrome-mv3` directory
    - **Firefox**: Navigate to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", and select any file in the `.output/firefox-mv2` directory

## Usage

### Quick Copy

1. Visit any webpage
2. Press `Ctrl+Shift+V` (Windows/Linux) or `Cmd+Shift+V` (Mac)
3. The page title and URL are copied to your clipboard!

### With Selected Text

1. Select any text on the page
2. Press the keyboard shortcut
3. The selected text will be appended as a blockquote:

```markdown
[Page Title](URL)

> Selected text here
```

### Using the Popup

Click the extension icon in your browser toolbar to:

-   Copy the current page with a button click
-   Access the Options page

### Configuring Formats

1. Click the extension icon and select "Options"
2. Choose your preferred format from the dropdown
3. For custom formats, use `{title}` and `{url}` as placeholders
4. Click "Save Options"

### Format Examples

**Markdown** (default):

```
[GitHub - facebook/react](https://github.com/facebook/react)
```

**HTML**:

```html
<a href="https://github.com/facebook/react">GitHub - facebook/react</a>
```

**Plain Text**:

```
GitHub - facebook/react - https://github.com/facebook/react
```

**Custom** (example: `{title}: {url}`):

```
GitHub - facebook/react: https://github.com/facebook/react
```

## Development

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher)
-   [pnpm](https://pnpm.io/) package manager

### Setup

```bash
pnpm install
```

### Development Mode

Run with hot reload:

```bash
# Chrome
pnpm dev

# Firefox
pnpm dev:firefox

# Chrome Flatpak
pnpm dev:chrome-flatpak
```

### Building

```bash
# Production build for Chrome
pnpm build

# Production build for Firefox
pnpm build:firefox
```

### Creating Distribution Packages

```bash
# Create ZIP for Chrome Web Store
pnpm zip

# Create ZIP for Firefox Add-ons
pnpm zip:firefox
```

### Code Quality

```bash
# Type checking
pnpm check

# Lint code
pnpm lint

# Format code
pnpm format

# Fix lint and format issues
pnpm fix
```

## Technology Stack

-   **[WXT](https://wxt.dev/)** - Modern cross-browser extension framework
-   **[Svelte 5](https://svelte.dev/)** - Reactive UI framework with runes API
-   **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
-   **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
-   **[Vite](https://vitejs.dev/)** - Fast build tool

## Project Structure

```
smart-clippy-new/
├── src/
│   ├── entrypoints/          # Extension entry points
│   │   ├── background.ts     # Background script (keyboard commands)
│   │   ├── content.ts        # Content script (copy logic)
│   │   ├── popup/            # Popup UI
│   │   └── options/          # Options page
│   ├── lib/
│   │   ├── components/       # Reusable Svelte components
│   │   ├── types/            # TypeScript type definitions
│   │   ├── utils/            # Utility functions
│   │   ├── constants.ts      # Application constants
│   │   └── storage.ts        # Browser storage wrapper
│   └── public/
│       └── icons/            # Extension icons
├── wxt.config.ts             # WXT configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## Browser Support

-   Chrome/Chromium: Version 88+
-   Firefox: Version 109+
-   Edge: Version 88+

## License

MIT License - see [LICENSE](LICENSE) file for details

## Author

**Guido Dinello**

-   GitHub: [@guidodinello](https://github.com/guidodinello)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Changelog

### Version 2.0.0

-   Complete rewrite using modern stack (WXT, Svelte 5, TypeScript, Tailwind CSS 4)
-   Improved UI with Svelte components
-   Enhanced type safety with TypeScript
-   Better cross-browser support
-   Modernized build system

### Version 1.0.0

-   Initial release with basic clipboard functionality

/* eslint-disable no-undef, @typescript-eslint/no-explicit-any */

// Mock browser API for tests
global.browser = {
    storage: {
        sync: {
            get: vi.fn(),
            set: vi.fn(),
        },
    },
} as any;

vi.stubGlobal("navigator", {
    clipboard: {
        writeText: vi.fn(),
    },
});

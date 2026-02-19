import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import * as theme from './theme.ts';

/**
 * Mocking the browser environment for testing
 */
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; }
  };
})();

const mockDocument = {
  documentElement: {
    classList: {
      classes: new Set<string>(),
      add(cls: string) { this.classes.add(cls); },
      remove(cls: string) { this.classes.delete(cls); },
      contains(cls: string) { return this.classes.has(cls); },
      toggle(cls: string) {
        if (this.contains(cls)) {
          this.remove(cls);
          return false;
        } else {
          this.add(cls);
          return true;
        }
      }
    }
  },
  getElementById: (id: string) => null as any,
  addEventListener: (event: string, cb: any) => {},
};

const mockWindow = {
  matchMedia: (query: string) => ({
    matches: false,
  })
};

// Setup global mocks
Object.defineProperty(global, 'localStorage', { value: mockLocalStorage });
Object.defineProperty(global, 'document', { value: mockDocument });
Object.defineProperty(global, 'window', { value: mockWindow });

describe('Theme Utility', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    mockDocument.documentElement.classList.classes.clear();
    // Default to light mode preference
    mockWindow.matchMedia = (query: string) => ({ matches: false } as any);
  });

  test('getTheme returns light by default', () => {
    assert.strictEqual(theme.getTheme(), 'light');
  });

  test('getTheme respects localStorage dark', () => {
    mockLocalStorage.setItem('theme', 'dark');
    assert.strictEqual(theme.getTheme(), 'dark');
  });

  test('getTheme respects localStorage light', () => {
    mockLocalStorage.setItem('theme', 'light');
    assert.strictEqual(theme.getTheme(), 'light');
  });

  test('getTheme respects system preference if no localStorage', () => {
    mockWindow.matchMedia = (query: string) => ({
      matches: query.includes('dark'),
    } as any);
    assert.strictEqual(theme.getTheme(), 'dark');
  });

  test('applyTheme adds dark class', () => {
    theme.applyTheme('dark');
    assert.strictEqual(mockDocument.documentElement.classList.contains('dark'), true);
  });

  test('applyTheme removes dark class', () => {
    mockDocument.documentElement.classList.add('dark');
    theme.applyTheme('light');
    assert.strictEqual(mockDocument.documentElement.classList.contains('dark'), false);
  });

  test('initTheme applies theme from localStorage correctly', () => {
    mockLocalStorage.setItem('theme', 'dark');
    theme.initTheme();
    assert.strictEqual(mockDocument.documentElement.classList.contains('dark'), true);
  });

  test('setupThemeToggle handles button interactions', () => {
    let clickHandler: () => void = () => {};
    let ariaChecked = '';

    const mockButton = {
      setAttribute: (name: string, value: string) => {
        if (name === 'aria-checked') ariaChecked = value;
      },
      addEventListener: (event: string, cb: () => void) => {
        if (event === 'click') clickHandler = cb;
      }
    };

    mockDocument.getElementById = (id: string) => {
      if (id === 'themeToggle') return mockButton as any;
      return null;
    };

    // Initially light mode
    mockDocument.documentElement.classList.remove('dark');

    theme.setupThemeToggle();
    assert.strictEqual(ariaChecked, 'false');

    // Simulate click
    clickHandler();
    assert.strictEqual(mockDocument.documentElement.classList.contains('dark'), true);
    assert.strictEqual(ariaChecked, 'true');
    assert.strictEqual(mockLocalStorage.getItem('theme'), 'dark');

    // Simulate second click
    clickHandler();
    assert.strictEqual(mockDocument.documentElement.classList.contains('dark'), false);
    assert.strictEqual(ariaChecked, 'false');
    assert.strictEqual(mockLocalStorage.getItem('theme'), 'light');
  });

  test('setupThemeToggle handles localStorage errors', () => {
    let clickHandler: () => void = () => {};
    let ariaChecked = '';

    const mockButton = {
      setAttribute: (name: string, value: string) => {
        if (name === 'aria-checked') ariaChecked = value;
      },
      addEventListener: (event: string, cb: () => void) => {
        if (event === 'click') clickHandler = cb;
      }
    };

    mockDocument.getElementById = (id: string) => {
      if (id === 'themeToggle') return mockButton as any;
      return null;
    };

    // Override setItem to throw
    const originalSetItem = mockLocalStorage.setItem;
    mockLocalStorage.setItem = () => {
      throw new Error('Quota exceeded');
    };

    try {
      // Initially light mode
      mockDocument.documentElement.classList.remove('dark');

      theme.setupThemeToggle();

      // Simulate click
      clickHandler();

      // Theme should still be applied visually
      assert.strictEqual(mockDocument.documentElement.classList.contains('dark'), true);
      assert.strictEqual(ariaChecked, 'true');
    } finally {
      // Restore setItem
      mockLocalStorage.setItem = originalSetItem;
    }
  });
});

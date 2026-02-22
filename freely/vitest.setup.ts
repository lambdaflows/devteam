/**
 * Vitest global setup — provide a full in-memory localStorage mock.
 *
 * jsdom's built-in localStorage sometimes lacks `.clear()` (e.g. when the
 * `--localstorage-file` flag is set without a path). This setup replaces it
 * with a simple in-memory implementation that supports all methods.
 */

const store: Record<string, string> = {};

const localStorageMock: Storage = {
  get length() {
    return Object.keys(store).length;
  },
  getItem(key: string): string | null {
    return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
  },
  setItem(key: string, value: string): void {
    store[key] = String(value);
  },
  removeItem(key: string): void {
    delete store[key];
  },
  clear(): void {
    for (const k of Object.keys(store)) {
      delete store[k];
    }
  },
  key(index: number): string | null {
    return Object.keys(store)[index] ?? null;
  },
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

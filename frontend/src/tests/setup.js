import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockImplementation(() => Promise.resolve()),
  },
});

// Mock window.open
window.open = vi.fn(() => ({
  document: {
    title: '',
    body: { innerHTML: '' },
  },
  location: { href: '' },
  close: vi.fn(),
  closed: false,
}));


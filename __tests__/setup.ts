import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// Mock global do cliente Supabase
vi.mock('../lib/supabase', () => {
  const mockChain: any = {};
  mockChain.select = vi.fn(() => mockChain);
  mockChain.insert = vi.fn(() => mockChain);
  mockChain.update = vi.fn(() => mockChain);
  mockChain.delete = vi.fn(() => mockChain);
  mockChain.eq = vi.fn(() => mockChain);
  mockChain.neq = vi.fn(() => mockChain);
  mockChain.order = vi.fn(() => mockChain);
  mockChain.limit = vi.fn(() => mockChain);
  mockChain.single = vi.fn().mockResolvedValue({ data: null, error: null });
  
  return {
    supabase: {
      from: vi.fn(() => mockChain),
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
        signInWithPassword: vi.fn().mockResolvedValue({ data: null, error: null }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
      },
      functions: {
        invoke: vi.fn().mockResolvedValue({ data: { result: 'General' }, error: null }),
      },
      channel: vi.fn(() => ({
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockReturnThis(),
      })),
      removeChannel: vi.fn(),
    },
  };
});

// Mock de react-router-dom para testes
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
  };
});

// Limpar mocks entre testes
beforeEach(() => { vi.clearAllMocks(); });

// Mock de window.matchMedia (jsdom não suporta)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock de IntersectionObserver (jsdom não suporta)
global.IntersectionObserver = class IntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
} as any;

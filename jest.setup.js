// Polyfill for TextEncoder/TextDecoder (required by Prisma)
const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: "/",
      query: {},
      asPath: "/",
    };
  },
  usePathname() {
    return "/";
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock Next.js server components
jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: (data, init) => ({
      status: init?.status || 200,
      headers: new Map([["content-type", "application/json"]]),
      json: async () => data,
    }),
  },
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock("framer-motion", () => {
  const React = require("react");
  return {
    motion: new Proxy(
      {},
      {
        get: (_, prop) => {
          return React.forwardRef(({ children, ...props }, ref) =>
            React.createElement(prop, { ...props, ref }, children),
          );
        },
      },
    ),
    AnimatePresence: ({ children }) => children,
  };
});

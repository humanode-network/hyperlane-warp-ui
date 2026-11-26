// Settings given at deploy time, not at build time. In the image, the server
// renders /config.js from its environment, and the document loads it before
// the app's scripts, so window.__APP_CONFIG__ holds them by the time any module
// reads one. In development public/config.js sets none, and each setting falls
// back to its build-time process.env value: `pnpm dev` with a .env works as
// before.

declare global {
  interface Window {
    __APP_CONFIG__?: Record<string, string | undefined>;
  }
}

// The deploy-time value of the setting `name`, or undefined where none is set
// (on the server, in development, or left empty by the deployment).
export function deployTimeSetting(name: string): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const value = window.__APP_CONFIG__?.[name];
  return value === undefined || value === '' ? undefined : value;
}

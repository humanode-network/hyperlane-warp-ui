/** @type {import('next').NextConfig} */

const { version } = require('./package.json');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// The app is a static export: the security headers, the content security
// policy among them, are the server's, set in the image's Caddyfile, not here,
// since a static export serves no headers of its own.

const nextConfig = {
  // A static site in out/, served by the image's Caddy: no server, no API routes, no proxy.
  output: 'export',
  // No server to optimize images at request time.
  images: { unoptimized: true },
  // Disable the dev-tools indicator/portal in dev when running under the
  // e2e harness — its <nextjs-portal> shadow DOM intermittently intercepts
  // pointer events during picker clicks (observed flake on
  // `token-select-destination` in full-suite runs). Scope to an explicit
  // env var so local dev UX is unchanged.
  ...(process.env.DISABLE_NEXT_DEV_INDICATORS === '1' ? { devIndicators: false } : {}),
  turbopack: {
    root: __dirname,
    rules: {
      '*.yaml': {
        loaders: ['yaml-loader'],
        as: '*.js',
      },
      '*.yml': {
        loaders: ['yaml-loader'],
        as: '*.js',
      },
    },
    resolveAlias: {
      // Only shim pino on SSR (Node) where its transport/worker resolution breaks
      // under Turbopack. In the browser use the real pino browser build, which
      // exports `levels` that @walletconnect/logger depends on.
      pino: {
        browser: 'pino/browser.js',
        default: './src/utils/pino-noop.js',
      },
    },
  },

  env: {
    NEXT_PUBLIC_VERSION: version,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
  },

  reactStrictMode: true,

  serverExternalPackages: ['@sentry/nextjs'],

  // Exclude heavy client-only chain SDKs from serverless function file tracing.
  // These packages are only used client-side and not needed in serverless functions.
  // Note: @sentry and @opentelemetry are kept for server-side instrumentation (see instrumentation.ts).
  outputFileTracingExcludes: {
    '*': [
      './node_modules/@provablehq/**',
      './node_modules/@radixdlt/**',
      './node_modules/@solana/**',
      './node_modules/@cosmjs/**',
      './node_modules/@starknet-io/**',
      './node_modules/ethers/**',
    ],
  },

  experimental: {
    turbopackFileSystemCacheForBuild: true,
    parallelServerCompiles: true,
    parallelServerBuildTraces: true,
    optimizePackageImports: [
      '@humanode-hyperlane/registry',
      '@humanode-hyperlane/sdk',
      '@humanode-hyperlane/utils',
      '@humanode-hyperlane/widgets',
    ],
  },

  // Skip type checking during builds — CI runs these separately
  typescript: { ignoreBuildErrors: true },
};

module.exports = withBundleAnalyzer(nextConfig);

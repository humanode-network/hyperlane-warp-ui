import * as Sentry from '@sentry/nextjs';

import { sentryDefaultConfig } from './sentry.default.config';

// The DSN is a deploy-time setting (src/consts/deployTimeSettings.ts), with the build-time one
// as fallback for development.
const sentryDsn =
  (typeof window !== 'undefined' && window.__APP_CONFIG__?.NEXT_PUBLIC_SENTRY_DSN) ||
  process.env.NEXT_PUBLIC_SENTRY_DSN;

if (typeof window !== 'undefined' && sentryDsn) {
  Sentry.init({
    ...sentryDefaultConfig,
    dsn: sentryDsn,
    integrations: [
      Sentry.breadcrumbsIntegration({
        console: false,
        dom: false,
        fetch: false,
        history: false,
        sentry: false,
        xhr: false,
      }),
      Sentry.dedupeIntegration(),
      Sentry.functionToStringIntegration(),
      Sentry.globalHandlersIntegration(),
      Sentry.httpContextIntegration(),
    ],
  });
}

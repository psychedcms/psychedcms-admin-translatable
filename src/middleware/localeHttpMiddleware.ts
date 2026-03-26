import type { HttpMiddleware } from '@psychedcms/admin-core';

import { getCurrentEditLocale } from '../providers/EditLocaleContext.tsx';

/**
 * HTTP middleware that injects the Accept-Language header
 * based on the current content editing locale.
 */
export const localeHttpMiddleware: HttpMiddleware = (fetchFn) => (url, options = {}) => {
  const locale = getCurrentEditLocale();
  const headers = new Headers(options.headers as HeadersInit | undefined);
  headers.set('Accept-Language', locale);

  return fetchFn(url, { ...options, headers });
};

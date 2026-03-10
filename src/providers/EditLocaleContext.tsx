import { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

import { useLocaleSettings } from '@psychedcms/admin-core';

interface EditLocaleContextValue {
  locale: string;
  setLocale: (locale: string) => void;
}

const EditLocaleContext = createContext<EditLocaleContextValue>({
  locale: 'en',
  setLocale: () => {},
});

/**
 * Module-level ref so the httpClient wrapper can read the current locale
 * without needing React context access.
 */
let currentEditLocale = 'en';

export function getCurrentEditLocale(): string {
  return currentEditLocale;
}

/**
 * Provides the content editing locale.
 * Self-initializes to the app's default locale from shared locale settings.
 * Completely independent from the UI language (topbar toggle).
 */
export function EditLocaleProvider({ children }: { children: ReactNode }) {
  const { defaultLocale, loading } = useLocaleSettings();
  const initializedRef = useRef(false);

  const [locale, setLocaleState] = useState(() => {
    // On first render, use whatever the shared settings have
    // (may be 'en' if still loading, will be synced by useEffect)
    currentEditLocale = defaultLocale;
    return defaultLocale;
  });

  // Sync when defaultLocale resolves from API (only once)
  useEffect(() => {
    if (!loading && !initializedRef.current) {
      initializedRef.current = true;
      currentEditLocale = defaultLocale;
      setLocaleState(defaultLocale);
    }
  }, [defaultLocale, loading]);

  const setLocale = useCallback((newLocale: string) => {
    currentEditLocale = newLocale;
    setLocaleState(newLocale);
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return (
    <EditLocaleContext.Provider value={value}>
      {children}
    </EditLocaleContext.Provider>
  );
}

export function useEditLocale() {
  return useContext(EditLocaleContext);
}

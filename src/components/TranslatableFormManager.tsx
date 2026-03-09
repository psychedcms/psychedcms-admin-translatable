import { useEffect } from 'react';
import type { MutableRefObject } from 'react';

import { useTranslatableForm } from '../hooks/useTranslatableForm.ts';

export interface TranslatableSaveHandle {
  getAllLocaleContents: () => Record<string, Record<string, unknown>>;
  translatableFields: string[];
  locales: string[];
  defaultLocale: string;
}

interface TranslatableFormManagerProps {
  resource?: string;
  saveHandleRef?: unknown;
}

/**
 * Renderless component that manages per-locale translatable form state.
 * Must be rendered inside a <SimpleForm> (needs react-hook-form context).
 *
 * Exposes save handle via ref so the parent (PsychedEditGuesser) can
 * access getAllLocaleContents() for multi-locale save.
 */
export function TranslatableFormManager({ resource, saveHandleRef }: TranslatableFormManagerProps) {
  const handle = useTranslatableForm(resource ?? '');
  const ref = saveHandleRef as MutableRefObject<TranslatableSaveHandle | null> | undefined;

  useEffect(() => {
    if (ref) {
      ref.current = handle;
    }
  }, [handle, ref]);

  return null;
}

import { useEffect } from 'react';
import type { MutableRefObject } from 'react';

import { useTranslatableForm } from '../hooks/useTranslatableForm.ts';
import type { TranslationValidationError } from '../validation/validateTranslationTitle.ts';
import { setTranslationValidator } from '../validation/useTranslationSaveValidation.ts';

export interface TranslatableSaveHandle {
  getAllLocaleContents: () => Record<string, Record<string, unknown>>;
  translatableFields: string[];
  locales: string[];
  defaultLocale: string;
  validateTranslations: () => TranslationValidationError[];
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
 *
 * Registers the validation function in a module-level store so the
 * translation title save hook can call it at save time.
 */
export function TranslatableFormManager({ resource, saveHandleRef }: TranslatableFormManagerProps) {
  const handle = useTranslatableForm(resource ?? '');
  const ref = saveHandleRef as MutableRefObject<TranslatableSaveHandle | null> | undefined;

  useEffect(() => {
    if (ref) {
      ref.current = handle;
    }
  }, [handle, ref]);

  // Register the validation function in the module-level store
  // so the save hook can invoke it before save.
  useEffect(() => {
    setTranslationValidator(handle.validateTranslations);
    return () => {
      setTranslationValidator(null);
    };
  }, [handle.validateTranslations]);

  return null;
}

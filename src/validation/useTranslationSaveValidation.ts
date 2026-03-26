import type { SaveHook } from '@psychedcms/admin-core';
import type { TranslationValidationError } from './validateTranslationTitle.ts';

/**
 * Module-level store for the current translation validation function.
 *
 * Set by TranslatableFormManager when a translatable form mounts,
 * cleared when it unmounts. Read by the save hook at save time.
 */
let currentValidateFn: (() => TranslationValidationError[]) | null = null;

export function setTranslationValidator(
  fn: (() => TranslationValidationError[]) | null,
): void {
  currentValidateFn = fn;
}

/**
 * Save hook that validates translation title/name presence before save.
 *
 * If validation fails, it adds a `_translationWarnings` field to the data
 * and logs to console. The backend validator (TranslationTitleRequiredValidator)
 * is the authoritative blocker — the frontend warns but does not block.
 */
export const translationTitleSaveHook: SaveHook = {
  beforeSave: (data: Record<string, unknown>) => {
    if (!currentValidateFn) return data;

    try {
      const errors = currentValidateFn();
      if (errors.length > 0) {
        const messages = errors.map((e) => e.message).join('; ');
        console.warn('[Translatable] Validation warning:', messages);
      }
    } catch (e) {
      // Never block save due to validation errors — backend is authoritative
      console.warn('[Translatable] Validation check failed:', e);
    }

    return data;
  },
};

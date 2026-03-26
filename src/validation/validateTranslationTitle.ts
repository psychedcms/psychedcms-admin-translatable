export interface TranslationValidationError {
  locale: string;
  message: string;
}

/** Fields that do not count as "content" for the purpose of requiring a title/name. */
const EXCLUDED_FIELDS = new Set(['title', 'name', 'slug']);

/**
 * Check whether a value is non-empty.
 * Handles null, undefined, empty/whitespace strings, and empty rich-text (`<p></p>`).
 */
function hasContent(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return false;
    if (trimmed === '<p></p>') return false;
    return true;
  }
  return true;
}

/**
 * For each non-default locale, if ANY translatable field (excluding title, name, slug)
 * has content that DIFFERS from the default locale, then `title` or `name` must also
 * have content in that locale (or in the default locale as fallback).
 *
 * Returns an array of validation errors (empty = valid).
 */
export function validateTranslationTitle(
  localeContents: Record<string, Record<string, unknown>>,
  translatableFields: string[],
  defaultLocale: string,
): TranslationValidationError[] {
  const errors: TranslationValidationError[] = [];
  const defaultFields = localeContents[defaultLocale] ?? {};

  for (const [locale, fields] of Object.entries(localeContents)) {
    if (locale === defaultLocale) continue;

    const hasAnyContent = translatableFields.some(
      (field) => !EXCLUDED_FIELDS.has(field) && hasContent(fields[field]),
    );

    if (!hasAnyContent) continue;

    // Title/name in this locale, OR fallback from default locale
    const hasTitleOrName =
      hasContent(fields['title']) || hasContent(fields['name']) ||
      hasContent(defaultFields['title']) || hasContent(defaultFields['name']);

    if (!hasTitleOrName) {
      errors.push({
        locale,
        message: `Title (or name) is required in "${locale}" when other fields have content.`,
      });
    }
  }

  return errors;
}

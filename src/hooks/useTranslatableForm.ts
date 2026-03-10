import { useEffect, useRef, useMemo, useCallback } from 'react';
import { useRecordContext } from 'react-admin';
import { useFormContext } from 'react-hook-form';

import { useEditLocale } from '../providers/EditLocaleContext.tsx';
import { usePsychedSchema } from './usePsychedSchema.ts';
import { useLocaleSettings } from '@psychedcms/admin-core';

const entrypoint = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Hook that manages per-locale translatable field values inside a react-hook-form.
 *
 * - On mount: stores current locale values from the record, fetches other locales
 * - On locale switch: saves current form values to store, loads new locale's values
 * - Provides `getAllLocaleContents()` for multi-locale save
 *
 * Must be called inside a <SimpleForm> (needs useFormContext).
 */
export function useTranslatableForm(resource: string) {
  const record = useRecordContext();
  const { locale } = useEditLocale();
  const resourceSchema = usePsychedSchema(resource);
  const form = useFormContext();

  // Per-locale store: { en: { title: '...', content: '...' }, fr: { ... } }
  const localeContents = useRef<Record<string, Record<string, unknown>>>({});
  const prevLocale = useRef<string | null>(null);
  const recordId = useRef<string | number | null>(null);
  // Capture the locale at initialization time to avoid race conditions
  // with useLocaleSettings loading (which starts as 'en' before API resolves).
  const initLocale = useRef<string | null>(null);

  const translatableFields = useMemo(() => {
    if (!resourceSchema) return [];
    return Array.from(resourceSchema.fields.entries())
      .filter(([, meta]) => meta.translatable)
      .map(([name]) => name);
  }, [resourceSchema]);

  const localeSettings = useLocaleSettings();
  const locales = resourceSchema?.contentType?.locales ?? [];
  const defaultLocale = localeSettings.defaultLocale;

  // Initialize: store current locale values from the record, fetch others in background.
  // Uses `locale` from EditLocaleContext (stable from mount) rather than `defaultLocale`
  // from useLocaleSettings (which transitions from 'en' → actual default during load).
  useEffect(() => {
    if (!record || !record.id || translatableFields.length === 0) return;

    // Reset store if we're looking at a different record
    if (recordId.current !== record.id) {
      localeContents.current = {};
      recordId.current = record.id;
      prevLocale.current = null;
      initLocale.current = null;
    }

    // Already initialized for this record
    if (initLocale.current !== null) return;

    // The record was fetched in the current edit locale (via localeHttpClient).
    // Store its translatable field values under that locale key.
    initLocale.current = locale;
    const recordValues: Record<string, unknown> = {};
    for (const field of translatableFields) {
      recordValues[field] = record[field] ?? '';
    }
    localeContents.current[locale] = recordValues;
    prevLocale.current = locale;

    // Fetch other locales in background (no fallback — empty if untranslated)
    const iri = record['@id'] as string | undefined;
    const origin = new URL(entrypoint).origin;
    const url = iri ? `${origin}${iri}` : `${entrypoint}/${resource}/${record.id}`;

    for (const loc of locales) {
      if (loc === locale) continue;

      fetch(url, {
        headers: {
          'Accept': 'application/ld+json',
          'Accept-Language': loc,
          'X-No-Translation-Fallback': '1',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const values: Record<string, unknown> = {};
          for (const field of translatableFields) {
            values[field] = data[field] ?? '';
          }
          localeContents.current[loc] = values;
        })
        .catch(() => {
          const values: Record<string, unknown> = {};
          for (const field of translatableFields) {
            values[field] = '';
          }
          localeContents.current[loc] = values;
        });
    }
  }, [record, translatableFields, locales, locale, resource]);

  // On locale switch: save current values → load target locale values
  useEffect(() => {
    if (!form || translatableFields.length === 0) return;
    if (prevLocale.current === null) {
      prevLocale.current = locale;
      return;
    }
    if (prevLocale.current === locale) return;

    // Save current form values for the previous locale
    const currentValues: Record<string, unknown> = {};
    for (const field of translatableFields) {
      currentValues[field] = form.getValues(field);
    }
    localeContents.current[prevLocale.current] = currentValues;

    // Load target locale's values into the form
    const targetValues = localeContents.current[locale] ?? {};
    for (const field of translatableFields) {
      form.setValue(field, targetValues[field] ?? '', {
        shouldDirty: false,
        shouldValidate: false,
      });
    }

    prevLocale.current = locale;
  }, [locale, translatableFields, form]);

  // Collect all locale contents (call before saving)
  const getAllLocaleContents = useCallback((): Record<string, Record<string, unknown>> => {
    // Flush current form values into the store
    if (prevLocale.current && form) {
      const currentValues: Record<string, unknown> = {};
      for (const field of translatableFields) {
        currentValues[field] = form.getValues(field);
      }
      localeContents.current[prevLocale.current] = currentValues;
    }
    return { ...localeContents.current };
  }, [form, translatableFields]);

  return {
    translatableFields,
    locales,
    defaultLocale,
    getAllLocaleContents,
  };
}

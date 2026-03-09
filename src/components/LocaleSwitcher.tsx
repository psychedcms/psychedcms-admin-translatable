import { Box, Card, CardContent, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import { useResourceContext, useTranslate } from 'react-admin';

import { useEditLocale } from '../providers/EditLocaleContext.tsx';
import { useLocaleSettings } from '../hooks/useLocaleSettings.ts';
import { usePsychedSchema } from '../hooks/usePsychedSchema.ts';

/**
 * Locale switcher for the edit sidebar.
 * Shows available locales from the content type schema, ordered with
 * the default language first. Only renders when the content type has
 * translatable fields and multiple locales.
 */
export function LocaleSwitcher() {
  const translate = useTranslate();
  const resourceFromContext = useResourceContext();
  const resourceSchema = usePsychedSchema(resourceFromContext ?? '');
  const { locale, setLocale } = useEditLocale();
  const { defaultLocale } = useLocaleSettings();

  const locales = resourceSchema?.contentType?.locales;
  if (!locales || locales.length <= 1) {
    return null;
  }

  // Only show if the resource has translatable fields
  const hasTranslatableFields = Array.from(resourceSchema.fields.values()).some(
    (field) => field.translatable,
  );
  if (!hasTranslatableFields) {
    return null;
  }

  // Order: default locale first, then the rest
  const orderedLocales = [
    defaultLocale,
    ...locales.filter((l) => l !== defaultLocale),
  ].filter((l) => locales.includes(l));

  const handleLocaleChange = (_: React.MouseEvent<HTMLElement>, newLocale: string | null) => {
    if (newLocale && newLocale !== locale) {
      setLocale(newLocale);
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <TranslateIcon fontSize="small" />
          <Typography variant="subtitle2" fontWeight="bold">
            {translate('psyched.sidebar.language', { _: 'Language' })}
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={locale}
          exclusive
          onChange={handleLocaleChange}
          size="small"
          fullWidth
        >
          {orderedLocales.map((loc) => (
            <ToggleButton key={loc} value={loc} sx={{ textTransform: 'uppercase' }}>
              {loc}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </CardContent>
    </Card>
  );
}

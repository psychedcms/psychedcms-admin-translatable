import { useLocaleState } from 'react-admin';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import { useLocaleSettings } from '../hooks/useLocaleSettings.ts';

/**
 * Language toggle for the app bar.
 * Only switches the react-admin UI language (labels, buttons, etc.).
 * Completely independent from the content editing locale.
 * Ordered with default language first.
 */
export function LocaleToggle() {
  const [raLocale, setRaLocale] = useLocaleState();
  const { defaultLocale, supportedLocales } = useLocaleSettings();

  // Default locale first, then the rest
  const orderedLocales = [
    defaultLocale,
    ...supportedLocales.filter((l) => l !== defaultLocale),
  ];

  const handleChange = (_: React.MouseEvent<HTMLElement>, newLocale: string | null) => {
    if (newLocale && newLocale !== raLocale) {
      setRaLocale(newLocale);
    }
  };

  return (
    <ToggleButtonGroup
      value={raLocale}
      exclusive
      onChange={handleChange}
      size="small"
      sx={{
        mr: 1,
        '& .MuiToggleButton-root': {
          color: 'inherit',
          borderColor: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          py: 0.25,
          px: 1,
          '&.Mui-selected': {
            bgcolor: 'rgba(255,255,255,0.15)',
            color: 'inherit',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
          },
        },
      }}
    >
      {orderedLocales.map((loc) => (
        <ToggleButton key={loc} value={loc}>
          {loc}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

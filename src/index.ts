import { registerPlugin } from '@psychedcms/admin-core';

import { LocaleSwitcher } from './components/LocaleSwitcher.tsx';
import { TranslatableFormManager } from './components/TranslatableFormManager.tsx';
import { LocaleToggle } from './components/LocaleToggle.tsx';
import { EditLocaleProvider } from './providers/EditLocaleContext.tsx';
import { localeHttpMiddleware } from './middleware/localeHttpMiddleware.ts';
import { GlobalSettings } from './settings/GlobalSettings.tsx';
import { PreferencesSettings } from './settings/PreferencesSettings.tsx';

import PublicIcon from '@mui/icons-material/Public';
import TuneIcon from '@mui/icons-material/Tune';

registerPlugin({
  sidebarWidgets: [{ component: LocaleSwitcher }],
  formHooks: [{ component: TranslatableFormManager }],
  appWrappers: [{ component: EditLocaleProvider }],
  appBarItems: [{ component: LocaleToggle }],
  httpMiddleware: [localeHttpMiddleware],
  settingsPages: [
    {
      path: 'global',
      component: GlobalSettings,
      menuLabel: 'Global',
      menuIcon: PublicIcon,
      menuSection: 'global',
    },
    {
      path: 'preferences',
      component: PreferencesSettings,
      menuLabel: 'Preferences',
      menuIcon: TuneIcon,
      menuSection: 'global',
    },
  ],
});

export { EditLocaleProvider, useEditLocale, getCurrentEditLocale } from './providers/EditLocaleContext.tsx';
export { LocaleSwitcher } from './components/LocaleSwitcher.tsx';
export { TranslatableFormManager } from './components/TranslatableFormManager.tsx';
export type { TranslatableSaveHandle } from './components/TranslatableFormManager.tsx';
export { LocaleToggle } from './components/LocaleToggle.tsx';
export { useTranslatableForm } from './hooks/useTranslatableForm.ts';
export { useLocaleSettings } from './hooks/useLocaleSettings.ts';

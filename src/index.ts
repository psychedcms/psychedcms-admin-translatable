import { registerPlugin } from '@psychedcms/admin-core';

import { LocaleSwitcher } from './components/LocaleSwitcher.tsx';
import { TranslatableFormManager } from './components/TranslatableFormManager.tsx';
import { LocaleToggle } from './components/LocaleToggle.tsx';
import { EditLocaleProvider } from './providers/EditLocaleContext.tsx';
import { localeHttpMiddleware } from './middleware/localeHttpMiddleware.ts';
import { GlobalSettings } from './settings/GlobalSettings.tsx';
import { translationTitleSaveHook } from './validation/useTranslationSaveValidation.ts';
import { enMessages } from './i18n/en.ts';
import { frMessages } from './i18n/fr.ts';

import SettingsIcon from '@mui/icons-material/Settings';

registerPlugin({
  sidebarWidgets: [{ component: LocaleSwitcher }],
  formHooks: [{ component: TranslatableFormManager }],
  appWrappers: [{ component: EditLocaleProvider }],
  appBarItems: [{ component: LocaleToggle }],
  httpMiddleware: [localeHttpMiddleware],
  saveHooks: [translationTitleSaveHook],
  adminPages: [
    {
      path: 'global-settings',
      component: GlobalSettings,
      menuLabel: 'psyched.menu.global_settings',
      menuIcon: SettingsIcon,
    },
  ],
  i18nMessages: { en: enMessages, fr: frMessages },
});

export { EditLocaleProvider, useEditLocale, getCurrentEditLocale } from './providers/EditLocaleContext.tsx';
export { LocaleSwitcher } from './components/LocaleSwitcher.tsx';
export { TranslatableFormManager } from './components/TranslatableFormManager.tsx';
export type { TranslatableSaveHandle } from './components/TranslatableFormManager.tsx';
export { LocaleToggle } from './components/LocaleToggle.tsx';
export { useTranslatableForm } from './hooks/useTranslatableForm.ts';
export { useLocaleSettings } from '@psychedcms/admin-core';

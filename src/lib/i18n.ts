import { addMessages, getLocaleFromNavigator, init } from 'svelte-i18n';

import en from '../en.yml';
import zh from '../zh.yml';

addMessages('en', en);
addMessages('zh', zh);

init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromNavigator()
});

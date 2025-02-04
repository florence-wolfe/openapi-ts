// eslint-disable-next-line simple-import-sort/imports
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';

// custom CSS must be imported after default theme to correctly apply styles
import './custom.css';

import Layout from './Layout.vue';

export default {
  Layout,
  extends: DefaultTheme,
} satisfies Theme;

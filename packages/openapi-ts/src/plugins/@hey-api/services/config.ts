import type { PluginConfig } from './types';

export const defaultConfig: Required<PluginConfig> = {
  handler: () => {},
  handlerLegacy: () => {},
  name: '@hey-api/services',
  output: 'services',
};

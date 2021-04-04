// .eslintrc.js
module.exports = {
  extends: [
    'react-app',
    'react-app/jest',

    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  env: {
    jest: true,
  },
  globals: {
    page: true,
    browser: true,
    context: true,
    jestPuppeteer: true,
    Node: 'off',
    Selection: 'off',
    Plugin: 'off',
    Image: 'off',
  },
  rules: {
    'curly': 'error',
    'no-process-env': 'error',
    'import/no-cycle': [
      2,
      // eslint-disable-next-line no-process-env
      { maxDepth: 2 },
    ],
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '(useKeybindings|useMyOtherCustomHook)',
      },
    ],
  },
  settings: {
    jest: {
      version: '26',
    },
    react: {
      version: '16',
    },
  },
};

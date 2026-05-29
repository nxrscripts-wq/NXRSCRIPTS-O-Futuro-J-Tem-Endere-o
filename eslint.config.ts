import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import a11yPlugin from 'eslint-plugin-jsx-a11y';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  // Base JS recommended
  js.configs.recommended,

  // TypeScript recommended
  ...tseslint.configs.recommended,

  // Prettier (desactiva regras que conflituam com formatação)
  prettierConfig,

  // Configuração principal
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': a11yPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // React
      'react/react-in-jsx-scope': 'off', // React 17+ — não precisa de import
      'react/prop-types': 'off', // TypeScript trata de tipos
      'react/display-name': 'warn',
      'react/self-closing-comp': 'warn', //  em vez de

      // React Hooks
      'react-hooks/rules-of-hooks': 'error', // hooks só dentro de componentes
      'react-hooks/exhaustive-deps': 'warn', // deps correctas nos useEffect

      // TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Acessibilidade
      'jsx-a11y/alt-text': 'error', // todas as  precisam de alt
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/interactive-supports-focus': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',

      // Qualidade geral
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
      'no-duplicate-imports': 'error',
    },
  },

  // Ignorar ficheiros desnecessários
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '*.config.js',
      'supabase/functions/**', // Deno usa sintaxe diferente
      'public/**',
      '__tests__/**', // Desativado strict checking nos testes para não poluir
    ],
  }
);

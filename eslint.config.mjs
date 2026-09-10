import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'reports/**',
      'public/**',
      'dist/**',
      'build/**',
      'tests/**',
      'scripts/**',
      '*.mjs',
      '*.config.mjs',
      '*.config.mts',
      'next-env.d.ts',
    ],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  }
)

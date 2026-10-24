// @ts-check
/**
 * Reglas de calidad del proyecto. Muchas convenciones de AGENTS.md se comprueban aquí
 * automáticamente para que no dependan de acordarse de ellas.
 */
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig([
  {
    ignores: ['dist/**', '.angular/**', 'src/app/core/supabase/interfaces/database.types.ts'],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.strict,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'pits', style: 'kebab-case' },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'pits', style: 'camelCase' },
      ],
      // Cada lenguaje en su fichero: nada de HTML ni CSS dentro del TypeScript.
      '@angular-eslint/component-max-inline-declarations': [
        'error',
        { template: 0, styles: 0, animations: 0 },
      ],
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@angular-eslint/prefer-signals': 'error',
      '@angular-eslint/prefer-standalone': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      // Los componentes de Angular sin lógica son clases vacías con decorador.
      '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      // Las interfaces y tipos viven en ficheros propios dentro de `interfaces/`, no junto a la
      // lógica (AGENTS.md). ESLint no puede saber en qué carpeta está el fichero con esta regla,
      // así que se limita a impedir que un fichero de lógica exporte varios tipos.
      // Ficheros pequeños y con una sola responsabilidad.
      'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
      'no-console': ['error', { allow: ['error', 'warn'] }],
    },
  },
  {
    // Las interfaces y tipos solo se declaran en ficheros `.interface.ts` y `.type.ts`.
    files: ['**/*.ts'],
    ignores: ['**/*.interface.ts', '**/*.type.ts', '**/*.spec.ts', '**/database.types.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSInterfaceDeclaration',
          message: 'Declara la interfaz en un fichero propio `interfaces/<nombre>.interface.ts`.',
        },
        {
          selector: 'TSTypeAliasDeclaration',
          message: 'Declara el tipo en un fichero propio `interfaces/<nombre>.type.ts`.',
        },
      ],
    },
  },
  {
    // Las páginas, componentes y utilidades no hablan con Supabase: solo la capa de datos.
    files: ['src/app/features/**/*.ts', 'src/app/shared/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@supabase/supabase-js',
              message: 'Accede a los datos a través de un servicio de src/app/data-access.',
            },
          ],
          patterns: [
            {
              group: ['@core/supabase/*'],
              message: 'Accede a los datos a través de un servicio de src/app/data-access.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      'max-lines': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/prefer-self-closing-tags': 'error',
      '@angular-eslint/template/no-inline-styles': [
        'error',
        { allowNgStyle: false, allowBindToStyle: true },
      ],
    },
  },
]);

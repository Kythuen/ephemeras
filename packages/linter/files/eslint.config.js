import eslint from '@eslint/js'
import tsEslint from 'typescript-eslint'{% if framework === 'vue' %}
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'{% endif %}
import prettier from 'eslint-plugin-prettier/recommended'
import globals from 'globals'

export default tsEslint.config([
  {
    // 通过检查 dependencies 判断是否加入
    ignores: ['**/dist', 'docs/.vitepress/cache/', '.changeset/']
  },
  eslint.configs.recommended,
  tsEslint.configs.recommended,{% if framework === 'vue' %}
  vue.configs['flat/recommended'],{% endif %}
  {
    languageOptions: {
      globals: {
        ...globals.es2021,{% if 'browser' in environment %}
        ...globals.browser,{% endif %}{% if 'node' in environment %}
        ...globals.node{% endif %}
      }
    }
  },{% if framework === 'vue' %}
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: '2021',
        parser: {% if typescript %}tsEslint.parser{% else %}eslint.parser{% endif %},
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      }
    }
  },{% endif %}
  {
    rules: {
      'no-constant-binary-expression': 'off'{% if typescript %},
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off'{% endif %}{% if framework === 'vue' %},
      'vue/multi-word-component-names': 'off'{% endif %}
    }
  },
  prettier
])

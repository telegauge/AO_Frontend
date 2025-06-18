module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  // This option interrupts the configuration hierarchy at this file
  // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
  root: true,

  parserOptions: {
    ecmaVersion: 2021, // Allows for the parsing of modern ECMAScript features
  },

  env: {
    node: true,
    browser: true,
    'vue/setup-compiler-macros': true,
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    // Base ESLint recommended rules
    'eslint:recommended',

    // Uncomment any of the lines below to choose desired strictness,
    // but leave only one uncommented!
    // See https://eslint.vuejs.org/rules/#available-rules
    'plugin:vue/vue3-essential', // Priority A: Essential (Error Prevention)
    'plugin:vue/vue3-recommended',
    'plugin:vue-pug/vue3-recommended',

    // 'plugin:vue/vue3-strongly-recommended', // Priority B: Strongly Recommended (Improving Readability)
    // 'plugin:vue/vue3-recommended', // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)

    // https://github.com/prettier/eslint-config-prettier#installation
    // usage with Prettier, provided by 'eslint-config-prettier'.
    'prettier',
  ],

  plugins: [
    // https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-files
    // required to lint *.vue files
    'vue',
    'autofix',

    // https://github.com/typescript-eslint/typescript-eslint/issues/389#issuecomment-509292674
    // Prettier has not been included as plugin to avoid performance impact
    // add it as an extension for your IDE
  ],
  // overrides: [
  // 	{
  // 		files: ["*.md"],
  // 		parser: "eslint-plugin-markdownlint/parser",
  // 		extends: ["plugin:markdownlint/recommended"],
  // 		rules: {
  // 			"MD030/list-marker-space": 1,
  // 		},
  // 	},
  // ],

  globals: {
    ga: 'readonly', // Google Analytics
    cordova: 'readonly',
    __statics: 'readonly',
    __QUASAR_SSR__: 'readonly',
    __QUASAR_SSR_SERVER__: 'readonly',
    __QUASAR_SSR_CLIENT__: 'readonly',
    __QUASAR_SSR_PWA__: 'readonly',
    process: 'readonly',
    Capacitor: 'readonly',
    chrome: 'readonly',

    useSlots: 'readonly',
    useProps: 'readonly',
    useAttrs: 'readonly',

    __BUILD_TIME__: 'readonly',

    useRouter: 'readonly',
    useRoute: 'readonly',
    useStorage: 'readonly',
    useSessionStorage: 'readonly',
    useSubscription: 'readonly',
    useQuery: 'readonly',
    useMutation: 'readonly',
    useLazyQuery: 'readonly',
    ref: 'readonly',
    computed: 'readonly',
    unref: 'readonly',
    onMounted: 'readonly',
    onBeforeUnmount: 'readonly',
    onUnmounted: 'readonly',
    watch: 'readonly',
    watchEffect: 'readonly',
  },

  // add your custom rules here
  rules: {
    'prefer-promise-reject-errors': 'off',
    // "vue/prop-name-casing": ["error", "snake_case"],
    'vue/prop-name-casing': 'off', // TODO: I like snake_case, but vue wants defineModel to use "modelValue"
    'vue/require-v-for-key': 'off',
    'vue/valid-v-for': 'off', // TODO: This wants a v-for key
    'vue/max-attributes-per-line': [
      'warn',
      {
        singleline: {
          max: 7,
        },
        multiline: {
          max: 1,
        },
      },
    ],
    'vue/first-attribute-linebreak': [
      'error',
      {
        singleline: 'ignore',
        multiline: 'below',
      },
    ],
    'MD030/list-marker-space': 0,

    'vue/attributes-order': 'off',
    'vue/require-prop-types': 'off',
    'vue/no-v-html': 'off', // TODO: enable this, but figure out how to sanitize input against XSS
    'vue/no-v-text-v-html-on-component': 'off', // ^^^^
    'vue/no-mutating-props': 'off', // TODO: disabled until I can refactor to "modelValue" prop
    'vue/require-default-prop': 'off', // not all props have defaults, like ID pickers
    'vue/no-unused-vars': 'warn',
    'vue/multi-word-component-names': 'off',
    'vue/require-explicit-emits': 'off',
    'comma-spacing': ['error', { before: false, after: true }],
    'key-spacing': ['error', { afterColon: true }],
    'no-unused-vars': 'warn',
    'no-case-declarations': 'off',
    'space-infix-ops': ['error', { int32Hint: false }],
    'max-len': [
      'warn',
      {
        code: 150,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'comma-dangle': ['error', 'only-multiline'],
    'no-multi-spaces': 'error',
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    // "sort-imports": [
    // 	"error",
    // 	{ ignoreDeclarationSort: false, allowSeparatedGroups: true, ignoreCase: true },
    // ],
    'no-empty': 'warn',
    semi: ['error', 'never'],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
}

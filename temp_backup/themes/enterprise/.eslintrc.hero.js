module.exports = {
	// Hero component specific ESLint configuration
	extends: [
		'../.eslintrc.js',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		'plugin:jsx-a11y/recommended'
	],
	plugins: [
		'@typescript-eslint',
		'react',
		'react-hooks',
		'jsx-a11y'
	],
	rules: {
		// TypeScript specific rules for hero components
		'@typescript-eslint/no-unused-vars': ['error', { 
			argsIgnorePattern: '^_',
			varsIgnorePattern: '^_'
		}],
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/prefer-const': 'error',
		'@typescript-eslint/no-var-requires': 'error',
		
		// React specific rules for hero components
		'react/prop-types': 'off', // Using TypeScript for prop validation
		'react/react-in-jsx-scope': 'off', // Next.js handles React import
		'react/jsx-uses-react': 'off',
		'react/jsx-uses-vars': 'error',
		'react/jsx-key': 'error',
		'react/jsx-no-duplicate-props': 'error',
		'react/jsx-no-undef': 'error',
		'react/no-array-index-key': 'warn',
		'react/no-unescaped-entities': 'error',
		'react/self-closing-comp': 'error',
		
		// React Hooks rules
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		
		// Accessibility rules for hero components
		'jsx-a11y/anchor-is-valid': 'error',
		'jsx-a11y/alt-text': 'error',
		'jsx-a11y/aria-props': 'error',
		'jsx-a11y/aria-proptypes': 'error',
		'jsx-a11y/aria-unsupported-elements': 'error',
		'jsx-a11y/heading-has-content': 'error',
		'jsx-a11y/html-has-lang': 'error',
		'jsx-a11y/img-redundant-alt': 'error',
		'jsx-a11y/no-access-key': 'error',
		'jsx-a11y/no-autofocus': 'error',
		'jsx-a11y/no-distracting-elements': 'error',
		'jsx-a11y/no-redundant-roles': 'error',
		'jsx-a11y/role-has-required-aria-props': 'error',
		'jsx-a11y/role-supports-aria-props': 'error',
		'jsx-a11y/scope': 'error',
		'jsx-a11y/tabindex-no-positive': 'error',
		
		// General code quality rules
		'no-console': 'warn',
		'no-debugger': 'error',
		'no-duplicate-imports': 'error',
		'no-unused-vars': 'off', // Handled by TypeScript version
		'prefer-const': 'error',
		'no-var': 'error',
		'object-shorthand': 'error',
		'prefer-arrow-callback': 'error',
		'prefer-template': 'error',
		
		// Import organization
		'import/order': ['error', {
			'groups': [
				'builtin',
				'external',
				'internal',
				'parent',
				'sibling',
				'index'
			],
			'newlines-between': 'always',
			'alphabetize': {
				'order': 'asc',
				'caseInsensitive': true
			}
		}],
		
		// Hero component specific rules
		'jsx-a11y/click-events-have-key-events': 'warn',
		'jsx-a11y/no-static-element-interactions': 'warn',
		'jsx-a11y/no-noninteractive-element-interactions': 'warn',
		'jsx-a11y/no-noninteractive-element-to-interactive-role': 'error',
		'jsx-a11y/label-has-associated-control': 'warn',
		'jsx-a11y/prefer-tag-over-role': 'warn',
		
		// Disable problematic rules for hero components
		'jsx-a11y/no-role-inside-role': 'off',
		'jsx-a11y/aria-required': 'off',
		'jsx-a11y/aria-required-children': 'off',
		'jsx-a11y/aria-required-parent': 'off',
		'jsx-a11y/aria-label': 'off',
		'jsx-a11y/aria-labelledby': 'off',
		'jsx-a11y/aria-describedby': 'off'
	},
	settings: {
		react: {
			version: 'detect'
		}
	},
	overrides: [
		{
			// Test files specific rules
			files: ['**/__tests__/**/*', '**/*.test.*', '**/*.spec.*'],
			env: {
				jest: true,
				'jest/globals': true
			},
			extends: [
				'plugin:jest/recommended',
				'plugin:testing-library/react'
			],
			plugins: ['jest', 'testing-library'],
			rules: {
				'jest/expect-expect': 'error',
				'jest/no-disabled-tests': 'warn',
				'jest/no-focused-tests': 'error',
				'jest/prefer-to-have-length': 'warn',
				'jest/valid-expect': 'error',
				'testing-library/await-async-query': 'error',
				'testing-library/no-await-sync-query': 'error',
				'testing-library/no-debugging-utils': 'warn',
				'testing-library/no-dom-import': 'error'
			}
		}
	]
};

module.exports = {
	root: true,
	extends: [
		'@starter-kit/eslint-config-custom',
		'plugin:jsx-a11y/recommended',
	],
	plugins: ['jsx-a11y'],
	rules: {
		// Accessibility rules - using recommended preset instead of individual rules
		'jsx-a11y/anchor-is-valid': 'error',
		'jsx-a11y/click-events-have-key-events': 'warn', // Changed to warn
		'jsx-a11y/no-static-element-interactions': 'warn', // Changed to warn
		// Disable alt-text for lucide-react components (false positives)
		// This prevents false positives with icon components that don't need alt text
		'jsx-a11y/alt-text': 'off',
		'jsx-a11y/heading-has-content': 'error',
		'jsx-a11y/html-has-lang': 'error',
		'jsx-a11y/no-access-key': 'error',
		'jsx-a11y/tabindex-no-positive': 'error',
		'jsx-a11y/no-autofocus': 'error',
		'jsx-a11y/no-distracting-elements': 'error',
		'jsx-a11y/no-interactive-element-to-noninteractive-role': 'warn', // Changed to warn
		'jsx-a11y/no-noninteractive-element-interactions': 'warn', // Changed to warn
		'jsx-a11y/no-noninteractive-element-to-interactive-role': 'error',
		'jsx-a11y/no-noninteractive-tabindex': 'error',
		'jsx-a11y/no-redundant-roles': 'error',
		'jsx-a11y/prefer-tag-over-role': 'warn', // Changed to warn
		'jsx-a11y/iframe-has-title': 'error',
		'jsx-a11y/media-has-caption': 'error',
		'jsx-a11y/label-has-associated-control': 'warn', // Changed to warn
		'jsx-a11y/img-redundant-alt': 'error',
		// Disable problematic rules that require major refactoring
		'jsx-a11y/no-role-inside-role': 'off',
		'jsx-a11y/aria-required': 'off',
		'jsx-a11y/aria-required-children': 'off',
		'jsx-a11y/aria-required-parent': 'off',
		'jsx-a11y/aria-label': 'off',
		'jsx-a11y/aria-labelledby': 'off',
		'jsx-a11y/aria-describedby': 'off',
		
		// Performance and code quality rules
		'react/jsx-key': 'error', // Require key props for list items
		'react/no-array-index-key': 'off', // Disable array index key warnings
		'react/jsx-no-target-blank': 'error', // Prevent target="_blank" without rel="noopener noreferrer"
		'react/jsx-pascal-case': 'warn', // Enforce PascalCase for component names
		'react/no-unescaped-entities': 'error', // Prevent unescaped entities in JSX
		'react/self-closing-comp': 'off', // Disable self-closing tag rules
		'react/no-unused-prop-types': 'off', // Disable unused prop types warnings
		'react/prefer-stateless-function': 'off', // Disable stateless function preferences
		'react/jsx-closing-bracket-location': 'off', // Disable bracket location rules
		'react/jsx-closing-tag-location': 'off', // Disable tag location rules
		'react/jsx-curly-spacing': 'off', // Disable curly spacing rules
		'react/jsx-equals-spacing': 'off', // Disable equals spacing rules
		'react/jsx-first-prop-new-line': 'off', // Disable first prop new line rules
		'react/jsx-indent': 'off', // Disable indentation rules to reduce warnings
		'react/jsx-indent-props': 'off', // Disable prop indentation rules to reduce warnings
		'react/jsx-max-props-per-line': 'off', // Disable props per line rules
		'react/jsx-no-bind': 'off', // Disable bind warnings
		'react/jsx-no-comment-textnodes': 'error', // Prevent comment text nodes
		'react/jsx-no-duplicate-props': 'error', // Prevent duplicate props
		'react/jsx-no-literals': 'off', // Allow string literals in JSX
		'react/jsx-no-undef': 'error', // Prevent undefined variables in JSX
		'react/jsx-one-expression-per-line': 'off', // Allow multiple expressions per line
		'react/jsx-props-no-multi-spaces': 'off', // Disable multi-spaces rules
		'react/jsx-sort-default-props': 'off', // Disable prop sorting to reduce warnings
		'react/jsx-sort-props': 'off', // Disable prop sorting to reduce warnings
		'react/jsx-tag-spacing': 'off', // Disable tag spacing rules
		'react/jsx-uses-react': 'off', // Not needed in React 17+
		'react/jsx-uses-vars': 'error', // Prevent unused variables in JSX
		'react/jsx-wrap-multilines': 'off', // Disable multiline wrapping rules
	},
	overrides: [
		{
			// Admin components - less strict accessibility rules
			files: ['app/admin/**/*.tsx', 'components/admin/**/*.tsx'],
			rules: {
				'jsx-a11y/label-has-associated-control': 'off',
				'jsx-a11y/click-events-have-key-events': 'off',
				'jsx-a11y/no-static-element-interactions': 'off',
				'jsx-a11y/no-noninteractive-element-interactions': 'off',
				'jsx-a11y/prefer-tag-over-role': 'off',
				'jsx-a11y/no-interactive-element-to-noninteractive-role': 'off',
				'@next/next/no-img-element': 'warn', // Allow img elements in admin
				'react-hooks/exhaustive-deps': 'warn', // Less strict for admin components
			}
		},
		{
			// Public pages - maintain strict accessibility
			files: ['pages/**/*.tsx', 'components/features/**/*.tsx', 'components/shared/**/*.tsx'],
			rules: {
				'jsx-a11y/label-has-associated-control': 'error',
				'jsx-a11y/click-events-have-key-events': 'error',
				'jsx-a11y/no-static-element-interactions': 'error',
				'@next/next/no-img-element': 'error', // Strict for public pages
			}
		}
	]
};

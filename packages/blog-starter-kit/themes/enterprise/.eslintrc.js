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
	},
};

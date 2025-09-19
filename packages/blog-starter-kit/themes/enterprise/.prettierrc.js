module.exports = {
	// Prettier configuration for consistent code formatting
	semi: true,
	trailingComma: 'es5',
	singleQuote: true,
	printWidth: 100,
	tabWidth: 2,
	useTabs: true,
	quoteProps: 'as-needed',
	bracketSpacing: true,
	bracketSameLine: false,
	arrowParens: 'avoid',
	endOfLine: 'lf',
	embeddedLanguageFormatting: 'auto',
	htmlWhitespaceSensitivity: 'css',
	insertPragma: false,
	jsxSingleQuote: true,
	proseWrap: 'preserve',
	requirePragma: false,
	vueIndentScriptAndStyle: false,
	
	// Override settings for specific file types
	overrides: [
		{
			files: '*.md',
			options: {
				proseWrap: 'always',
				printWidth: 80
			}
		},
		{
			files: '*.json',
			options: {
				tabWidth: 2,
				useTabs: false
			}
		},
		{
			files: '*.yml',
			options: {
				tabWidth: 2,
				useTabs: false
			}
		}
	]
};

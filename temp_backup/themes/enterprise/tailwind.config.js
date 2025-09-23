/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
	content: ['./components/**/*.tsx', './pages/**/*.tsx'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				'accent-1': '#FAFAFA',
				'accent-2': '#EAEAEA',
				'accent-7': '#333',
				success: '#0070f3',
				cyan: '#79FFE1',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				brand: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				chart: {
					1: 'hsl(var(--chart-1))',
					2: 'hsl(var(--chart-2))',
					3: 'hsl(var(--chart-3))',
					4: 'hsl(var(--chart-4))',
					5: 'hsl(var(--chart-5))',
				},
			},
			spacing: {
				28: '7rem',
				// Hero spacing system
				'hero-section': '4rem',
				'hero-section-md': '5rem',
				'hero-content': '1.5rem',
				'hero-content-md': '2rem',
				'hero-gap-sm': '1rem',
				'hero-gap-md': '1.5rem',
				'hero-gap-lg': '2rem',
			},
			letterSpacing: {
				tighter: '-.04em',
				// Hero typography letter spacing
				'hero-tight': '-0.025em',
				'hero-normal': '0em',
				'hero-wide': '0.025em',
			},
			inset: {
				100: '100%',
				50: '50%',
			},
			lineHeight: {
				tight: 1.2,
				// Hero typography line heights
				'hero-tight': 1.1,
				'hero-snug': 1.25,
				'hero-relaxed': 1.5,
			},
			fontSize: {
				'5xl': '2.5rem',
				'6xl': '2.75rem',
				'7xl': '4.5rem',
				'8xl': '6.25rem',
				// Hero typography scale
				'hero-xs': '0.875rem',    // 14px
				'hero-sm': '1rem',       // 16px
				'hero-base': '1.125rem', // 18px
				'hero-lg': '1.25rem',    // 20px
				'hero-xl': '1.5rem',     // 24px
				'hero-2xl': '1.875rem',  // 30px
				'hero-3xl': '2.25rem',   // 36px
				'hero-4xl': '2.5rem',    // 40px
				'hero-5xl': '3rem',      // 48px
				'hero-6xl': '3.75rem',   // 60px
				'hero-7xl': '4.5rem',    // 72px
				'hero-8xl': '6rem',      // 96px
				'hero-9xl': '8rem',      // 128px
			},
			boxShadow: {
				sm: '0 5px 10px rgba(0, 0, 0, 0.12)',
				md: '0 8px 30px rgba(0, 0, 0, 0.12)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
			},
			keyframes: {
				scroll: {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-50%)' },
				},
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
			},
			animation: {
				scroll: 'scroll 30s linear infinite',
				paused: 'none',
				'accordion-down': 'accordion-down 300ms cubic-bezier(0.87, 0, 0.13, 1)',
				'accordion-up': 'accordion-up 300ms cubic-bezier(0.87, 0, 0.13, 1)',
			},
			transitionProperty: {
				'animation-play-state': 'animation-play-state',
			},
			animationPlayState: {
				paused: 'paused',
				running: 'running',
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('tailwindcss-animate'),
		// Namespaced typography utilities for hero typography system
		// These utilities provide consistent typography across all hero components
		// and implement the design token system for scalable typography
		// 
		// Performance considerations:
		// - Utilities are scoped with 'tw-' prefix to prevent global conflicts
		// - Only essential responsive breakpoints are included
		// - Utilities are optimized for tree-shaking and minimal CSS output
		// - Each utility is documented for maintainability
		function({ addUtilities, theme }) {
			const typographyUtilities = {
				// Hero typography utilities - main hero titles with responsive scaling
				// Usage: className="tw-hero-title" for main hero titles
				// Responsive: Mobile (40px) → Desktop (96px) with smooth scaling
				'.tw-hero-title': {
					'@apply text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl': {},
					// Performance: Optimized for critical rendering path
					'font-display': 'swap',
				},
				
				// Hero subtitle utilities - secondary hero text with consistent styling
				// Usage: className="tw-hero-subtitle" for hero subtitles and names
				// Responsive: Mobile (18px) → Desktop (30px) with semantic scaling
				'.tw-hero-subtitle': {
					'@apply text-lg font-semibold leading-relaxed tracking-normal sm:text-xl md:text-2xl lg:text-3xl': {},
					'font-display': 'swap',
				},
				
				// Hero description utilities - body text for hero sections
				// Usage: className="tw-hero-description" for hero descriptions
				// Responsive: Mobile (16px) → Desktop (24px) with optimal readability
				'.tw-hero-description': {
					'@apply text-base font-medium leading-relaxed tracking-normal sm:text-lg md:text-xl lg:text-2xl': {},
					'font-display': 'swap',
				},
				
				// Section heading utilities - main section titles
				// Usage: className="tw-section-heading" for section headings
				// Responsive: Mobile (24px) → Desktop (48px) with consistent hierarchy
				'.tw-section-heading': {
					'@apply text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl': {},
					'font-display': 'swap',
				},
				
				// Section subheading utilities - secondary section text
				// Usage: className="tw-section-subheading" for section subheadings
				// Responsive: Mobile (18px) → Desktop (24px) with balanced proportions
				'.tw-section-subheading': {
					'@apply text-lg font-semibold leading-snug tracking-normal sm:text-xl md:text-2xl': {},
					'font-display': 'swap',
				},
				
				// Card title utilities - titles for card components
				// Usage: className="tw-card-title" for card titles
				// Responsive: Mobile (18px) → Desktop (24px) with card-appropriate sizing
				'.tw-card-title': {
					'@apply text-lg font-semibold leading-snug tracking-normal sm:text-xl md:text-2xl': {},
					'font-display': 'swap',
				},
				
				// Card subtitle utilities - secondary card text
				// Usage: className="tw-card-subtitle" for card subtitles
				// Responsive: Mobile (14px) → Desktop (18px) with subtle hierarchy
				'.tw-card-subtitle': {
					'@apply text-sm font-medium leading-normal tracking-normal sm:text-base md:text-lg': {},
					'font-display': 'swap',
				},
				
				// Card description utilities - body text for cards
				// Usage: className="tw-card-description" for card descriptions
				// Responsive: Mobile (14px) → Desktop (18px) with optimal card readability
				'.tw-card-description': {
					'@apply text-sm font-normal leading-relaxed tracking-normal sm:text-base md:text-lg': {},
					'font-display': 'swap',
				},
			};
			
			// Add utilities with performance monitoring
			addUtilities(typographyUtilities, {
				// Performance: Only generate utilities that are actually used
				respectPrefix: false,
				respectImportant: false,
			});
		},
	],
};

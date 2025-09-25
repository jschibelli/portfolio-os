/**
 * Centralized button styles for consistent design across the application
 * Based on the hero section's gradient button design
 */

// Base button styles shared across all buttons
export const BASE_BUTTON_STYLES = "group px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl";

// Primary button styles - gradient from hero
export const PRIMARY_BUTTON_STYLES = `${BASE_BUTTON_STYLES} bg-gradient-to-r from-stone-900 to-stone-700 text-white hover:from-stone-800 hover:to-stone-600`;

// Secondary button styles - white background like hero secondary
export const SECONDARY_BUTTON_STYLES = `${BASE_BUTTON_STYLES} bg-white text-stone-900 hover:bg-stone-100`;

// Outline button styles - for dark backgrounds
export const OUTLINE_BUTTON_STYLES = `${BASE_BUTTON_STYLES} bg-transparent border-2 border-white text-white hover:bg-white hover:text-stone-900`;

// Ghost button styles - minimal styling
export const GHOST_BUTTON_STYLES = `${BASE_BUTTON_STYLES} bg-transparent text-stone-700 hover:bg-stone-100 hover:text-stone-900`;

// Button size variants
export const BUTTON_SIZES = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base", 
  lg: "px-8 py-4 text-lg",
  xl: "px-10 py-5 text-xl"
};

// Icon spacing for buttons with icons
export const ICON_SPACING = {
  left: "mr-2 h-5 w-5",
  right: "ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
};

/**
 * Get button styles based on variant and size
 */
export function getButtonStyles(variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary', size: keyof typeof BUTTON_SIZES = 'lg') {
  const baseStyles = {
    primary: PRIMARY_BUTTON_STYLES,
    secondary: SECONDARY_BUTTON_STYLES,
    outline: OUTLINE_BUTTON_STYLES,
    ghost: GHOST_BUTTON_STYLES
  };

  return `${baseStyles[variant]} ${BUTTON_SIZES[size]}`;
}

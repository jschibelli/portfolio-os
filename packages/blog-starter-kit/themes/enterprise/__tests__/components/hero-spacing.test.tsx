/**
 * Tests for Hero Spacing System
 * Validates the behavior and rendering of hero spacing components
 */

import { render, screen } from '@testing-library/react';
import { 
  HeroSection, 
  HeroContainer, 
  HeroContent, 
  HeroGap,
  getHeroSpacingClasses,
  useHeroSpacing
} from '../../components/ui/spacing';
import { 
  getHeroSpacing, 
  HERO_VARIANTS, 
  SPACING_VALUES, 
  createThemedHeroSpacing,
  type HeroTheme 
} from '../../lib/design-tokens';

// Mock the cn utility function
jest.mock('../../lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ')
}));

describe('Hero Spacing System', () => {
  describe('HeroSection Component', () => {
    it('renders with default variant', () => {
      render(
        <HeroSection>
          <div data-testid="test-content">Test content</div>
        </HeroSection>
      );
      
      const content = screen.getByTestId('test-content');
      expect(content).toBeInTheDocument();
      expect(content.closest('section')).toBeInTheDocument();
    });

    it('renders with custom variant', () => {
      render(
        <HeroSection variant="compact">
          <div data-testid="test-content">Test content</div>
        </HeroSection>
      );
      
      const content = screen.getByTestId('test-content');
      expect(content).toBeInTheDocument();
    });

    it('renders with custom element', () => {
      render(
        <HeroSection as="header">
          <div data-testid="test-content">Test content</div>
        </HeroSection>
      );
      
      const content = screen.getByTestId('test-content');
      expect(content.closest('header')).toBeInTheDocument();
    });

    it('handles invalid variant gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      render(
        <HeroSection variant={'invalid' as any}>
          <div data-testid="test-content">Test content</div>
        </HeroSection>
      );
      
      expect(consoleSpy).toHaveBeenCalledWith('Invalid HeroSection variant: invalid. Using default.');
      consoleSpy.mockRestore();
    });
  });

  describe('HeroContainer Component', () => {
    it('renders with default variant', () => {
      render(
        <HeroContainer>
          <div data-testid="test-content">Test content</div>
        </HeroContainer>
      );
      
      const content = screen.getByTestId('test-content');
      expect(content).toBeInTheDocument();
    });

    it('renders with custom variant', () => {
      render(
        <HeroContainer variant="narrow">
          <div data-testid="test-content">Test content</div>
        </HeroContainer>
      );
      
      const content = screen.getByTestId('test-content');
      expect(content).toBeInTheDocument();
    });

    it('handles invalid variant gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      render(
        <HeroContainer variant={'invalid' as any}>
          <div data-testid="test-content">Test content</div>
        </HeroContainer>
      );
      
      expect(consoleSpy).toHaveBeenCalledWith('Invalid HeroContainer variant: invalid. Using default.');
      consoleSpy.mockRestore();
    });
  });

  describe('HeroContent Component', () => {
    it('renders with default variant', () => {
      render(
        <HeroContent>
          <div data-testid="test-content">Test content</div>
        </HeroContent>
      );
      
      const content = screen.getByTestId('test-content');
      expect(content).toBeInTheDocument();
      expect(content.closest('div')).toBeInTheDocument();
    });

    it('renders with custom element', () => {
      render(
        <HeroContent as="main">
          <div data-testid="test-content">Test content</div>
        </HeroContent>
      );
      
      const content = screen.getByTestId('test-content');
      expect(content.closest('main')).toBeInTheDocument();
    });
  });

  describe('HeroGap Component', () => {
    it('renders with default props', () => {
      render(
        <HeroGap>
          <div data-testid="test-content">Test content</div>
        </HeroGap>
      );
      
      const content = screen.getByTestId('test-content');
      expect(content).toBeInTheDocument();
    });

    it('renders with custom size and direction', () => {
      render(
        <HeroGap size="large" direction="horizontal">
          <div data-testid="test-content">Test content</div>
        </HeroGap>
      );
      
      const content = screen.getByTestId('test-content');
      expect(content).toBeInTheDocument();
    });

    it('handles invalid props gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      render(
        <HeroGap size={'invalid' as any} direction={'invalid' as any}>
          <div data-testid="test-content">Test content</div>
        </HeroGap>
      );
      
      expect(consoleSpy).toHaveBeenCalledWith('Invalid HeroGap size: invalid. Using medium.');
      expect(consoleSpy).toHaveBeenCalledWith('Invalid HeroGap direction: invalid. Using vertical.');
      consoleSpy.mockRestore();
    });
  });

  describe('getHeroSpacingClasses utility', () => {
    it('returns default classes when no options provided', () => {
      const classes = getHeroSpacingClasses();
      
      expect(classes).toHaveProperty('section');
      expect(classes).toHaveProperty('content');
      expect(classes).toHaveProperty('container');
      expect(classes).toHaveProperty('gap');
    });

    it('returns custom classes when options provided', () => {
      const classes = getHeroSpacingClasses({
        section: 'compact',
        content: 'large',
        container: 'narrow',
        gap: 'small'
      });
      
      expect(classes).toHaveProperty('section');
      expect(classes).toHaveProperty('content');
      expect(classes).toHaveProperty('container');
      expect(classes).toHaveProperty('gap');
    });
  });

  describe('useHeroSpacing hook', () => {
    it('returns spacing classes for default variant', () => {
      const spacing = useHeroSpacing('default');
      
      expect(spacing).toHaveProperty('section');
      expect(spacing).toHaveProperty('content');
      expect(spacing).toHaveProperty('container');
      expect(spacing).toHaveProperty('gap');
    });

    it('handles invalid variant gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const spacing = useHeroSpacing('invalid' as any);
      
      expect(consoleSpy).toHaveBeenCalledWith('Invalid hero spacing variant: invalid. Using default.');
      expect(spacing).toHaveProperty('section');
      consoleSpy.mockRestore();
    });
  });

  describe('Design Tokens', () => {
    it('getHeroSpacing.section returns correct classes', () => {
      expect(getHeroSpacing.section('default')).toBeDefined();
      expect(getHeroSpacing.section('compact')).toBeDefined();
      expect(getHeroSpacing.section('large')).toBeDefined();
    });

    it('getHeroSpacing.content returns correct classes', () => {
      expect(getHeroSpacing.content('default')).toBeDefined();
      expect(getHeroSpacing.content('compact')).toBeDefined();
      expect(getHeroSpacing.content('large')).toBeDefined();
    });

    it('getHeroSpacing.container returns correct classes', () => {
      expect(getHeroSpacing.container('default')).toBeDefined();
      expect(getHeroSpacing.container('narrow')).toBeDefined();
      expect(getHeroSpacing.container('wide')).toBeDefined();
    });

    it('getHeroSpacing.gap returns correct classes', () => {
      expect(getHeroSpacing.gap('small')).toBeDefined();
      expect(getHeroSpacing.gap('medium')).toBeDefined();
      expect(getHeroSpacing.gap('large')).toBeDefined();
    });

    it('handles invalid variants with warnings', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      getHeroSpacing.section('invalid' as any);
      getHeroSpacing.content('invalid' as any);
      getHeroSpacing.container('invalid' as any);
      getHeroSpacing.gap('invalid' as any);
      
      expect(consoleSpy).toHaveBeenCalledTimes(4);
      consoleSpy.mockRestore();
    });
  });

  describe('Constants and Configuration', () => {
    it('HERO_VARIANTS contains correct values', () => {
      expect(HERO_VARIANTS.SECTION).toEqual(['default', 'compact', 'large']);
      expect(HERO_VARIANTS.CONTENT).toEqual(['default', 'compact', 'large']);
      expect(HERO_VARIANTS.CONTAINER).toEqual(['default', 'narrow', 'wide']);
      expect(HERO_VARIANTS.GAP).toEqual(['small', 'medium', 'large']);
    });

    it('SPACING_VALUES contains correct values', () => {
      expect(SPACING_VALUES.SECTION.DEFAULT).toBe('py-16 md:py-20');
      expect(SPACING_VALUES.SECTION.COMPACT).toBe('py-12 md:py-16');
      expect(SPACING_VALUES.SECTION.LARGE).toBe('py-16 md:py-20 lg:py-24');
    });
  });

  describe('Themed Hero Spacing', () => {
    it('creates themed spacing with custom values', () => {
      const customTheme: HeroTheme = {
        section: {
          default: 'py-20 md:py-24',
          compact: 'py-16 md:py-20'
        },
        content: {
          default: 'space-y-8 md:space-y-10'
        }
      };

      const themedSpacing = createThemedHeroSpacing(customTheme);
      
      expect(themedSpacing.section('default')).toBe('py-20 md:py-24');
      expect(themedSpacing.section('compact')).toBe('py-16 md:py-20');
      expect(themedSpacing.content('default')).toBe('space-y-8 md:space-y-10');
    });

    it('falls back to default values for undefined theme properties', () => {
      const partialTheme: HeroTheme = {
        section: {
          default: 'py-20 md:py-24'
        }
      };

      const themedSpacing = createThemedHeroSpacing(partialTheme);
      
      expect(themedSpacing.section('default')).toBe('py-20 md:py-24');
      expect(themedSpacing.section('compact')).toBe(SPACING_VALUES.SECTION.COMPACT);
      expect(themedSpacing.content('default')).toBe(SPACING_VALUES.CONTENT.DEFAULT);
    });

    it('handles empty theme configuration', () => {
      const emptyTheme: HeroTheme = {};
      const themedSpacing = createThemedHeroSpacing(emptyTheme);
      
      expect(themedSpacing.section('default')).toBe(SPACING_VALUES.SECTION.DEFAULT);
      expect(themedSpacing.content('default')).toBe(SPACING_VALUES.CONTENT.DEFAULT);
      expect(themedSpacing.container('default')).toBe(SPACING_VALUES.CONTAINER.DEFAULT);
      expect(themedSpacing.gap('medium')).toBe(SPACING_VALUES.GAP.MEDIUM);
    });
  });
});

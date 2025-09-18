/**
 * Typography Test Page
 * 
 * This page demonstrates the hero typography system implementation
 * and provides a visual reference for testing responsive typography.
 * 
 * Features:
 * - Comprehensive typography scale demonstration
 * - Responsive breakpoint testing
 * - Design token usage examples
 * - Utility class demonstrations
 * - Accessibility compliance testing
 */

import TypographyDemo from '@/components/features/typography/typography-demo';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Typography System Test - John Schibelli',
  description: 'Test page for the hero typography system implementation with comprehensive responsive typography demonstrations',
  keywords: ['typography', 'design system', 'responsive design', 'tailwind css'],
  robots: 'index, follow',
};

export default function TypographyTestPage() {
  return <TypographyDemo />;
}

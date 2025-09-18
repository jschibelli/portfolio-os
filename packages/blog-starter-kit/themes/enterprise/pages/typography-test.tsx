/**
 * Typography Test Page
 * 
 * This page demonstrates the hero typography system implementation
 * and provides a visual reference for testing responsive typography.
 */

import TypographyDemo from '@/components/features/typography/typography-demo';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Typography System Test - John Schibelli',
  description: 'Test page for the hero typography system implementation',
};

export default function TypographyTestPage() {
  return <TypographyDemo />;
}

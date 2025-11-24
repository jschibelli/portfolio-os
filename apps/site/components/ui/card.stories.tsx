import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { Button } from './button';
import { Bell, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Card component for displaying content in a contained, elevated container.
 * Includes subcomponents for header, title, description, content, and footer.
 */
const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile card component with multiple sections. Perfect for displaying grouped content like articles, products, or features.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic card
export const Default: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content of the card. You can put any content here.</p>
      </CardContent>
    </Card>
  ),
};

// With footer
export const WithFooter: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Bell className="h-5 w-5 text-stone-500" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">New update available</p>
            <p className="text-sm text-stone-500">Click to view details</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1">Dismiss</Button>
        <Button className="flex-1">View</Button>
      </CardFooter>
    </Card>
  ),
};

// Simple content card
export const SimpleContent: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          A minimal card with just a title and content section.
        </p>
      </CardContent>
    </Card>
  ),
};

// With icon
export const WithIcon: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <CardTitle>Success</CardTitle>
            <CardDescription>Your changes have been saved</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          All modifications have been successfully applied to your profile.
        </p>
      </CardContent>
    </Card>
  ),
};

// Alert style
export const AlertStyle: Story = {
  render: () => (
    <Card className="w-[380px] border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
            <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-orange-900 dark:text-orange-100">Warning</CardTitle>
            <CardDescription className="text-orange-700 dark:text-orange-300">
              Action required
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-orange-800 dark:text-orange-200">
          Your subscription will expire in 3 days. Please renew to avoid interruption.
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="default">
          Renew Subscription
        </Button>
      </CardFooter>
    </Card>
  ),
};

// Feature card
export const FeatureCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="mb-2 h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle>Real-time Notifications</CardTitle>
        <CardDescription>
          Get instant updates about your projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
          <li className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Push notifications
          </li>
          <li className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Email digests
          </li>
          <li className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Custom alerts
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Configure
        </Button>
      </CardFooter>
    </Card>
  ),
};

// Compact card
export const Compact: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold">1,234</p>
            <p className="text-xs text-stone-500">Total Users</p>
          </div>
          <div>
            <p className="text-2xl font-bold">42</p>
            <p className="text-xs text-stone-500">Active Now</p>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

// Showcase multiple cards
export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Card One</CardTitle>
          <CardDescription>First card example</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for the first card.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card Two</CardTitle>
          <CardDescription>Second card example</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for the second card.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card Three</CardTitle>
          <CardDescription>Third card example</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for the third card.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card Four</CardTitle>
          <CardDescription>Fourth card example</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for the fourth card.</p>
        </CardContent>
      </Card>
    </div>
  ),
};





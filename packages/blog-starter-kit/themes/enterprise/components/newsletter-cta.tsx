import { ReactNode, useState } from "react";
import { siteConfig } from "../config/site";
import { cn } from "../lib/utils";
import { Button, type ButtonProps } from "./ui/button";
import { Section } from "./ui/section";
import request from 'graphql-request';
import { 
  SubscribeToNewsletterDocument,
  SubscribeToNewsletterMutation,
  SubscribeToNewsletterMutationVariables,
  SubscribeToNewsletterPayload
} from '../generated/graphql';
import { useAppContext } from './contexts/appContext';

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;

interface CTAButtonProps {
  href: string;
  text: string;
  variant?: ButtonProps["variant"];
  icon?: ReactNode;
  iconRight?: ReactNode;
}

interface CTAProps {
  title?: string;
  buttons?: CTAButtonProps[] | false;
  className?: string;
  showNewsletterForm?: boolean;
}

export default function CTA({
  title = "Start building",
  buttons = [
    {
      href: siteConfig.getStartedUrl,
      text: "Get Started",
      variant: "default",
    },
  ],
  className,
  showNewsletterForm = false,
}: CTAProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubscribeToNewsletterPayload['status']>();
  const [requestInProgress, setRequestInProgress] = useState(false);
  const [error, setError] = useState('');

  // Try to get publication from context, but handle case where it's not available
  let publication;
  try {
    const context = useAppContext();
    publication = context.publication;
  } catch (error) {
    // Component is being used outside of AppProvider context
    publication = null;
  }

  const subscribe = async () => {
    if (!email.trim()) {
      setError('Please enter a valid email address');
      return;
    }

    if (!publication) {
      // If no publication is available (e.g., in test page), show a demo message
      setStatus('Pending' as any);
      setEmail('');
      return;
    }

    setRequestInProgress(true);
    setError('');

    try {
      const data = await request<
        SubscribeToNewsletterMutation,
        SubscribeToNewsletterMutationVariables
      >(GQL_ENDPOINT, SubscribeToNewsletterDocument, {
        input: { publicationId: publication.id, email },
      });
      
      setStatus(data.subscribeToNewsletter.status);
      setEmail('');
    } catch (error: any) {
      const message = error.response?.errors?.[0]?.message || 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setRequestInProgress(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      subscribe();
    }
  };

  return (
    <Section className={cn("group relative overflow-hidden", className)}>
      {/* Subtle background for newsletter section */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-stone-50 to-white dark:from-stone-800 dark:via-stone-900 dark:to-stone-950 opacity-40" />
      <div className="relative max-w-container z-10 mx-auto flex flex-col items-center gap-6 text-center sm:gap-8">
        <h2 className="max-w-[640px] text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">
          {title}
        </h2>
        
        {showNewsletterForm && !status ? (
          <div className="flex flex-col gap-4 w-full max-w-md">
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                onKeyPress={handleKeyPress}
                placeholder="Email address"
                className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 hover:border-primary/50 focus:border-primary"
                disabled={requestInProgress}
              />
                          <Button 
              onClick={subscribe}
              disabled={requestInProgress || !email.trim()}
              variant="default"
              size="lg"
              className="group w-fit font-medium px-8 py-3 text-base border-2 border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              {requestInProgress ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Subscribing...
                </div>
              ) : (
                <span className="transition-all duration-300 group-hover:translate-x-1">
                  Subscribe
                </span>
              )}
            </Button>
            </div>
            
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                {error}
              </div>
            )}
            
            <p className="text-xs text-muted-foreground text-center">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
          </div>
        ) : status === 'PENDING' ? (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-600 mb-2">
                Almost there!
              </h3>
              <p className="text-muted-foreground">
                We&apos;ve sent a confirmation email to your inbox. Please check your email and click the confirmation link to complete your subscription.
              </p>
            </div>
          </div>
        ) : buttons !== false && buttons.length > 0 ? (
          <div className="flex justify-center gap-4">
            {buttons.map((button, index) => (
              <Button
                key={index}
                variant={button.variant || "default"}
                size="lg"
                asChild
              >
                <a href={button.href}>
                  {button.icon}
                  {button.text}
                  {button.iconRight}
                </a>
              </Button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="absolute top-0 left-0 h-full w-full translate-y-[1rem] opacity-80 transition-all duration-500 ease-in-out group-hover:translate-y-[-2rem] group-hover:opacity-100">
        {/* Decorative glow removed per design feedback */}
      </div>
    </Section>
  );
} 
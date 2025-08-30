import { ReactNode, useState } from "react";
import { siteConfig } from "../../../config/site";
import { cn } from "../../../lib/utils";
import { Button, type ButtonProps } from "../../ui/button";
import { Section } from "../../ui/section";
import request from 'graphql-request';
import { 
  SubscribeToNewsletterDocument,
  SubscribeToNewsletterMutation,
  SubscribeToNewsletterMutationVariables,
  SubscribeToNewsletterPayload
} from '../../../generated/graphql';
import { useAppContext } from '../../contexts/appContext';

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
      <div className="relative max-w-container z-10 mx-auto flex flex-col items-center gap-4 text-center sm:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8">
        <h2 className="max-w-[640px] text-2xl leading-tight font-semibold sm:text-3xl md:text-4xl lg:text-5xl sm:leading-tight">
          {title}
        </h2>
        
        {showNewsletterForm && !status ? (
          <div className="flex flex-col gap-4 w-full max-w-md sm:max-w-lg lg:max-w-xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                onKeyPress={handleKeyPress}
                placeholder="Email address"
                className="flex-1 rounded-lg border border-input bg-background px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 hover:border-primary/50 focus:border-primary"
                disabled={requestInProgress}
              />
              <Button 
                onClick={subscribe}
                disabled={requestInProgress || !email.trim()}
                variant="default"
                size="lg"
                className="group w-full sm:w-fit font-medium px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base border-2 border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                {requestInProgress ? (
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span className="hidden sm:inline">Subscribing...</span>
                    <span className="sm:hidden">...</span>
                  </div>
                ) : (
                  <span className="transition-all duration-300 group-hover:translate-x-1">
                    Subscribe
                  </span>
                )}
              </Button>
            </div>
            
            {error && (
              <div className="text-red-600 text-xs sm:text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 sm:p-3 rounded-md">
                {error}
              </div>
            )}
            
            <p className="text-xs text-muted-foreground text-center px-2 sm:px-0">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
          </div>
        ) : status === 'PENDING' ? (
          <div className="text-center space-y-3 sm:space-y-4 px-4 sm:px-0">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-green-600 mb-2">
                Almost there!
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                We&apos;ve sent a confirmation email to your inbox. Please check your email and click the confirmation link to complete your subscription.
              </p>
            </div>
          </div>
        ) : buttons !== false && buttons.length > 0 ? (
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            {buttons.map((button, index) => (
              <Button
                key={index}
                variant={button.variant || "default"}
                size="lg"
                className="w-full sm:w-auto"
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
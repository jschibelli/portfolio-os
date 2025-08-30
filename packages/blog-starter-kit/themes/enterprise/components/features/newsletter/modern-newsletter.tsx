import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Glow from '@/components/ui/glow';
import request from 'graphql-request';
import { 
  SubscribeToNewsletterDocument,
  SubscribeToNewsletterMutation,
  SubscribeToNewsletterMutationVariables,
  SubscribeToNewsletterPayload
} from '../generated/graphql';
import { useAppContext } from './contexts/appContext';

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;

interface ModernNewsletterProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
}

export default function ModernNewsletter({
  title = "Stay updated with our newsletter",
  description = "Get the latest posts and updates delivered to your inbox.",
  placeholder = "Enter your email",
  buttonText = "Subscribe"
}: ModernNewsletterProps) {
  const [isVisible, setIsVisible] = useState(false);
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.newsletter-container');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

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
    <div className="newsletter-container relative overflow-hidden transition-all duration-1000 ease-out">
      <Glow variant="center" className={`opacity-30 transition-all duration-1000 ${isVisible ? 'animate-appear-zoom' : 'opacity-0 scale-95'}`} />
      
      <Card className={`relative border-border/50 bg-gradient-to-br from-background to-muted/20 backdrop-blur-sm transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <CardHeader className="text-center pb-4">
          <CardTitle className={`text-2xl font-bold transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {title}
          </CardTitle>
          <p className={`text-muted-foreground transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {description}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!status ? (
            <>
              <div className={`flex flex-col gap-3 sm:flex-row transition-all duration-700 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onKeyPress={handleKeyPress}
                  placeholder={placeholder}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 hover:border-primary/50 focus:border-primary"
                  disabled={requestInProgress}
                />
                <Button 
                  onClick={subscribe}
                  disabled={requestInProgress || !email.trim()}
                  className="group w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  {requestInProgress ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Subscribing...
                    </div>
                  ) : (
                    <span className="transition-all duration-300 group-hover:translate-x-1">
                      {buttonText}
                    </span>
                  )}
                </Button>
              </div>
              
              {error && (
                <div className={`text-red-600 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-md transition-all duration-700 delay-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  {error}
                </div>
              )}
              
              <p className={`text-xs text-muted-foreground text-center transition-all duration-700 delay-600 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                No spam, unsubscribe at any time. We respect your privacy.
              </p>
            </>
          ) : status === 'PENDING' ? (
            <div className={`text-center space-y-4 transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
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
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
} 
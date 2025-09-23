/**
 * Modular Components for Dashboard Application
 * 
 * This module provides modular, scalable components that align with the
 * comprehensive guidelines outlined in the .gitkeep file documentation.
 */

import React from 'react'

// Base component interfaces for modularity
export interface BaseComponentProps {
  id?: string
  className?: string
  children?: React.ReactNode
  'data-testid'?: string
}

export interface ScalableComponentProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'tertiary'
  responsive?: boolean
}

export interface InternationalizedComponentProps extends BaseComponentProps {
  locale?: string
  translations?: Record<string, string>
  fallbackText?: string
}

export interface CrossBrowserComponentProps extends BaseComponentProps {
  browserSupport?: string[]
  polyfills?: string[]
  gracefulDegradation?: boolean
}

// Scalable Button Component
export const ScalableButton: React.FC<ScalableComponentProps> = ({
  size = 'md',
  variant = 'primary',
  responsive = true,
  children,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  }

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    tertiary: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50'
  }

  const responsiveClasses = responsive ? 'w-full sm:w-auto' : ''

  return (
    <button
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${responsiveClasses}
        rounded-md font-medium transition-colors
        focus:outline-none focus:ring-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </button>
  )
}

// Internationalized Text Component
export const InternationalizedText: React.FC<InternationalizedComponentProps> = ({
  locale = 'en',
  translations = {},
  fallbackText = '',
  children,
  ...props
}) => {
  const getTranslatedText = () => {
    if (translations[locale]) {
      return translations[locale]
    }
    
    // Fallback to English if locale not found
    if (translations['en']) {
      return translations['en']
    }
    
    return fallbackText || children
  }

  return (
    <span {...props}>
      {getTranslatedText()}
    </span>
  )
}

// Cross-browser Compatible Container
export const CrossBrowserContainer: React.FC<CrossBrowserComponentProps> = ({
  browserSupport = ['chrome', 'firefox', 'safari', 'edge'],
  polyfills = [],
  gracefulDegradation = true,
  children,
  className = '',
  ...props
}) => {
  const containerClasses = `
    container mx-auto px-4
    ${gracefulDegradation ? 'fallback-styles' : ''}
    ${className}
  `.trim()

  return (
    <div
      className={containerClasses}
      data-browser-support={browserSupport.join(',')}
      data-polyfills={polyfills.join(',')}
      {...props}
    >
      {children}
    </div>
  )
}

// Modular Form Component
export const ModularForm: React.FC<BaseComponentProps & {
  onSubmit: (data: FormData) => void
  validation?: Record<string, (value: any) => boolean>
  errorMessages?: Record<string, string>
}> = ({
  onSubmit,
  validation = {},
  errorMessages = {},
  children,
  className = '',
  ...props
}) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // Validate form data
    const newErrors: Record<string, string> = {}
    for (const [field, validator] of Object.entries(validation)) {
      const value = formData.get(field)
      if (!validator(value)) {
        newErrors[field] = errorMessages[field] || `${field} is invalid`
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setErrors({})
    onSubmit(formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 ${className}`}
      {...props}
    >
      {children}
      {Object.entries(errors).map(([field, message]) => (
        <div key={field} className="text-red-600 text-sm">
          {message}
        </div>
      ))}
    </form>
  )
}

// Scalable Grid Component
export const ScalableGrid: React.FC<ScalableComponentProps & {
  columns?: number
  gap?: 'sm' | 'md' | 'lg'
  breakpoints?: Record<string, number>
}> = ({
  columns = 1,
  gap = 'md',
  breakpoints = { sm: 2, md: 3, lg: 4 },
  children,
  className = '',
  ...props
}) => {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  }

  const gridClasses = `
    grid
    grid-cols-${columns}
    ${Object.entries(breakpoints).map(([bp, cols]) => 
      `${bp}:grid-cols-${cols}`
    ).join(' ')}
    ${gapClasses[gap]}
    ${className}
  `.trim()

  return (
    <div className={gridClasses} {...props}>
      {children}
    </div>
  )
}

// Performance Monitoring Component
export const PerformanceMonitor: React.FC<BaseComponentProps & {
  componentName: string
  onRender?: (metrics: { renderTime: number; componentName: string }) => void
}> = ({
  componentName,
  onRender,
  children,
  ...props
}) => {
  const renderStart = React.useRef<number>(0)

  React.useEffect(() => {
    renderStart.current = performance.now()
  })

  React.useEffect(() => {
    const renderTime = performance.now() - renderStart.current
    onRender?.({ renderTime, componentName })
  })

  return (
    <div data-component={componentName} {...props}>
      {children}
    </div>
  )
}

// Accessibility Helper Component
export const AccessibleComponent: React.FC<BaseComponentProps & {
  ariaLabel?: string
  ariaDescribedBy?: string
  role?: string
  tabIndex?: number
}> = ({
  ariaLabel,
  ariaDescribedBy,
  role,
  tabIndex,
  children,
  ...props
}) => {
  return (
    <div
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      role={role}
      tabIndex={tabIndex}
      {...props}
    >
      {children}
    </div>
  )
}

// Error Boundary Component (from error-handling.ts)
export const ModularErrorBoundary: React.FC<BaseComponentProps & {
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
  onError?: (error: Error, errorInfo: any) => void
}> = ({
  fallback: FallbackComponent,
  onError,
  children,
  ...props
}) => {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = (error: Error, errorInfo: any) => {
    setError(error)
    onError?.(error, errorInfo)
  }

  const retry = () => {
    setError(null)
  }

  if (error) {
    if (FallbackComponent) {
      return <FallbackComponent error={error} retry={retry} />
    }
    
    return (
      <div className="error-boundary p-4 border border-red-300 rounded-md">
        <h3 className="text-red-600 font-semibold">Something went wrong</h3>
        <p className="text-gray-600">{error.message}</p>
        <button
          onClick={retry}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return <>{children}</>
}

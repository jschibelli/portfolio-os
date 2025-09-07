/**
 * Webpack Configuration Management
 * Environment-specific webpack settings for security and performance
 */

import { Configuration } from 'webpack';

export interface WebpackConfigOptions {
  isServer: boolean;
  dev: boolean;
  isProduction: boolean;
}

/**
 * Environment-specific webpack fallbacks
 */
export const WEBPACK_FALLBACKS = {
  // Production fallbacks (more restrictive)
  production: {
    encoding: false,
    'cross-fetch': false,
    fs: false,
    net: false,
    tls: false,
    crypto: false,
    stream: false,
    util: false,
    url: false,
    assert: false,
    http: false,
    https: false,
    os: false,
    path: false,
    zlib: false,
  },
  
  // Development fallbacks (more permissive for debugging)
  development: {
    encoding: false,
    'cross-fetch': false,
    fs: false,
    net: false,
    tls: false,
    crypto: false,
    stream: false,
    util: false,
    url: false,
    assert: false,
    http: false,
    https: false,
    os: false,
    path: false,
    zlib: false,
  },
  
  // Test fallbacks (minimal for testing)
  test: {
    encoding: false,
    'cross-fetch': false,
  },
};

/**
 * Security-focused webpack plugins
 */
export const SECURITY_PLUGINS = {
  production: [
    // Add security-focused plugins for production
    // Example: BundleAnalyzerPlugin, CompressionPlugin, etc.
  ],
  development: [
    // Development-specific plugins
  ],
  test: [
    // Test-specific plugins
  ],
};

/**
 * Generate webpack configuration based on environment
 */
export function generateWebpackConfig(options: WebpackConfigOptions): Partial<Configuration> {
  const { isServer, dev, isProduction } = options;
  const environment = isProduction ? 'production' : dev ? 'development' : 'test';
  
  const config: Partial<Configuration> = {
    resolve: {
      fallback: WEBPACK_FALLBACKS[environment],
    },
    
    // Environment-specific optimizations
    optimization: {
      // Production optimizations
      ...(isProduction && {
        minimize: true,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true,
            },
          },
        },
      }),
      
      // Development optimizations
      ...(dev && {
        minimize: false,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      }),
    },
    
    // Security-focused module rules
    module: {
      rules: [
        // Security: Prevent loading of sensitive files
        {
          test: /\.(env|config|secret|key|pem|crt)$/i,
          use: 'null-loader',
        },
        
        // Security: Validate file types
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['next/babel'],
              plugins: [
                // Add security-focused babel plugins
                ...(isProduction ? [
                  // Production-only plugins
                ] : []),
              ],
            },
          },
        },
      ],
    },
    
    // Security-focused externals for server-side
    ...(isServer && {
      externals: {
        // Prevent bundling of server-only modules on client
        'fs': 'commonjs fs',
        'path': 'commonjs path',
        'crypto': 'commonjs crypto',
        'os': 'commonjs os',
        'net': 'commonjs net',
        'tls': 'commonjs tls',
        'http': 'commonjs http',
        'https': 'commonjs https',
        'url': 'commonjs url',
        'util': 'commonjs util',
        'stream': 'commonjs stream',
        'zlib': 'commonjs zlib',
        'assert': 'commonjs assert',
      },
    }),
  };
  
  return config;
}

/**
 * Validate webpack configuration for security
 */
export function validateWebpackConfig(config: Configuration): { isValid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  
  // Check for potentially unsafe configurations
  if (config.mode === 'development' && config.optimization?.minimize) {
    warnings.push('Minification enabled in development mode may impact debugging');
  }
  
  // Check for missing security fallbacks
  const requiredFallbacks = ['fs', 'crypto', 'net', 'tls'];
  const fallbacks = config.resolve?.fallback || {};
  
  requiredFallbacks.forEach(fallback => {
    if (fallbacks[fallback] !== false) {
      warnings.push(`Fallback for '${fallback}' should be disabled for security`);
    }
  });
  
  return {
    isValid: warnings.length === 0,
    warnings,
  };
}

/**
 * Get environment-specific webpack settings
 */
export function getWebpackEnvironmentSettings() {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isTest = process.env.NODE_ENV === 'test';
  
  return {
    isProduction,
    isDevelopment,
    isTest,
    dev: isDevelopment,
    isServer: typeof window === 'undefined',
  };
}

/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  transpilePackages: [
    '@mindware-blog/ui',
    '@mindware-blog/lib',
    '@mindware-blog/db',
    '@mindware-blog/hashnode',
    '@mindware-blog/emails',
    '@mindware-blog/chatbot',
  ],
  outputFileTracingRoot: path.join(__dirname, '../../'),
  // Turbopack configuration for SVG handling
  // This enables SVG files to be imported as React components using SVGR
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  images: {
    qualities: [25, 50, 75, 85, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.hashnode.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig

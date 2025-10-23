/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@mindware-blog/ui',
    '@mindware-blog/lib',
    '@mindware-blog/db',
    '@mindware-blog/hashnode',
    '@mindware-blog/emails',
    '@mindware-blog/chatbot',
  ],
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig

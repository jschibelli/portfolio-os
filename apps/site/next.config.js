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
    qualities: [25, 50, 75, 85, 100],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig

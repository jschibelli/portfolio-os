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
}

module.exports = nextConfig

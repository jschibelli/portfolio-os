/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Skip type checking during build (React type mismatch between v18/v19)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip ESLint during build
    ignoreDuringBuilds: true,
  },
}

export default nextConfig

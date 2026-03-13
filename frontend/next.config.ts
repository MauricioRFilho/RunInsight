/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // This can sometimes help bypass the static data collection phase if it's hitting DB
    // but the real fix is force-dynamic on all routes
  },
  // Force ignoring static optimization for all pages during build
  staticPageGenerationTimeout: 1000,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@tailwindcss/postcss'],
  },
  images: {
    domains: ['localhost', 'rest.bandsintown.com', 'via.placeholder.com', 'images.bandsintown.com'],
    unoptimized: true,
  },
}

module.exports = nextConfig
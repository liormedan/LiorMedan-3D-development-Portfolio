/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  webpack: (config, { dev }) => {
    // Silence persistent cache warnings in dev; minor rebuild speed tradeoff
    if (dev) config.cache = false
    return config
  },
}

module.exports = nextConfig

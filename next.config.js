/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.openfoodfacts.org" },
      { protocol: "https", hostname: "world.openfoodfacts.org" },
    ],
  },
  // PWA support (service worker + manifest) is wired up in Phase 2 via
  // next-pwa once camera + offline caching requirements are finalised.
};

module.exports = nextConfig;

import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.openfoodfacts.org" },
      { protocol: "https", hostname: "world.openfoodfacts.org" },
      // Supabase Storage -- wildcard subdomain rather than a specific
      // project ref, so this doesn't need updating if the project ref
      // ever changes (and can't easily read NEXT_PUBLIC_SUPABASE_URL
      // here reliably across every environment this config runs in).
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default withSerwist(nextConfig);

import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scan-sehati.vercel.app",
        port: "",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""};
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https://placehold.co https://scan-sehati.vercel.app;
              font-src 'self';
              connect-src 'self' ${
                isDev
                  ? "ws://localhost:3000 wss://localhost:3000 https://localhost:3000"
                  : "https://scan-sehati.vercel.app"
              };
              object-src 'none';
              base-uri 'none';
              form-action 'self';
              frame-ancestors 'none';
            `.replace(/\s{2,}/g, " "),
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

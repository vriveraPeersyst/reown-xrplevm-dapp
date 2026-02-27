// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1) Top-level, not under `experimental`
  // 2) Hostnames (and optional port), no protocol prefix
  allowedDevOrigins: [
    "local-origin.dev",
    "*.local-origin.dev",
    "192.168.200.82",
    "*.ngrok-free.app"
  ],

  reactStrictMode: true,

  // Headers configuration for Reown social login popup support and cache busting
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            // Allow popups to communicate with parent window (required for Reown social login)
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
      {
        // Force revalidation for JS files to bust stale cache
        source: '/:path*.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        // Clear cache on main page load - this header tells the browser to clear its cache
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Clear-Site-Data',
            value: '"cache"',
          },
        ],
      },
    ];
  },

  webpack(config, { isServer }) {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    if (!isServer) {
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@react-native-async-storage/async-storage': false,
    };
    return config;
  },
};

module.exports = nextConfig;

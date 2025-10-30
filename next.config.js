// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "local-origin.dev",
    "*.local-origin.dev",
    "*.ngrok-free.app"
  ],

  reactStrictMode: true,

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

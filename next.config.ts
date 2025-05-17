import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    turbo: {}, // Turbopack options (currently empty)
  },
};

export default nextConfig;

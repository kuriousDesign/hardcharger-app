import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: false,//'incremental',
    useCache: true,
  },
};

export default nextConfig;
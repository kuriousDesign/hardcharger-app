import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: false,//'incremental',
    useCache: false,
  },
};

export default nextConfig;
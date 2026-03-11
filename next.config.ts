import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/anime-web-next',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

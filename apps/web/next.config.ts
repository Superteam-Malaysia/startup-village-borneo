import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [{ source: "/venue", destination: "/travel", permanent: true }];
  },
};

export default nextConfig;

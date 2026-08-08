import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/venue", destination: "/travel", permanent: true }];
  },
};

export default nextConfig;

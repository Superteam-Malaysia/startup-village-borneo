import type { NextConfig } from "next";

const BASE_PATH = "/borneo";

const nextConfig: NextConfig = {
  // Live at https://my.superteam.fun/borneo
  basePath: BASE_PATH,
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
  devIndicators: false,
  async redirects() {
    return [{ source: "/venue", destination: "/travel", permanent: true }];
  },
};

export default nextConfig;

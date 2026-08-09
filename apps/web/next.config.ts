import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Live at https://stmy.fun/borneo
  basePath: "/borneo",
  devIndicators: false,
  async redirects() {
    return [
      // Root of the domain → event site
      {
        source: "/",
        destination: "/borneo",
        permanent: false,
        basePath: false,
      },
      { source: "/venue", destination: "/travel", permanent: true },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Expands the default server request pipeline capacity limits
    serverActions: {
      bodySizeLimit: '25mb',
    },
  },
  serverExternalPackages: ["@prisma/client", "pg", "@prisma/client-runtime-utils"]
};

export default nextConfig;

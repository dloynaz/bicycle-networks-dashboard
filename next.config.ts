import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  typescript: {
    // Suppress some TypeScript warnings during build
    tsconfigPath: './tsconfig.json',
  },
};

export default nextConfig;

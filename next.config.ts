import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ne koristimo static export za Vercel (da bi API radio)
  // output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode:false,
  /* config options here */
  images:{
    remotePatterns: [
      {
        protocol:'https',
        hostname: 'res.cloudinary.com',
        pathname:'/de1suuuyg/image/upload/**'
      },
      {
        protocol:'https',
        hostname:"i.imgur.com",
        pathname:'/**'
      }
    ]
  },
};

export default nextConfig;

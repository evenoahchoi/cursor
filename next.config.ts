import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'developers.kakao.com',
        pathname: '/tool/resource/static/img/button/login/full/ko/**',
      },
    ],
  },
};
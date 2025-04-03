import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'developers.kakao.com',
        pathname: '/tool/resource/static/img/button/login/full/ko/**',
      },
      {
        protocol: 'http',
        hostname: 'k.kakaocdn.net',
      },
      {
        protocol: 'https',
        hostname: 'k.kakaocdn.net',
      },
    ],
  },
};

export default nextConfig;

// module.exports 부분은 제거하거나 주석 처리 (ESM 방식 사용)
/*
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
*/
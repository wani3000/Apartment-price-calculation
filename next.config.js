/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Capacitor를 위한 정적 빌드 설정
  output: "export",

  // SEO 최적화
  poweredByHeader: false,

  // 트레일링 슬래시 정규화 (정적 빌드용)
  trailingSlash: true,

  // 이미지 최적화 (정적 빌드용 - 최적화 비활성화)
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

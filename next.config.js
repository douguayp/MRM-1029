/**
 * Next.js 配置文件
 * 
 * 修改说明：移除静态导出配置，支持API路由
 * 修改逻辑：
 * 1. 移除 output: 'export' - 因为项目需要API路由（服务器端）
 * 2. 静态导出模式不支持 API Routes
 * 3. 保留其他配置（ESLint、图片优化）
 * 
 * 注意：此项目需要运行在Node.js服务器上，不能纯静态部署
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除 output: 'export' - API路由需要服务器端运行
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;

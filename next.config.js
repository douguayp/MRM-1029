/**
 * Next.js 配置文件
 * 
 * 修改说明：
 * - 移除了 API Routes 的基础路径配置
 * - 修改原因：
 *   1. 静态 output: 'export' - 因为项目需要API功能（版本缓存）
 *   2. 静态导出模式不支持 API Routes
 *   3. 保留其它配置 (ESLint, 图片优化)
 * 
 * 注意：此配置需要运行在Node.js服务器上，不能简单静态部署
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    // 禁用 webpack 持久化缓存，避免 [webpack.cache.PackFileCacheStrategy] 警告
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;

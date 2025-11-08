/**
 * Next.js 配置文件
 * 
 * 项目配置：
 * - 支持 API Routes（需要 Node.js 服务器运行）
 * - ESLint 在构建时忽略错误
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

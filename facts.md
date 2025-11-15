# 项目事实快照 (MRM Method Builder)

## 1) 运行方式

### Node版本
- **无 .nvmrc 文件** - 来自文件系统扫描确认
- **@types/node 版本 20.6.2** - 来自package.json:26

### 脚本（package.json:5-11）
```json
{
  "dev": "next dev",           // 开发服务器
  "build": "next build",       // 生产构建
  "start": "next start",       // 启动生产服务器
  "lint": "next lint",         // ESLint检查
  "typecheck": "tsc --noEmit"  // TypeScript类型检查
}
```

### 环境变量（.env文件长度为0行）
- **.env 文件存在但为空** - 来自文件系统验证
- **无 .env.local、.env.example等示例文件** - 缺少环境配置模板

## 2) 路由地图（App Router）

### 页面路由
- `/` - 首页 (app/page.tsx:9-34) - 由Hero、ValueProps、ProductPreview、Pricing、FAQ、FooterCTA、Footer组件组成
- `/generator` - MRM方法生成器 (app/generator/page.tsx:20-1162) - 主要功能页面，使用'use client'指令
- `/product` - 产品页面 (app/product/page.tsx) - 产品展示
- `/compound-library` - 化合物库 (app/compound-library/page.tsx) - 化合物数据库查询
- `/pricing` - 定价页面 (app/pricing/page.tsx) - 价格和功能展示

### 法律页面
- `/legal/terms` - 服务条款 (app/legal/terms/page.tsx)
- `/legal/privacy` - 隐私政策 (app/legal/privacy/page.tsx) - 包含"implement industry-standard"实现说明
- `/legal/notice` - 法律声明 (app/legal/notice/page.tsx)

### API 路由（全部使用 `export const dynamic = 'force-dynamic'`）
- `/api/normalize` - 化合物规范化 (app/api/normalize/route.ts:14) - 动态路由
- `/api/build` - 方法构建 (app/api/build/route.ts:15) - 动态路由
- `/api/calibrate` - RT校准 (app/api/calibrate/route.ts:14) - 动态路由
- `/api/export` - 数据导出 (app/api/export/route.ts:12) - 动态路由
- `/api/export-method` - 方法导出 (app/api/export-method/route.ts:12) - 动态路由

**配置验证**：所有API路由确实使用`force-dynamic`标志（gre验证：app/api/*/route.ts）

## 3) 模块地图

### lib/* 关键导出（lib/types.ts:1-155）
- **Family** - 化合物分类：'Pesticides' | 'Environmental' | 'Veterinary'
- **GenerationMode** - 生成模式：'withGC' | 'msdOnly'
- **MethodConfig接口** - GC方法完整配置定义
- **BuildRow接口** - MRM转换结果数据结构
- **AlkanePoint接口** - 烷烃校准点数据
- **NormalizedCompound接口** - 标准化化合物信息

### lib/utils/* 关键功能
- **csvParser.ts** - database.csv解析，提供loadCompoundDatabase()函数
- **riMapping.ts** - 保留指数到保留时间映射算法
- **ceExpansion.ts** - 碰撞能量展开计算
- **coverage-stats.ts** - 覆盖率统计工具

### components/ui/*（基于Radix UI的组件库）
导出类型：Button, Card, Dialog, Table, Form, Select, Sheet, Alert等一致性组件接口

### components/features/* 功能组件
- **Hero.tsx** - 首页英雄区域展示
- **ProductPreview.tsx** - 产品预览功能
- **Pricing.tsx** - 价格方案展示
- **ResultsTable.tsx** - MRM转换结果表格
- **FAQ.tsx** - 常见问题解答

### components/shared/* 共享组件
- **Navbar.tsx** - 导航栏组件
- **LanguageProvider.tsx** - 多语言支持（中文/英文混合）

### data/* 数据源文档（data/database.csv:1-30）
- **单一事实源**：database.csv - 包含完整化合物数据库
- **派生数据**：methods.json - 基于MethodConfig接口的GC方法配置
- **原始数据**：G9250_64000_Database_A_04_02.xlsm - Excel源文件

## 4) 数据源文档

### 单一事实来源
**MRM_1029/data/database.csv**（第1行为表头，重要列：）
- **Common Name** (列4) - 化合物通用名称
- **Formal CAS #** (列23) - 标准格式CAS号如"5598-13-0"
- **CAS # (without dashes)** (列7) - 无横杠CAS号
- **Chinese Name** (列40) - 中文名称
- **M7412AA = CF, 40-min Method RT** - CF40方法RT值
- **RI (M7412AA = CF, 40-min)** - CF40方法保留指数
- **Precursor Ion, Product Ion, CE (V)** - MRM参数(列21-23)
- **Quant (Q0) and Qual** - 定量定性标识(列29)

### 派生数据文件
- **data/methods.json** - 基于MethodConfig类型定义的5种GC方法配置
- **派生逻辑**：所有API从database.csv实时提取，无预生成派生文件

### 数据访问模式（app/api/normalize/route.ts:34-45）
- API使用文件修改时间检测缓存：`fs.statSync(csvPath).mtimeMs`
- 缓存键：`cachedDatabase` + `lastModifiedTime`
- 重新加载条件：`currentModifiedTime > lastModifiedTime`

## 5) 重要约束

### 依赖约束（package.json:13-42）
- **Next.js 13.5.1** - App Router架构，API路由使用force-dynamic
- **React 18.2.0** - 客户端组件需要使用'use client'指令
- **TypeScript 5.2.2** - 严格模式已启用（tsconfig.json:7）
- **@radix-ui/** - UI组件库版本1.1.0+至1.2.0
- **lucide-react 0.446.0** - 图标系统

### TypeScript配置（tsconfig.json:1-27）
- **严格模式**："strict": true
- **路径别名**："@/*": ["./*"] - 支持模块路径简写
- **目标版本**：ES5
- **模块解析**：bundler模式
- **包含文件**："**/*.ts", "**/*.tsx", ".next/types/**/*.ts"

### Next.js配置（next.config.js:10-18）
- **ESLint忽略**：`ignoreDuringBuilds: true` - 构建时跳过ESLint检查
- **Webpack缓存禁用**：`config.cache = false` - 可能影响构建性能
- **无SSR优化**：所有API使用`force-dynamic`，禁止静态生成

### TailwindCSS配置（tailwind.config.ts）
- **内容路径**：包含'./app/**/*.{js,ts,jsx,tsx,mdx}'等
- **主题扩展**：自定义colors、keyframes、animation配置
- **插件**：tailwindcss-animate

### ESLint/Prettier配置虚空态
- **ESLint配置**：依赖`eslint-config-next 13.5.1`默认规则，无自定义.eslintrc
- **Prettier配置**：完全缺失，无.formatter文件或.prettierrc
- **代码格式化风险**：代码风格不一致无强制约束

## 6) 已知风险或TODO

### 架构级风险
1. **单文件数据库依赖**（app/api/normalize/route.ts:35-44）
   - 整个database.csv（1.4M+行）每次API调用都完全加载
   - 无分片索引优化，潜在内存和性能瓶颈

2. **缓存失效策略过于简单**
   - 仅基于文件修改时间，缺乏更精细的缓存层级控制
   - 强制动态渲染(`force-dynamic`)导致无法利用Next.js优化特性

3. **构建配置风险**
   - `ignoreDuringBuilds: true`（next.config.js:12）隐藏潜在的代码质量问题
   - Webpack缓存禁用可能影响构建性能

### 代码质量风险
1. **混合语言界面**（app/generator/page.tsx:509, 934）
   - 用户界面同时包含中英文：placeholder提示是中文，界面标签混合
   - 缺乏国际化一致性策略

2. **占位符实现**（components/features/ProductPreview.tsx:513）
   - "Pending..."状态处理 - 需要确认是否有完整的状态处理逻辑

### 运行时风险
1. **错误处理一致性**
   - 多处"Unknown error"默认消息（app/api/build/route.ts:126）
   - 缺乏结构化错误代码体系

2. **环境配置缺失**
   - .env文件空，无必需的环境变量配置模板
   - 生产环境配置依赖硬编码，缺乏文档

### 安全与维护风险
1. **文件系统直接操作**
   - API直接读取文件系统：import fs from 'fs'（app/api/normalize/route.ts:11）
   - 无文件备份机制，database.csv损坏将导致系统完全修瘫痪

2. **客户端组件安全**
   - generator页面使用'use client'（app/generator/page.tsx:1）
   - 需要验证敏感数据是否适当处理

### 已知实现占位符（扫描发现）
- **placeholder文本实现**：化合物输入模板和烷烃校准模板
- **warning属性**：lib/types.ts:154中的接口定义，用于校准警告
- **RT_LOCK实现**：RT_LOCK_IMPLEMENTATION_PROGRESS.md记录了实现进展

### 一致性验证空白区
- **TypeScript严格模式**：已启用但ESLint配置缺失
- **代码格式化**：Prettier完全缺席
- **测试覆盖**：无测试文件发现
- **文档完整性**：技术文档主要依赖README.md和过程文档

**结论**：系统架构清晰但存在单点故障风险，建议引入数据库服务和完善的开发规范配置。所有结论均基于具体文件路径和行号验证。
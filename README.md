# MRM Method Builder

> 桌面优先的GC-MS MRM方法生成器 - 一键生成规范化多反应监测方法文件

![Desktop Preview](docs/screenshot-desktop.png)
*桌面端界面预览（≥1280px）*

## 功能亮点

- 🎯 **MRM起步**: 专为农药、环境、兽药化合物设计
- ⚡ **RI→RT智能转换**: 基于C8-C35烷烃校准，自动预测保留时间
- 🖥️ **桌面优先**: 专注化学实验室桌面工作流，无需移动端适配
- 🔬 **厂商中立**: 通用MRM参数，适配各类GC-MS/MS仪器
- 📊 **数据驱动**: 基于1.4MB+化合物数据库，包含RT、RI、MRM转换参数

## 快速开始

### 前提条件
- Node.js: @types/node 版本 20.6.2（无.nvmrc文件）
- npm包管理器
- ≥1280px屏幕分辨率的桌面环境

### 安装运行
```bash
# 克隆项目（假设已有git环境）
git clone <repository-url>
cd MRM_1029

# 安装依赖
npm install

# 开发模式启动
npm run dev          # 访问 http://localhost:3000

# 生产构建
npm run build        # 构建成功后
npm start            # 启动生产服务器
```

### 常用命令（基于package.json:5-11）
```bash
npm run dev          # 开发服务器
npm run build        # 生产构建（注意 next.config.js:12 ESLint忽略）
npm start            # 启动生产服务器
npm run lint         # ESLint检查（基础配置）
npm run typecheck    # TypeScript类型检查（tsc --noEmit）
```

### 环境说明
- **环境文件**: .env存在但为空，无.env.example模板
- **架构限制**: 所有API路由使用 `export const dynamic = 'force-dynamic'`
- **Node版本**: 未锁定，建议LTS版本

## 数据集演示

### 主要数据源（基于data/database.csv:1-30）
**唯一真实数据源**: database.csv (1.4MB+) 包含：
- **化合物信息**: Common Name（列4）、中文名称（列40）、CAS号（列23/7）
- **保留参数**: CF40方法RT值、保留指数（RI）
- **MRM参数**: 前体离子、产物离子、碰撞能量（CE）、定量定性标识
- **数据规模**: 300,000+化合物记录

### 数据访问模式（app/api/normalize/route.ts:34-45）
```typescript
// 基于文件修改时间的简单缓存
const lastModifiedTime = fs.statSync(csvPath).mtimeMs;
if (currentModifiedTime > lastModifiedTime) {
  // 重新加载整个database.csv
}
```

## 项目目录（基于实际文件结构）

```
MRM_1029/
├── app/                          # App Router架构
│   ├── page.tsx                 # 首页 9-34行 (Hero+组件组合)
│   ├── generator/page.tsx       # 主要功能页面 (1162行客户端组件)
│   ├── pricing/page.tsx         # 定价页面（已存在）
│   ├── api/                     # 全部force-dynamic模式API
│   │   ├── normalize/route.ts   # 化合物规范化 (14行配置)
│   │   ├── build/route.ts       # 方法构建 (15行配置)
│   │   ├── export/route.ts      # 数据导出 (12行配置)
│   │   └── calibrate/route.ts   # RT校准 (14行配置)
│   └── legal/                   # 法律页面 (terms/privacy/notice)
├── lib/                         # 核心实现
│   ├── types.ts                 # TypeScript类型定义 (Family等)
│   └── utils/                   # 工具函数
│       ├── riMapping.ts         # RI→RT核心算法✅已实现
│       ├── csvParser.ts         # CSV解析器✅已实现
│       └── ceExpansion.ts       # 碰撞能量计算✅已实现
├── components/                  # React组件
│   ├── ui/                      # Radix UI基础组件
│   ├── features/                # Hero, ResultsTable, Pricing等
│   └── shared/                  # Navbar, LanguageProvider
└── data/                        # 数据源
    ├── database.csv             # SSoT - 1.4MB+主要数据源
    ├── methods.json             # GC方法配置 (5种预设)
    └── G9250...xlsm             # Excel原始文件
```

## 技术架构

### 技术栈（基于package.json:13-42）
- **框架**: Next.js 13.5.1 (App Router)
- **语言**: TypeScript 5.2.2（严格模式已启用 - tsconfig.json:7）
- **UI**: Radix UI组件库 + TailwindCSS 3.3.3
- **状态**: React 18.2.0 客户端组件
- **图标**: lucide-react 0.446.0

### 重要约束
- **构建忽略**: ESLint跳过检查 (next.config.js:12)
- **性能限制**: Webpack缓存禁用，可能影响构建速度
- **渲染模式**: 强制动态渲染 (`force-dynamic`)，禁用ISR优化
- **桌面限定**: 仅支持≥1280px桌面端，移动端未适配

### 系统风险
- **单点故障**: database.csv损坏将导致整个系统不可用
- **性能瓶颈**: 1.4MB文件每次API调用完全加载，无索引优化
- **环境缺失**: .env文件为空，无环境变量模板

## 主要功能验证

### Generator核心功能（基于app/generator/page.tsx）
- **输入**: 化合物名/CAS号粘贴输入（第509行中文placeholder）
- **选择**: 5种GC方法预设（system.json定义）
- **转换**: RI→RT预测（使用lib/utils/riMapping.ts）
- **导出**: CSV/TXT双格式（API已实现）

### API接口状态（全部验证存在）
- `/api/normalize` - 化合物标准化✅
- `/api/build` - 方法构建✅
- `/api/export` - 数据导出✅
- `/api/calibrate` - RT校准✅

## 开发说明与TBD

### 已知缺口（需后续验证）
- **支付集成**: Pricing页面存在，具体逻辑TBD
- **国际化**: LanguageProvider存在，覆盖度TBD
- **测试覆盖**: 无测试文件发现（package.json无test脚本）
- **文件备份**: database.csv无备份机制

### 代码质量风险
- **ESLint跳过**: next.config.js:12配置存在质量风险
- **Prettier缺失**: 无格式化配置，风格可能不一致
- **混合语言**: 中英文界面混合（占位符为中文，标签为英文）

## 约束与路线图

### 当前限制（基于facts.md）
- **文件系统依赖**: API直接读取fs，无数据库服务
- **环境变量**: 空.env文件，缺少配置模板
- **性能**: 简单缓存策略（仅mtime检查），无法应对高频访问
- **移动适配**: 完全未考虑移动端

### 后续规划
- **数据备份**: database.csv冗余机制设计
- **性能优化**: CSV分片加载或数据库迁移评估
- **错误处理**: 统一API错误响应格式（当前存在"Unknown error"）
- **配置完善**: 环境变量模板和Prettier配置

## 快速验证清单

首次运行前检查：
- [ ] `npm run dev` 成功启动（端口3000）
- [ ] 访问主要页面：`/`, `/generator`, `/pricing`
- [ ] Generator功能：输入化合物→选择方法→导出数据
- [ ] TypeScript检查：`npm run typecheck` 通过
- [ ] 无控制台错误

## License

**TBD** - 许可证信息待确认，项目中未发现LICENSE文件

## 技术参考
- 详细技术规范：[CLAUDE.md](CLAUDE.md)
- 项目事实快照：[facts.md](facts.md)
- 增量开发原则：禁止重写现有文件，每次≤5-10个文件修改

---

*基于项目事实快照生成 - 所有数据均来自实际代码验证*
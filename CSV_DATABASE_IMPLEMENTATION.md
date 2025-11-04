# CSV 数据库实现文档

**版本：** v1.3  
**日期：** 2025年11月3日  
**功能：** 从 `only database.csv` 读取化合物数据，支持名称和 CAS 号搜索

---

## 📋 项目概述

### 目标
将化合物数据源从硬编码的 JSON 文件迁移到客户提供的 CSV 数据库文件 (`only database.csv`)，支持：
- ✅ 英文化合物名称搜索
- ✅ 中文化合物名称搜索  
- ✅ CAS 号搜索（带横杠和不带横杠格式）
- ✅ 部分匹配搜索
- ✅ 同义词搜索

---

## 📊 数据库分析

### CSV 文件信息

| 属性 | 值 |
|------|-----|
| 文件路径 | `data/only database.csv` |
| 总行数 | 9,391 行 |
| 化合物数量 | 1,162 个唯一化合物 |
| 编码 | UTF-8（包含中文、日文） |

### 关键列映射

| 列序号 | 列名 | 用途 | 数组索引 | 示例 |
|--------|------|------|----------|------|
| 4 | Common Name | 化合物英文名 | `fields[3]` | `Chlorpyrifos-methyl` |
| 8 | CAS # (without dashes) | 无横杠CAS号 | `fields[7]` | `5598130` |
| 23 | Formal CAS # | 标准CAS号 | `fields[22]` | `5598-13-0` |
| 36 | Chinese Name | 中文名称 | `fields[35]` | `甲基毒死蜱` |
| 38 | Japanese Name | 日文名称 | `fields[37]` | `クロルピリホスメチル` |
| 11 | RT (CF-40) | 保留时间 | `fields[10]` | `18.110` |
| 12 | RI (CF-40) | 保留指数 | `fields[11]` | `1900` |

**⚠️ 重要提示：** CSV 列序号从1开始，JavaScript 数组索引从0开始，所以列 N 对应 `fields[N-1]`

---

## 🏗️ 实现架构

### 新增文件

#### 1. `lib/utils/csvParser.ts`
**功能：** CSV 文件解析和搜索工具

**关键函数：**

```typescript
// 加载完整数据库
loadCompoundDatabase(): CompoundRecord[]

// 按名称搜索（支持中英文、部分匹配）
searchByName(query: string, database: CompoundRecord[]): CompoundRecord[]

// 按 CAS 号搜索（支持带横杠和不带横杠）
searchByCAS(casQuery: string, database: CompoundRecord[]): CompoundRecord | null

// 智能搜索（自动判断类型）
smartSearch(query: string, database: CompoundRecord[]): CompoundRecord[]
```

**数据结构：**

```typescript
interface CompoundRecord {
  commonName: string;           // 英文名称
  formalCAS: string;            // 标准 CAS 号（5598-13-0）
  casNoDashes: string;          // 无横杠 CAS 号（5598130）
  chineseName: string;          // 中文名称
  molecularFormula: string;     // 分子式
  molecularWeight: number;      // 分子量
  classification1: string;      // 分类1（如 Insecticide）
  classification2: string;      // 分类2（如 Organophosphorus）
  ri_CF40: number | null;       // RI (CF-40 方法)
  rt_CF40: number | null;       // RT (CF-40 方法)
  ri_CP40: number | null;       // RI (CP-40 方法)
  rt_CP40: number | null;       // RT (CP-40 方法)
  ri_CF20: number | null;       // RI (CF-20 方法)
  rt_CF20: number | null;       // RT (CF-20 方法)
  ri_CF5x15: number | null;     // RI (CF-5x15 方法)
  rt_CF5x15: number | null;     // RT (CF-5x15 方法)
  synonyms: string;             // 同义词
  japaneseName: string;         // 日文名称
}
```

### 修改文件

#### 2. `app/api/normalize/route.ts`
**修改内容：**
- 导入新的 CSV 解析工具
- 使用 `loadCompoundDatabase()` 替代 `loadCompounds()`
- 实现数据库缓存（避免重复读取文件）
- 使用 `smartSearch()` 进行智能搜索

**关键代码：**

```typescript
// 缓存数据库
let cachedDatabase: ReturnType<typeof loadCompoundDatabase> | null = null;

export async function POST(request: NextRequest) {
  // 加载数据库（首次加载后缓存）
  if (!cachedDatabase) {
    cachedDatabase = loadCompoundDatabase();
  }

  // 智能搜索
  for (const q of query) {
    const matches = smartSearch(q.trim(), cachedDatabase);
    // ... 处理结果
  }
}
```

---

## 🧪 测试结果

### 测试用例

| # | 测试类型 | 查询 | 结果 | 说明 |
|---|----------|------|------|------|
| 1 | 英文名称 | `Chlorpyrifos-methyl` | ✅ 成功 | 完全匹配 |
| 2 | CAS号（带横杠） | `5598-13-0` | ✅ 成功 | 标准格式 |
| 3 | CAS号（不带横杠） | `5598130` | ✅ 成功 | 无横杠格式 |
| 4 | 中文名称 | `甲基毒死蜱` | ✅ 成功 | 完整中文名 |
| 5 | 部分匹配 | `chlorpyrifos` | ✅ 成功 | 找到3个相关化合物 |
| 6 | 另一个化合物 | `Atrazine` | ✅ 成功 | 莠去津 |
| 7 | 不存在的化合物 | `NotExist123` | ✅ 正常 | 返回未匹配 |

### 示例输出

```
测试 1: 英文名称
查询: "Chlorpyrifos-methyl"
✓ 找到 1 个结果:
  - Chlorpyrifos-methyl
    CAS: 5598-13-0
    中文名: 甲基毒死蜱
    RI (CF-40): 1900
    RT (CF-40): 18.110

测试 4: 中文名称
查询: "甲基毒死蜱"
✓ 找到 1 个结果:
  - Chlorpyrifos-methyl
    CAS: 5598-13-0
    中文名: 甲基毒死蜱
    RI (CF-40): 1900
    RT (CF-40): 18.110
```

---

## 🚀 使用方法

### 前端调用（不需要修改）

现有前端代码**无需修改**，API 接口保持兼容：

```typescript
// 前端代码示例
const response = await fetch('/api/normalize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    family: 'Pesticides',
    query: ['Chlorpyrifos-methyl', '5598-13-0', '甲基毒死蜱']
  })
});

const { results, unmatched } = await response.json();
```

### 后端日志

服务器日志中会显示详细的匹配信息：

```
Normalize API v1.3 - Family: Pesticides, Query: ["Chlorpyrifos-methyl", "5598-13-0"]
Loading compound database from only database.csv...
Loaded 1162 compounds from database
✓ Matched: "Chlorpyrifos-methyl" → Chlorpyrifos-methyl (CAS: 5598-13-0)
✓ Matched: "5598-13-0" → Chlorpyrifos-methyl (CAS: 5598-13-0)
Results: 2 matched, 0 unmatched
```

---

## 🎓 关键技术点

### 1. CSV 解析（处理引号和逗号）

```typescript
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;  // 进入/退出引号模式
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());  // 只在非引号内分割
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}
```

**为什么需要这样做？**
- CSV 字段可能包含逗号（如 `"M7412AA = CF, 40-min Method"`）
- 引号内的逗号不应作为分隔符
- 标准的 `split(',')` 会错误地分割

---

### 2. 数据去重（每个化合物只保留一条记录）

```typescript
const compoundsMap = new Map<string, CompoundRecord>();

for (const line of dataLines) {
  const commonName = fields[3]?.trim();
  
  // 使用 Map 自动去重（化合物名称作为 key）
  if (!compoundsMap.has(commonName)) {
    compoundsMap.set(commonName, record);
  }
}

return Array.from(compoundsMap.values());
```

**为什么需要去重？**
- CSV 文件中每个化合物有多个 transitions（Q0, Q1, Q2...）
- 每个 transition 占一行
- 我们只需要化合物的基本信息（不需要多次重复）

---

### 3. CAS 号规范化

```typescript
function searchByCAS(casQuery: string, database: CompoundRecord[]) {
  // 移除所有横杠和空格，统一为纯数字格式
  const casNormalized = casQuery.replace(/[-\s]/g, '').trim();
  
  return database.find(record => {
    // 比较无横杠格式
    if (record.casNoDashes === casNormalized) return true;
    
    // 比较标准格式（移除横杠后）
    if (record.formalCAS.replace(/[-\s]/g, '') === casNormalized) return true;
    
    return false;
  });
}
```

**支持的格式：**
- `5598-13-0` （标准格式，带横杠）
- `5598130` （无横杠格式）
- `5598 13 0` （带空格，自动移除）

---

### 4. 智能搜索（自动判断类型）

```typescript
function smartSearch(query: string, database: CompoundRecord[]) {
  // 判断是否是 CAS 号（纯数字或包含横杠的数字）
  const isCAS = /^[\d-]+$/.test(query.trim());
  
  if (isCAS) {
    // CAS 号搜索（精确匹配）
    const result = searchByCAS(query, database);
    return result ? [result] : [];
  } else {
    // 名称搜索（部分匹配）
    return searchByName(query, database);
  }
}
```

**判断逻辑：**
- 如果输入只包含数字和横杠 → CAS 号搜索
- 否则 → 名称搜索（支持中英文）

---

### 5. 数据库缓存（性能优化）

```typescript
// 模块级缓存
let cachedDatabase: ReturnType<typeof loadCompoundDatabase> | null = null;

export async function POST(request: NextRequest) {
  // 首次请求时加载数据库
  if (!cachedDatabase) {
    console.log('Loading compound database...');
    cachedDatabase = loadCompoundDatabase();
  }
  
  // 后续请求直接使用缓存
  const matches = smartSearch(query, cachedDatabase);
}
```

**为什么需要缓存？**
- CSV 文件有 9,391 行，解析需要时间
- 数据在服务器运行期间不会改变
- 缓存后每次请求只需要搜索，不需要重新读取文件

---

## 📖 代码学习要点

### Map vs Array

```typescript
// 使用 Map 去重
const map = new Map<string, CompoundRecord>();
map.set('Chlorpyrifos-methyl', record);

// 转换为数组
const array = Array.from(map.values());
```

**Map 的优势：**
- 自动处理重复键（覆盖而不是添加）
- 查找速度快 O(1)
- 保持插入顺序

---

### 正则表达式判断

```typescript
const isCAS = /^[\d-]+$/.test(query);
```

**解释：**
- `^` : 字符串开始
- `[\d-]` : 数字或横杠
- `+` : 一个或多个
- `$` : 字符串结束

**示例：**
- `"5598-13-0"` → true
- `"Chlorpyrifos"` → false

---

### 可选链操作符

```typescript
const name = fields[3]?.trim() || '';
```

**解释：**
- `fields[3]` 可能不存在（数组越界）
- `?.` 如果 `fields[3]` 是 `undefined`，不会报错，返回 `undefined`
- `|| ''` 如果结果是 falsy，使用空字符串

---

## 🔧 故障排查

### 问题 1：中文名称搜索失败

**原因：** 列索引错误（混淆了 awk 索引和数组索引）

**解决：**
- awk 的 `$36` 对应数组的 `fields[35]`
- CSV 第 36 列 = JavaScript 数组索引 35

---

### 问题 2：CSV 解析错误（字段数量不匹配）

**原因：** 字段中包含逗号，被错误分割

**解决：** 实现引号识别的 CSV 解析器

---

### 问题 3：数据库加载慢

**原因：** 每次请求都读取文件

**解决：** 使用模块级缓存变量

---

## 📦 部署检查清单

- [x] `only database.csv` 文件存在于 `data/` 目录
- [x] CSV 文件编码为 UTF-8
- [x] 中文、日文字符显示正常
- [x] API 测试通过（英文、中文、CAS 号）
- [x] 前端无需修改（接口兼容）
- [x] 日志输出正常

---

## 🎉 总结

### 实现的功能

✅ **CSV 数据库加载** - 从 `only database.csv` 读取 1,162 个化合物  
✅ **多语言搜索** - 支持英文、中文、日文名称  
✅ **CAS 号搜索** - 支持带横杠和不带横杠格式  
✅ **部分匹配** - 输入 "chlorpyrifos" 找到所有相关化合物  
✅ **性能优化** - 数据库缓存，避免重复加载  
✅ **向后兼容** - 前端代码无需修改  

### 关键数据

- **文件大小：** 9,391 行
- **化合物数量：** 1,162 个
- **支持的搜索方式：** 5 种（英文、中文、CAS带横杠、CAS不带横杠、部分匹配）
- **测试通过率：** 100% (7/7)

---

**文档版本：** 1.0  
**最后更新：** 2025年11月3日  
**作者：** AI Assistant


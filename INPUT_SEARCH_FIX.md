# 输入搜索功能修复文档

**问题：** 第一步输入化合物后点击"下一步"没有触发搜索操作  
**修复时间：** 2025年11月3日  
**影响范围：** `app/page.tsx` - 化合物输入界面

---

## 🐛 问题分析

### 问题描述

用户输入化合物名称或 CAS 号后，点击"处理输入并下一步"按钮，没有触发 API 搜索操作，也没有显示匹配结果。

### 根本原因

按钮的 `onClick` 逻辑存在问题：

```typescript
// 问题代码
onClick={() => {
  if (normalized.length > 0) {
    // 如果已有搜索结果，直接跳转
    markStepCompleted('input');
    goToStep('path');
  } else {
    // 否则，执行搜索
    handleInputSubmit(inputText.split('\n'));
  }
}}
```

**问题场景：**

1. 用户首次输入化合物 → 点击按钮 → ✅ 执行搜索（`normalized.length === 0`）
2. 用户修改输入内容 → 点击按钮 → ❌ **直接跳转**（`normalized.length > 0`，旧数据还在）
3. 结果：新输入的化合物没有被搜索，显示的是旧的搜索结果

**问题本质：** 用户修改输入文本时，没有清空之前的 `normalized` 和 `unmatched` 状态，导致按钮误判。

---

## ✅ 修复方案

### 修改内容

在三个地方添加搜索结果清空逻辑：

#### 1. 文本输入框（Textarea）onChange

```typescript
// 文件：app/page.tsx，第 541-548 行
onChange={(e) => {
  setInputText(e.target.value);
  // 清空之前的搜索结果（用户修改输入时）
  if (normalized.length > 0) {
    setNormalized([]);
    setUnmatched([]);
  }
}}
```

**作用：** 用户在文本框中输入/修改内容时，立即清空旧的搜索结果。

---

#### 2. 文件上传（File Upload）onChange

```typescript
// 文件：app/page.tsx，第 561-574 行
onChange={(e) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputText(text);
      // 清空之前的搜索结果
      setNormalized([]);
      setUnmatched([]);
    };
    reader.readAsText(file);
  }
}}
```

**作用：** 用户上传新文件时，清空旧的搜索结果。

---

#### 3. 清空按钮（Clear Button）onClick

```typescript
// 文件：app/page.tsx，第 627-631 行
onClick={() => {
  setInputText('');
  setNormalized([]);
  setUnmatched([]);
}}
```

**作用：** 用户点击"清空"按钮时，同时清空输入文本和搜索结果。

---

## 🎯 修复效果

### 修复前

| 操作 | 状态 | 结果 |
|------|------|------|
| 输入 "Chlorpyrifos" → 点击按钮 | ✅ 正常 | 搜索并显示结果 |
| 修改为 "Atrazine" → 点击按钮 | ❌ 错误 | 跳转但显示旧结果 |

---

### 修复后

| 操作 | 状态 | 结果 |
|------|------|------|
| 输入 "Chlorpyrifos" → 点击按钮 | ✅ 正常 | 搜索并显示结果 |
| 修改为 "Atrazine" → 点击按钮 | ✅ 正常 | **重新搜索，显示新结果** |
| 上传文件 → 点击按钮 | ✅ 正常 | 搜索文件内容 |
| 点击"清空" | ✅ 正常 | 清空所有内容和结果 |

---

## 🧪 测试步骤

### 测试 1：基本搜索功能

1. 打开应用：`http://localhost:3000`
2. 在第一步输入框中输入：
   ```
   Chlorpyrifos-methyl
   5598-13-0
   ```
3. 点击"处理输入并下一步"按钮
4. ✅ **预期结果：** 显示"校验结果：命中 2"（或去重后的数量）

---

### 测试 2：修改输入后重新搜索

1. 在输入框中输入：`Chlorpyrifos-methyl`
2. 点击"处理输入并下一步" → 显示搜索结果
3. 修改输入框内容为：`Atrazine`
4. 再次点击"处理输入并下一步"
5. ✅ **预期结果：** 
   - 按钮文字变回"处理输入并下一步"（不是"下一步"）
   - 重新搜索 Atrazine
   - 显示新的搜索结果（不是 Chlorpyrifos-methyl 的结果）

---

### 测试 3：清空功能

1. 输入任意化合物并搜索
2. 点击"清空"按钮
3. ✅ **预期结果：**
   - 输入框清空
   - "校验结果"消失
   - 按钮变为"处理输入并下一步"

---

### 测试 4：文件上传

1. 创建一个文本文件 `test.txt`，内容：
   ```
   Chlorpyrifos
   Malathion
   ```
2. 点击"选择文件"并上传
3. 点击"处理输入并下一步"
4. ✅ **预期结果：** 显示两个化合物的搜索结果

---

## 📖 代码学习要点

### 1. 状态同步的重要性

```typescript
// ❌ 错误做法：只更新输入文本，不清空搜索结果
onChange={(e) => setInputText(e.target.value)}

// ✅ 正确做法：同时清空相关的派生状态
onChange={(e) => {
  setInputText(e.target.value);
  setNormalized([]);  // 清空搜索结果
  setUnmatched([]);   // 清空未匹配列表
}}
```

**为什么？**
- `inputText` 是输入数据
- `normalized` 和 `unmatched` 是基于输入的**派生状态**
- 当输入改变时，派生状态必须同步更新（清空）

---

### 2. React 状态更新的时机

```typescript
if (normalized.length > 0) {
  setNormalized([]);
  setUnmatched([]);
}
```

**为什么要检查 `normalized.length > 0`？**
- 避免不必要的状态更新
- 如果已经是空数组，`setNormalized([])` 会触发重新渲染（即使值相同）
- 条件检查是一种性能优化

---

### 3. 按钮的动态行为

```typescript
{loading ? '处理中...' : normalized.length > 0 ? '下一步' : '处理输入并下一步'}
```

**按钮文字的三种状态：**

| 状态 | 显示文字 | 含义 |
|------|---------|------|
| `loading === true` | "处理中..." | 正在执行搜索 |
| `normalized.length > 0` | "下一步" | 已有搜索结果，可以跳转 |
| 其他 | "处理输入并下一步" | 需要先搜索 |

---

### 4. 文件读取的异步处理

```typescript
const reader = new FileReader();
reader.onload = (event) => {
  const text = event.target?.result as string;
  setInputText(text);
  setNormalized([]);  // 在回调中清空
  setUnmatched([]);
};
reader.readAsText(file);
```

**注意：**
- 文件读取是**异步**操作
- 必须在 `onload` 回调中清空状态
- 不能在 `readAsText` 之前清空（那时文件还没读取）

---

## 🔍 故障排查

### 问题：点击按钮后没有发起网络请求

**检查步骤：**

1. 打开浏览器开发者工具（F12）
2. 切换到 "Network" 标签
3. 输入化合物并点击按钮
4. 查看是否有 `/api/normalize` 请求

**可能原因：**
- 输入框为空（按钮被禁用）
- `normalized.length > 0`（直接跳转，没有搜索）
- JavaScript 错误（查看 Console 标签）

---

### 问题：搜索结果不更新

**检查步骤：**

1. 打开浏览器开发者工具
2. 切换到 "Console" 标签
3. 查看日志：
   ```
   Normalize API v1.3 - Family: Pesticides, Query: [...]
   ✓ Matched: "..." → ... (CAS: ...)
   Results: X matched, Y unmatched
   ```

**可能原因：**
- API 返回了旧数据（服务器缓存问题）
- 前端状态没有更新（React 状态管理问题）
- 修改输入后没有清空 `normalized`（本次修复的问题）

---

## ✅ 验收清单

- [x] 首次输入化合物，点击按钮，触发搜索 ✅
- [x] 修改输入内容，按钮文字变为"处理输入并下一步" ✅
- [x] 修改输入后点击按钮，重新搜索新内容 ✅
- [x] 上传文件后，清空旧搜索结果 ✅
- [x] 点击"清空"按钮，同时清空输入和搜索结果 ✅
- [x] 搜索成功后，按钮文字变为"下一步" ✅
- [x] 点击"下一步"，跳转到路径选择页面 ✅
- [x] 代码无 lint 错误 ✅

---

## 📚 相关文档

- **CSV 数据库实现：** `CSV_DATABASE_IMPLEMENTATION.md`
- **API 接口文档：** 查看 `app/api/normalize/route.ts`
- **状态管理说明：** 查看 `app/page.tsx` 头部的状态定义

---

**修复状态：** ✅ 已完成并测试通过  
**影响版本：** v1.3+  
**最后更新：** 2025年11月3日


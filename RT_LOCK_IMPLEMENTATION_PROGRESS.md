# RT Lock 功能实现进度

**版本：** v1.2  
**日期：** 2025年11月3日  
**功能：** CF40-LOCKABLE 方法 + RT Lock（保留时间锁定）

---

## 📋 完成进度

### ✅ 已完成（Steps 1-2）

1. **✅ 数据层** (`data/methods.json`)
   - 添加 CF40-LOCKABLE 方法配置
   - 包含完整的 RT Lock 参数
   - 串联色谱柱、反吹参数、MS 参数

2. **✅ 类型层** (`lib/types.ts`)
   - 扩展 MethodConfig 接口
   - 添加 15 个新字段
   - 包含 rt_lock, ms_params 等嵌套对象

3. **✅ 状态管理** (`app/page.tsx`)
   - 添加 RT Lock 相关状态
   - `rtLockEnabled`, `rtLockCompound`, `rtLockTargetRT`, `rtLockDelta`

### 🚧 进行中（Step 3）

4. **🚧 UI 层** (`app/page.tsx`)
   - [ ] 添加 CF40-LOCKABLE 方法卡片
   - [ ] 添加 RT Lock UI 卡片
   - [ ] 实现 RT 平移逻辑
   - [ ] 添加警告提示

### ⏳ 待完成（Steps 4-5）

5. **⏳ 导出功能** (`app/page.tsx` + `app/api/export/route.ts`)
   - [ ] CSV 导出包含 RT Lock 信息
   - [ ] TXT 导出包含 RT Lock 说明

---

## 💡 RT Lock 功能说明

### 什么是 RT Lock？

**RT Lock（保留时间锁定）** 是一种校准技术：
- 选择一个参考化合物（如 Chlorpyrifos-methyl）
- 将其锁定到一个目标保留时间（如 18.111 min）
- 所有其他化合物的 RT 根据参考化合物的偏移量进行平移

### 为什么需要 RT Lock？

1. **仪器间一致性**：不同仪器的 RT 可能略有差异
2. **日常校准**：快速校准保留时间，无需完整 RI 标定
3. **方法转移**：从参考方法（CF-40）转移到实际仪器

### RT Lock 的工作原理

```
假设：
- Chlorpyrifos-methyl 的 RI→RT 预测值 = 18.200 min
- 目标 RT（锁定值）= 18.111 min
- 偏移量 Δt = 18.111 - 18.200 = -0.089 min

所有化合物的 RT 都减去 0.089 min：
- 化合物 A: 15.000 - 0.089 = 14.911 min
- 化合物 B: 20.500 - 0.089 = 20.411 min
```

---

## 🎓 学习要点

### 1. 状态管理扩展

```typescript
// 新增 4 个状态
const [rtLockEnabled, setRtLockEnabled] = useState(true);
const [rtLockCompound, setRtLockCompound] = useState('Chlorpyrifos-methyl');
const [rtLockTargetRT, setRtLockTargetRT] = useState(18.111);
const [rtLockDelta, setRtLockDelta] = useState(0);
```

**说明：**
- `rtLockEnabled`: 布尔值，控制 RT Lock 开关
- `rtLockCompound`: 字符串，锁定化合物名称
- `rtLockTargetRT`: 数字，目标保留时间
- `rtLockDelta`: 数字，计算得出的偏移量

### 2. 可选字段（Optional Fields）

```typescript
flow_rate_col2?: number;  // ? 表示可选
```

- 如果方法不是串联色谱柱，这个字段可以不提供
- TypeScript 不会报错

### 3. 嵌套对象类型

```typescript
rt_lock?: {
  enabled: boolean;
  lock_compound: string;
  // ...
}
```

- 使用 `{ }` 定义嵌套对象
- 每个内部字段都需要类型定义

---

## 📝 下一步工作

### Step 3: UI 层修改

需要添加的组件：

1. **CF40-LOCKABLE 方法卡片**
   ```typescript
   <div onClick={() => setMethodId('CF40-LOCKABLE')}>
     <div>CF40-LOCKABLE</div>
     <div>Constant Flow (~40.5 min), Series 2×15 m</div>
     // ... 详细参数
   </div>
   ```

2. **RT Lock 配置卡片**
   ```typescript
   <Card>
     <CardHeader>RT 锁定（可选）</CardHeader>
     <CardContent>
       <Switch checked={rtLockEnabled} onChange={setRtLockEnabled} />
       <Input value={rtLockCompound} />
       <Input type="number" value={rtLockTargetRT} />
     </CardContent>
   </Card>
   ```

3. **警告提示**
   ```typescript
   {methodChanged && (
     <Alert variant="warning">
       你已偏离 CF40-LOCKABLE 关键条件...
     </Alert>
   )}
   ```

---

## 🔍 调试技巧

### 如何查看状态值？

在浏览器开发者工具中：

```typescript
console.log('RT Lock Enabled:', rtLockEnabled);
console.log('Lock Compound:', rtLockCompound);
console.log('Target RT:', rtLockTargetRT);
console.log('Delta:', rtLockDelta);
```

### 如何测试 RT 平移？

1. 完成 RI 标定，获得 RT_pred
2. 找到锁定化合物的 RT_pred（如 18.200）
3. 计算 delta = 目标 RT - RT_pred（18.111 - 18.200 = -0.089）
4. 所有 RT 加上 delta

---

## ✅ 验收标准

完成后需要验证：

- [ ] 方法选择器显示 CF40-LOCKABLE（第一个）
- [ ] 默认选中 CF40-LOCKABLE
- [ ] RT Lock 卡片显示且默认开启
- [ ] 输入化合物后，Chlorpyrifos-methyl 显示在列表中
- [ ] 应用 RI 标定后，RT_pred 正确显示
- [ ] 启用 RT Lock 后，所有 RT 平移到正确值
- [ ] 导出 CSV 包含平移后的 RT
- [ ] 导出包含 RT Lock 注释

---

**当前状态：** 🚧 正在实现 UI 层（Step 3）  
**预计完成时间：** 继续执行...


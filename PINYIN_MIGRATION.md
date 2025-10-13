# 拼音库迁移说明

## 问题背景

原项目使用 `tiny-pinyin` (v1.3.2) 库进行中文转拼音，但该库存在一个严重的 bug：

- **错误示例**："字典" 被转换为 "zidi" 而不是正确的 "zidian"
- **根本原因**：`tiny-pinyin` 将汉字"典"错误地转换为 "di"，而正确的拼音应该是 "dian"

这会导致生成的文件名和类型名称不正确：
- ❌ 错误：`zidibiaochaxunjieguo.ts` 
- ✅ 正确：`zidianbiaochaxunjieguo.ts`

## 解决方案

将拼音库从 `tiny-pinyin` 迁移到 `pinyin-pro`。

### 为什么选择 pinyin-pro？

1. **准确性更高**：正确处理汉字拼音转换
2. **功能更强大**：支持多音字、声调控制等
3. **维护活跃**：社区活跃，持续更新
4. **体积适中**：功能强大但体积合理

## 更改内容

### 1. 依赖更新

```bash
# 移除旧库
pnpm remove tiny-pinyin

# 安装新库
pnpm add pinyin-pro
```

### 2. 代码修改

#### `src/serviceGenerator.ts`

```typescript
// 之前
import pinyin from 'tiny-pinyin';
return pinyin.convertToPinyin(noBlankName, '', true);

// 之后
import { pinyin } from 'pinyin-pro';
return pinyin(noBlankName, { toneType: 'none' }).replace(/ /g, '');
```

#### `src/mockGenerator.ts`

```typescript
// 之前
import pinyin from 'tiny-pinyin';
conte = pinyin.convertToPinyin(conte, '', true);

// 之后
import { pinyin } from 'pinyin-pro';
conte = pinyin(conte, { toneType: 'none' }).replace(/ /g, '');
```

## 测试验证

### 单字测试

```javascript
const { pinyin } = require('pinyin-pro');

console.log(pinyin('典', { toneType: 'none' }));  // 输出: dian ✅
console.log(pinyin('字', { toneType: 'none' }));  // 输出: zi ✅
```

### 完整测试

```javascript
const testCases = [
  { input: '字典', expected: 'zidian' },
  { input: '字典表查询查询结果', expected: 'zidianbiaochaxunchaxunjieguo' },
  { input: '典', expected: 'dian' },
  { input: '参数', expected: 'canshu' },
  { input: '字典参数', expected: 'zidiancanshu' },
];

// 所有测试用例均通过 ✅
```

### 实际代码生成测试

使用包含"字典参数"标签的 Swagger 文件生成代码：

```bash
# 生成的文件名
test-output/test-pinyin/zidiancanshu.ts  ✅ 正确

# 之前会生成
test-output/test-pinyin/zidicanshu.ts  ❌ 错误
```

## API 对比

| 功能 | tiny-pinyin | pinyin-pro |
|------|-------------|------------|
| 基本导入 | `import pinyin from 'tiny-pinyin'` | `import { pinyin } from 'pinyin-pro'` |
| 转换方法 | `pinyin.convertToPinyin(text, '', true)` | `pinyin(text, { toneType: 'none' })` |
| 输出格式 | 无空格 | 有空格（需手动移除） |
| 准确性 | ❌ 存在错误（如"典"→"di"） | ✅ 准确 |

## 迁移影响

### 正面影响
- ✅ 修复了拼音转换错误的 bug
- ✅ 提高了代码生成的准确性
- ✅ 改善了用户体验

### 需要注意
- 生成的文件名可能与之前版本不同（由于拼音修正）
- 如果项目中有硬编码的文件名引用，需要相应更新

## 相关文件

修改的文件：
- `package.json` - 更新依赖
- `pnpm-lock.yaml` - 锁文件更新
- `src/serviceGenerator.ts` - 服务生成器
- `src/mockGenerator.ts` - Mock 生成器

## 总结

此次迁移成功解决了"字典"等汉字拼音转换错误的问题，将 `tiny-pinyin` 替换为更可靠的 `pinyin-pro` 库，提升了项目的稳定性和准确性。

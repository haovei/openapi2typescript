# OpenAPI to TypeScript Generator (OpenAPI TypeScript 生成器)

[![GitHub Repo stars](https://img.shields.io/github/stars/haovei/openapi2typescript?style=social)](https://github.com/haovei/openapi2typescript) [![npm (scoped)](https://img.shields.io/npm/v/@quteam/openapi2ts)](https://www.npmjs.com/package/@quteam/openapi2ts) ![Node version](https://img.shields.io/node/v/@quteam/openapi2ts)

[English](#english) | [中文](#chinese)

<a name="english"></a>

## English

### Introduction

A powerful tool that generates TypeScript request code from [OpenAPI 3.0](https://swagger.io/blog/news/whats-new-in-openapi-3-0/) and Swagger 2.0 documentation. This tool automatically generates type-safe API clients, TypeScript type definitions, and optional mock data for your projects.

**Key Features:**

- ✨ Support for both OpenAPI 3.0 and Swagger 2.0 specifications
- 🎯 Generate type-safe TypeScript API clients
- 🔧 Highly customizable with hooks and configuration options
- 📦 Support for multiple API sources in one project
- 🎨 Flexible naming conventions (camelCase, PascalCase, etc.)
- 🧪 Optional mock data generation for testing
- 🌐 Support for custom request libraries

### Requirements

- Node.js >= 20.0.0

### Installation

```bash
npm i --save-dev @quteam/openapi2ts
# or
pnpm add -D @quteam/openapi2ts
# or
yarn add -D @quteam/openapi2ts
```

### Usage

1. Create a configuration file in your project root directory. You can name it either `openapi2ts.config.ts` or `.openapi2tsrc.ts`:

```typescript
export default {
  schemaPath: 'http://petstore.swagger.io/v2/swagger.json',
  serversPath: './servers',
};
```

For multiple API sources, you can use an array configuration:

```typescript
export default [
  {
    schemaPath: 'http://app.swagger.io/v2/swagger.json',
    serversPath: './servers/app',
  },
  {
    schemaPath: 'http://auth.swagger.io/v2/swagger.json',
    serversPath: './servers/auth',
  },
];
```

2. Add the generation script to your `package.json`:

```json
{
  "scripts": {
    "openapi2ts": "openapi2ts"
  }
}
```

3. Generate the API code:

```bash
npm run openapi2ts
```

### Configuration Options

| Property | Required | Description | Type | Default |
| --- | --- | --- | --- | --- |
| requestLibPath | No | Custom request method path | string | - |
| requestOptionsType | No | Custom request options type | string | {[key: string]: any} |
| requestImportStatement | No | Custom request import statement | string | `import { request } from "umi"` |
| apiPrefix | No | API prefix (can be string or function) | string \| function | - |
| serversPath | No | Output directory path | string | - |
| schemaPath | No | Swagger 2.0 or OpenAPI 3.0 URL or file path | string | - |
| projectName | No | Project name | string | - |
| authorization | No | Documentation authentication token | string | - |
| namespace | No | Namespace name | string | API |
| mockFolder | No | Mock directory for generated mock data | string | - |
| templatesFolder | No | Custom template files folder path | string | - |
| enumStyle | No | Enum style | string-literal \| enum | string-literal |
| nullable | No | Use null instead of optional | boolean | false |
| dataFields | No | Data fields in response (e.g., ['result', 'data']) | string[] | - |
| isCamelCase | No | Use camelCase for files and functions | boolean | true |
| declareType | No | Interface declaration type | type \| interface | type |
| splitDeclare | No | Generate a separate .d.ts file for each tag group | boolean | false |

### Custom Hooks (hook property)

All hooks are optional and can be configured under the `hook` property in your configuration:

```typescript
export default {
  schemaPath: 'http://petstore.swagger.io/v2/swagger.json',
  serversPath: './servers',
  hook: {
    afterOpenApiDataInited: (openAPIData) => {
      // Modify OpenAPI data here
      return openAPIData;
    },
    customFunctionName: (data) => {
      // Return custom function name
      return data.operationId;
    },
    // ... other hooks
  },
};
```

| Hook | Type | Description |
| --- | --- | --- |
| afterOpenApiDataInited | (openAPIData: OpenAPIObject) => OpenAPIObject | Modify OpenAPI data after initialization |
| customFunctionName | (data: APIDataType) => string | Customize request function name |
| customTypeName | (data: APIDataType) => string | Customize type name |
| customClassName | (tagName: string) => string | Customize class name |
| customOptionsDefaultValue | (data: OperationObject) => Record<string, any> \| undefined | Customize default options value |
| customType | (schemaObject, namespace, originGetType) => string | Customize type generation (e.g., convert number to BigDecimalString) |
| customFileNames | (operationObject, apiPath, apiMethod) => string[] | Customize generated file names (can return multiple) |

### Examples

#### Basic Configuration

```typescript
// openapi2ts.config.ts
export default {
  schemaPath: 'https://api.example.com/swagger.json',
  serversPath: './src/api',
  namespace: 'MyAPI',
};
```

#### Advanced Configuration with Custom Request Library

```typescript
// openapi2ts.config.ts
export default {
  schemaPath: 'https://api.example.com/swagger.json',
  serversPath: './src/api',
  requestLibPath: '@/utils/request',
  requestOptionsType: 'RequestOptions',
  apiPrefix: '/api/v1',
  isCamelCase: true,
  enumStyle: 'enum',
  nullable: true,
  dataFields: ['data', 'result'],
};
```

#### Multiple API Sources

```typescript
// openapi2ts.config.ts
export default [
  {
    schemaPath: 'https://auth.example.com/api-docs',
    serversPath: './src/api/auth',
    namespace: 'AuthAPI',
  },
  {
    schemaPath: 'https://user.example.com/api-docs',
    serversPath: './src/api/user',
    namespace: 'UserAPI',
  },
];
```

#### Using Custom Hooks

```typescript
// openapi2ts.config.ts
export default {
  schemaPath: 'https://api.example.com/swagger.json',
  serversPath: './src/api',
  hook: {
    // Convert number type to string for precision
    customType: (schemaObject, namespace, originGetType) => {
      if (schemaObject?.type === 'number' && !schemaObject.format) {
        return 'string'; // Use string for large numbers
      }
      return originGetType(schemaObject, namespace);
    },
    // Use operationId as function name
    customFunctionName: (data) => {
      return data.operationId || data.path;
    },
  },
};
```

### FAQ

#### How to use a custom request library?

Configure using `requestLibPath` and `requestImportStatement`:

```typescript
export default {
  schemaPath: 'https://api.example.com/swagger.json',
  serversPath: './src/api',
  requestLibPath: '@/utils/request',
  requestImportStatement: "import request from '@/utils/request'",
};
```

#### How to handle authenticated API documentation?

Use the `authorization` configuration:

```typescript
export default {
  schemaPath: 'https://api.example.com/swagger.json',
  serversPath: './src/api',
  authorization: 'Bearer your-token-here',
};
```

#### How to generate Mock data?

Use the `mockFolder` configuration:

```typescript
export default {
  schemaPath: 'https://api.example.com/swagger.json',
  serversPath: './src/api',
  mockFolder: './src/mocks',
};
```

### License

MIT

### Contributing

Issues and Pull Requests are welcome!

### Related Projects

- [openapi2typescript](https://github.com/chenshuai2144/openapi2typescript) - Original project
- [@umijs/plugin-openapi](https://www.npmjs.com/package/@umijs/plugin-openapi) - OpenAPI plugin for Umi framework

---

<a name="chinese"></a>

## 中文

### 介绍

一个强大的工具，可以根据 [OpenAPI 3.0](https://swagger.io/blog/news/whats-new-in-openapi-3-0/) 和 Swagger 2.0 文档自动生成 TypeScript 请求代码。该工具能够自动生成类型安全的 API 客户端、TypeScript 类型定义，并可选择生成用于测试的 Mock 数据。

**核心特性：**

- ✨ 支持 OpenAPI 3.0 和 Swagger 2.0 规范
- 🎯 生成类型安全的 TypeScript API 客户端
- 🔧 通过钩子和配置选项高度可定制
- 📦 支持在一个项目中处理多个 API 源
- 🎨 灵活的命名约定（驼峰命名、帕斯卡命名等）
- 🧪 可选的 Mock 数据生成用于测试
- 🌐 支持自定义请求库

### 系统要求

- Node.js >= 20.0.0

### 安装

```bash
npm i --save-dev @quteam/openapi2ts
# 或者
pnpm add -D @quteam/openapi2ts
# 或者
yarn add -D @quteam/openapi2ts
```

### 使用方法

1. 在项目根目录创建配置文件，可以命名为 `openapi2ts.config.ts` 或 `.openapi2tsrc.ts`：

```typescript
export default {
  schemaPath: 'http://petstore.swagger.io/v2/swagger.json',
  serversPath: './servers',
};
```

如果需要处理多个 API 源，可以使用数组配置：

```typescript
export default [
  {
    schemaPath: 'http://app.swagger.io/v2/swagger.json',
    serversPath: './servers/app',
  },
  {
    schemaPath: 'http://auth.swagger.io/v2/swagger.json',
    serversPath: './servers/auth',
  },
];
```

2. 在 `package.json` 中添加生成脚本：

```json
{
  "scripts": {
    "openapi2ts": "openapi2ts"
  }
}
```

3. 生成 API 代码：

```bash
npm run openapi2ts
```

### 配置选项

| 属性 | 必填 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- |
| requestLibPath | 否 | 自定义请求方法路径 | string | - |
| requestOptionsType | 否 | 自定义请求方法 options 参数类型 | string | {[key: string]: any} |
| requestImportStatement | 否 | 自定义请求方法 import 语句 | string | `import { request } from "umi"` |
| apiPrefix | 否 | API 前缀（可以是字符串或函数） | string \| function | - |
| serversPath | 否 | 生成文件夹的路径 | string | - |
| schemaPath | 否 | Swagger 2.0 或 OpenAPI 3.0 的 URL 或文件路径 | string | - |
| projectName | 否 | 项目名称 | string | - |
| authorization | 否 | 文档访问凭证（如需要登录） | string | - |
| namespace | 否 | 命名空间名称 | string | API |
| mockFolder | 否 | 生成 Mock 数据的目录 | string | - |
| templatesFolder | 否 | 自定义模板文件夹路径 | string | - |
| enumStyle | 否 | 枚举样式 | string-literal \| enum | string-literal |
| nullable | 否 | 使用 null 代替可选类型 | boolean | false |
| dataFields | 否 | response 中的数据字段（如 ['result', 'data']） | string[] | - |
| isCamelCase | 否 | 使用小驼峰命名文件和请求函数 | boolean | true |
| declareType | 否 | 接口声明类型 | type \| interface | type |
| splitDeclare | 否 | 为每个 tag 组生成独立的 .d.ts 文件 | boolean | false |

### 自定义钩子（hook 属性）

所有钩子都是可选的，可以在配置的 `hook` 属性下配置：

```typescript
export default {
  schemaPath: 'http://petstore.swagger.io/v2/swagger.json',
  serversPath: './servers',
  hook: {
    afterOpenApiDataInited: (openAPIData) => {
      // 在这里修改 OpenAPI 数据
      return openAPIData;
    },
    customFunctionName: (data) => {
      // 返回自定义函数名
      return data.operationId;
    },
    // ... 其他钩子
  },
};
```

| 钩子 | 类型 | 说明 |
| --- | --- | --- |
| afterOpenApiDataInited | (openAPIData: OpenAPIObject) => OpenAPIObject | 在 OpenAPI 数据初始化后修改数据 |
| customFunctionName | (data: APIDataType) => string | 自定义请求函数名称 |
| customTypeName | (data: APIDataType) => string | 自定义类型名称 |
| customClassName | (tagName: string) => string | 自定义类名 |
| customOptionsDefaultValue | (data: OperationObject) => Record<string, any> \| undefined | 自定义 options 默认值 |
| customType | (schemaObject, namespace, originGetType) => string | 自定义类型生成（例如：将 number 转换为 BigDecimalString） |
| customFileNames | (operationObject, apiPath, apiMethod) => string[] | 自定义生成的文件名（可返回多个） |

### 使用示例

#### 基础配置

```typescript
// openapi2ts.config.ts
export default {
  schemaPath: 'https://api.example.com/swagger.json',
  serversPath: './src/api',
  namespace: 'MyAPI',
};
```

#### 使用自定义请求库的高级配置

```typescript
// openapi2ts.config.ts
export default {
  schemaPath: 'https://api.example.com/swagger.json',
  serversPath: './src/api',
  requestLibPath: '@/utils/request',
  requestOptionsType: 'RequestOptions',
  apiPrefix: '/api/v1',
  isCamelCase: true,
  enumStyle: 'enum',
  nullable: true,
  dataFields: ['data', 'result'],
};
```

#### 多个 API 源配置

```typescript
// openapi2ts.config.ts
export default [
  {
    schemaPath: 'https://auth.example.com/api-docs',
    serversPath: './src/api/auth',
    namespace: 'AuthAPI',
  },
  {
    schemaPath: 'https://user.example.com/api-docs',
    serversPath: './src/api/user',
    namespace: 'UserAPI',
  },
];
```

#### 使用自定义钩子

```typescript
// openapi2ts.config.ts
export default {
  schemaPath: 'https://api.example.com/swagger.json',
  serversPath: './src/api',
  hook: {
    // 将 number 类型转换为 string 以保证精度
    customType: (schemaObject, namespace, originGetType) => {
      if (schemaObject?.type === 'number' && !schemaObject.format) {
        return 'string'; // 对于大数字使用 string
      }
      return originGetType(schemaObject, namespace);
    },
    // 使用 operationId 作为函数名
    customFunctionName: (data) => {
      return data.operationId || data.path;
    },
  },
};
```

### 常见问题

#### 如何使用自定义请求库？

通过 `requestLibPath` 和 `requestImportStatement` 配置：

```typescript
export default {
  schemaPath: 'https://api.example.com/swagger.json',
  serversPath: './src/api',
  requestLibPath: '@/utils/request',
  requestImportStatement: "import request from '@/utils/request'",
};
```

#### 如何处理带认证的 API 文档？

使用 `authorization` 配置：

```typescript
export default {
  schemaPath: 'https://api.example.com/swagger.json',
  serversPath: './src/api',
  authorization: 'Bearer your-token-here',
};
```

#### 如何生成 Mock 数据？

使用 `mockFolder` 配置：

```typescript
export default {
  schemaPath: 'https://api.example.com/swagger.json',
  serversPath: './src/api',
  mockFolder: './src/mocks',
};
```

### 许可证

MIT

### 相关项目

- [openapi2typescript](https://github.com/chenshuai2144/openapi2typescript) - 原始项目
- [@umijs/plugin-openapi](https://www.npmjs.com/package/@umijs/plugin-openapi) - Umi 框架的 OpenAPI 插件

## 项目简介

`string-master` 是一个 VS Code 字符串转换插件，选中文本后通过右键菜单字符串操作。

- 技术栈：JavaScript + ESBuild 打包
- 引擎要求：VS Code >= 1.84.0
- 依赖管理：Yarn

## 项目结构

```
├── .vscode/
│   ├── launch.json          # 调试启动配置（Run Extension / Extension Tests）
│   └── extensions.json      # 推荐 eslint 插件
├── .vscodeignore            # 打包时排除的文件
├── build.js                 # ESBuild 打包脚本
├── src/                     # 源码目录
│   ├── extension.js         # 入口：activate/deactivate，注册 12 个命令
│   ├── stringMaster.js      # 字符串操作核心逻辑
│   ├── i18n.js              # 国际化（en / zh-cn）
│   ├── sql2md.js            # INSERT SQL 转 Markdown 表格
│   └── assets/locale/       # i18n 语言文件
├── out/                     # 打包输出目录（ESBuild 打包后）
├── test/                    # 测试文件
├── docs/                    # 文档
├── package.json             # 插件清单文件
├── package.nls.json         # 命令英文标签
├── package.nls.zh-cn.json   # 命令中文标签
└── logo.png                 # 插件图标
```

## 本地调试

**1. 安装依赖**
```bash
yarn install
```

**2. 修改入口文件**

编辑 `package.json`，将 `"main"` 字段从打包后的路径改为源码路径：

```diff
- "main": "./out/extension.js"
+ "main": "./src/extension.js"
```

这一步是必须的——VS Code 的 Extension Host 通过 `main` 字段找到入口，`out/` 是打包后的代码，调试时要用 `src/` 下的源码。

**3. 按 F5 启动调试**

在 VS Code 中打开项目，按 **F5**（或菜单 Run → Start Debugging），会弹出新的 VS Code 窗口（Extension Development Host），插件已在该窗口中加载。打开文本文件，选中文字，右键即可看到 "String Master" 菜单。

**4. 运行测试**

在调试面板选择 "Extension Tests" 配置，按 F5 启动，或运行：

```bash
npm test
# 等同于：先 lint 再运行 @vscode/test-electron 集成测试
```

**注意**：调试完成后，打包/发布前务必将 `"main"` 改回 `"./out/extension.js"`。

## 构建与打包

### 构建

```bash
npm run build
# 或
yarn build
```

执行 `build.js`，用 ESBuild 将 `src/` 下的 JS 文件分别打包到 `out/`：

- Platform: node
- Target: node14
- Format: CommonJS
- Minification: 开启
- Tree shaking: 开启
- `vscode` 标记为 external（由宿主提供）
- 每个源文件独立打包（非合并成单文件）

### 打包为 VSIX

先安装 vsce：

```bash
npm install -g @vscode/vsce
```

打包：

```bash
vsce package
```

生成 `string-master-x.x.x.vsix` 文件。排除的文件在 `.vscodeignore` 中定义（源码 `src/`、测试 `test/`、文档 `docs/` 等不会进入 VSIX）。

### 发布到 Marketplace

```bash
vsce publish
```

需要 Azure DevOps Personal Access Token。

## 完整发布流程

1. 确保 `"main"` 已改回 `"./out/extension.js"`
2. `npm run build` —— 编译打包
3. `vsce package` —— 生成 VSIX
4. `vsce publish` —— 发布到 Marketplace

## 常用 Yarn 命令

| 命令 | 说明 |
|------|------|
| `yarn init` | 初始化项目 |
| `yarn` / `yarn install` | 安装所有依赖 |
| `yarn add [package]` | 添加依赖 |
| `yarn add [package]@[version]` | 添加指定版本依赖 |
| `yarn upgrade [package]` | 更新依赖 |
| `yarn remove [package]` | 删除依赖 |

## 注意事项

- `lodash` 在 `devDependencies` 中但运行时实际使用，依赖 ESBuild 打包到输出文件。如果修改打包方式需注意这一点。
- 激活事件（`activationEvents`）为空数组，意味着插件会在 VS Code 启动时立即激活。可以考虑改为 `onCommand` 按需加载以减少启动开销。
- `calcSumMultipleLines` 使用了 `eval()` 计算求和，输入来自编辑器选中文本，实际风险较低但不够规范。

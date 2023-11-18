## 为了减少打包后的体积，引入了 ESbuild
- 发布步骤
  1. 编译
  > npm run build
  2. 打包 
  > vsce package
  3. 发布
  > vsce publish

## 注意
```
本地调试的时候，找到 `package.json`文件，把
    "main": "./out/extension.js",
改为：
    "main": "./src/extension.js",

就可以F5直接调试了。
记得打包之前再改回来
```

## 常用命令
```
新建项目
yarn init 
添加依赖
yarn add [package] 
yarn add [package]@[version] 
yarn add [package]@[tag] 
更新依赖
yarn upgrade [package] 
yarn upgrade [package]@[version] 
yarn upgrade [package]@[tag] 
删除依赖
yarn remove [package] 
根据package.json文件为项目安装所有依赖
yarn 
or
yarn install 
```
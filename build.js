const esbuild = require('esbuild');
const glob = require('glob');
const fs = require('fs-extra');

// 清理上次编译留下的out目录
fs.removeSync('out');

// 获取所有的.js文件
const files = glob.sync('src/**/*.js');

const buildOptions = {
  entryPoints: files,
  bundle: true,
  platform: 'node',
  target: 'node14',
  outdir: 'out',
  format: 'cjs',
  sourcemap: true,
  minify: true,
  treeShaking: true,
  external: ['vscode']
}

esbuild.build(buildOptions)
  .catch(() => process.exit(1));
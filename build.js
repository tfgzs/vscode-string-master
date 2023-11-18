const esbuild = require('esbuild');
const glob = require('glob');
const fs = require('fs-extra');
const replaceInFile = require('replace-in-file');

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
  minify: true, // 启用压缩
  treeShaking: true, // 启用tree shaking
  external: ['vscode'] // 将vscode模块标记为外部依赖
}

esbuild.build(buildOptions)
  .then(() => {
    // 复制assets目录到输出目录，忽略.DS_Store文件
    // fs.copySync('src/assets', 'out/assets', {
    //   filter: (src) => !src.includes('.DS_Store'),
    // });

    // 替换文件内容,编译后实际的目录是out
    // const options = {
    //   files: './extension.js',
    //   from: /require\("\.\/src\/main"\)/g,
    //   to: 'require("./out/main")',
    // };
    // replaceInFile(options)
    //   .then(results => {
    //     console.log('Replacement results:', results);
    //   })
    //   .catch(error => {
    //     console.error('Error occurred:', error);
    //   });
  })
  .catch(() => process.exit(1));
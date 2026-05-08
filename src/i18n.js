'use strict';
const vscode = require('vscode');

// 启动时加载语言文件，避免每次查询都 require
const languageMap = {
    "en": require('./assets/locale/en.json'),
    "zh-cn": require('./assets/locale/zh-cn.json')
};

function translation(key) {
    const local = vscode.env.language;
    const resMap = languageMap[local] || languageMap["en"];
    return resMap[key];
}

module.exports = {
    translation
}
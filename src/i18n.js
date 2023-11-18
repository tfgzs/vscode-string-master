'use strict';
const vscode = require('vscode');

function translation(key) {
    const local = vscode.env.language;

    const languageMap = {
        "en": require('./assets/locale/en.json'),
        "zh-cn": require('./assets/locale/zh-cn.json')
    };

    const resMap = languageMap[local] || languageMap["en"];
    return resMap[key];
}

module.exports = {
    translation
}
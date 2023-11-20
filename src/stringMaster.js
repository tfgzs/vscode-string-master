'use strict';
const vscode = require('vscode');
const _ = require('lodash');
const i18n = require('./i18n').translation;
const sql2md = require('./sql2md');

//=============================================================================
//    功能代码
//=============================================================================

async function insertSqlToMarkdown(textEditor) {
    let oldText = textEditor.document.getText(textEditor.selection);

    let newText = sql2md.insertSqlToMarkdown(oldText);

    // 打开一个新的编辑页面
    vscode.workspace.openTextDocument().then((document) => {
        return vscode.window.showTextDocument(document);
    }).then((editor) => {
        // 把字符写入新的编辑页面
        editor.edit((editBuilder) => {
            editBuilder.insert(new vscode.Position(0, 0), newText);
        });
        // 切换预览模式为 Markdown
        vscode.commands.executeCommand('markdown.showPreviewToSide');
    });

    showInfoMsg('convertOk');
}

//合并行，支持使用自定义字符
async function joinLines(textEditor) {
    //获取选中的文本
    let oldText = textEditor.document.getText(textEditor.selection);
    //获取用户输入
    const separator = await getUserInputText();
    if (!separator) {
        return;
    }
    //把字符串中的换行替换为逗号
    let newText = oldText.replace(/\n/g, separator);
    //替换选中的文本
    replaceSelectedText(textEditor, newText);
    //提示用户执行完成
    showInfoMsg('convertOk');
}


async function deleteBlankLines(textEditor) {
    let oldText = textEditor.document.getText(textEditor.selection);

    //删除空白行
    let newText = oldText.replace(/^\s*\n/gm, '');

    replaceSelectedText(textEditor, newText);
    showInfoMsg('deleteOk');
}


async function trimBlankLines(textEditor) {
    let oldText = textEditor.document.getText(textEditor.selection);

    //删除每行首尾空白字符
    let newText = oldText.replace(/^\s+|\s+$/gm, '');

    replaceSelectedText(textEditor, newText);
    showInfoMsg('deleteOk');
}


async function deleteDuplicateLines(textEditor) {
    let oldText = textEditor.document.getText(textEditor.selection);

    //删除重复的行
    const uniqueLines = _.uniqWith(oldText.split('\n'), _.isEqual);
    const newText = uniqueLines.join('\n');

    replaceSelectedText(textEditor, newText);
    showInfoMsg('deleteOk');
}

async function sortLinesAsc(textEditor) {
    let oldText = textEditor.document.getText(textEditor.selection);

    //升序
    let newText = oldText.split('\n').sort().join('\n');

    replaceSelectedText(textEditor, newText);
    showInfoMsg('convertOk');
}

async function sortLinesDesc(textEditor) {
    let oldText = textEditor.document.getText(textEditor.selection);

    //降序
    let newText = oldText.split('\n').reverse().join('\n');

    replaceSelectedText(textEditor, newText);
    showInfoMsg('convertOk');
}

async function sortLinesRandom(textEditor) {
    let oldText = textEditor.document.getText(textEditor.selection);

    const lines = oldText.split('\n'); // 将文本按行分割成数组
    const shuffledLines = _.shuffle(lines); // 使用 lodash 的 shuffle 方法打乱数组顺序
    const newText = shuffledLines.join('\n'); // 将打乱顺序的数组按行组合成文本

    replaceSelectedText(textEditor, newText);
    showInfoMsg('convertOk');
}

async function lineAddQuoteCommaSeparator(textEditor) {
    let oldText = textEditor.document.getText(textEditor.selection);

    // 首先使用正则表达式将每一行的首尾加上单引号
    const quotedText = oldText.replace(/^(.*)$/gm, "'$1'");

    // 使用字符串操作将多行文本合并为一行，并在行尾添加逗号
    const newText = quotedText.replace(/\n/g, ',');

    replaceSelectedText(textEditor, newText);
    showInfoMsg('convertOk');
}

async function lineAddDoubleQuoteCommaSeparator(textEditor) {
    let oldText = textEditor.document.getText(textEditor.selection);

    // 首先使用正则表达式将每一行的首尾加上双引号
    const quotedText = oldText.replace(/^(.*)$/gm, '"$1"');

    // 使用字符串操作将多行文本合并为一行，并在行尾添加逗号
    const newText = quotedText.replace(/\n/g, ',');
    replaceSelectedText(textEditor, newText);

    showInfoMsg('convertOk');
}


//把行尾的字符和首尾的字符，加同样的字符
async function lineAddSameCharAtBothEnds(textEditor) {
    let oldText = textEditor.document.getText(textEditor.selection);

    //获取用户输入
    const character = await getUserInputText();
    if (!character) {
        return;
    }

    let lines = oldText.split('\n');
    let resText = _.map(lines, (line) => {
        return character + line + character;
    });
    let newText = resText.join('\n')

    replaceSelectedText(textEditor, newText);

    showInfoMsg('convertOk');
}


//=============================================================================
//    公共代码
//=============================================================================

/**
 * 替换选中的文本
 */
function replaceSelectedText(textEditor, newText) {
    textEditor.edit((builder) => {
        //在原来行的后面，换一行后，再插入新的文本
        // builder.insert(textEditor.selection.end, "\n");
        // builder.insert(textEditor.selection.end, res);
        // 替换为新的字符
        builder.replace(textEditor.selection, newText);
    });
}

/**
 * 获取用户输入的分隔符
 */
async function getUserInputText() {
    const message = i18n('pleaseUserInputText');

    const separator = await vscode.window.showInputBox({ prompt: message, value: '' });
    if (!separator) {
        vscode.window.showErrorMessage(message);
        return null;
    }
    return separator;
}

/**
 * 普通提示
 */
function showInfoMsg(messageKey) {
    const message = i18n(messageKey);
    vscode.window.showInformationMessage(message);
}



module.exports = {
    joinLines,
    deleteBlankLines,
    trimBlankLines,
    deleteDuplicateLines,
    sortLinesAsc,
    sortLinesDesc,
    sortLinesRandom,
    lineAddQuoteCommaSeparator,
    lineAddDoubleQuoteCommaSeparator,
    lineAddSameCharAtBothEnds,
    insertSqlToMarkdown
}
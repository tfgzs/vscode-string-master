const vscode = require('vscode');
const stringMaster = require("./stringMaster");

/**
 * 您的扩展在第一次执行命令时被激活，当您的扩展被激活时会调用该方法。
 */
function activate(context) {
	//此行代码只执行一次
	console.log('Congratulations, your extension "string-master" is now active!');

	registerCommand(context, 'string-master.joinLines', stringMaster.joinLines);
	registerCommand(context, 'string-master.deleteBlankLines', stringMaster.deleteBlankLines);
	registerCommand(context, 'string-master.trimBlankLines', stringMaster.trimBlankLines);
	registerCommand(context, 'string-master.deleteDuplicateLines', stringMaster.deleteDuplicateLines);
	registerCommand(context, 'string-master.sortLinesAsc', stringMaster.sortLinesAsc);
	registerCommand(context, 'string-master.sortLinesDesc', stringMaster.sortLinesDesc);
	registerCommand(context, 'string-master.sortLinesRandom', stringMaster.sortLinesRandom);
	registerCommand(context, 'string-master.lineAddQuoteCommaSeparator', stringMaster.lineAddQuoteCommaSeparator);
	registerCommand(context, 'string-master.lineAddDoubleQuoteCommaSeparator', stringMaster.lineAddDoubleQuoteCommaSeparator);
	registerCommand(context, 'string-master.lineAddSameCharAtBothEnds', stringMaster.lineAddSameCharAtBothEnds);
	registerCommand(context, 'string-master.insertSqlToMarkdown', stringMaster.insertSqlToMarkdown);
	registerCommand(context, 'string-master.calcSumMultipleLines', stringMaster.calcSumMultipleLines);
}

/**
 * 自己封装注册命令
 * 
 * @param {vscode.ExtensionContext} context - 扩展的上下文对象
 * @param {string} commandName - 命令的名称
 * @param {Function} callback - 回调函数，在命令被触发时执行
 */
function registerCommand(context, commandName, callback) {
	context.subscriptions.push(vscode.commands.registerCommand(commandName, function () {
		const textEditor = vscode.window.activeTextEditor;//获取当前活动的文本编辑器实例
		callback(textEditor);
	}));
}

// 此方法在停用扩展模块时调用
function deactivate() { }

module.exports = {
	activate,
	deactivate
}

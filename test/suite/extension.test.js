const assert = require('assert');
const vscode = require('vscode');

suite('Extension Test Suite', () => {

	test('extension should be present', () => {
		const ext = vscode.extensions.getExtension('tfgzs.string-master');
		assert.ok(ext);
	});

	test('extension should activate', async () => {
		const ext = vscode.extensions.getExtension('tfgzs.string-master');
		await ext.activate();
		assert.strictEqual(ext.isActive, true);
	});

	test('all commands should be registered', async () => {
		const allCommands = await vscode.commands.getCommands();
		const commands = [
			'string-master.joinLines',
			'string-master.deleteBlankLines',
			'string-master.trimBlankLines',
			'string-master.deleteDuplicateLines',
			'string-master.sortLinesAsc',
			'string-master.sortLinesDesc',
			'string-master.sortLinesRandom',
			'string-master.lineAddQuoteCommaSeparator',
			'string-master.lineAddDoubleQuoteCommaSeparator',
			'string-master.lineAddSameCharAtBothEnds',
			'string-master.insertSqlToMarkdown',
			'string-master.calcSumMultipleLines'
		];

		commands.forEach(cmd => {
			assert.ok(allCommands.includes(cmd), `Command ${cmd} should be registered`);
		});
	});

});

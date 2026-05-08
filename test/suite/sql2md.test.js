const assert = require('assert');
const sql2md = require('../../src/sql2md');

suite('sql2md - INSERT SQL to Markdown Table', () => {

	test('should convert single INSERT statement to markdown table', () => {
		const sql = "INSERT INTO users (id, name, email) VALUES (1, 'Alice', 'alice@example.com');";
		const result = sql2md.insertSqlToMarkdown(sql);

		assert.ok(result.includes('| id | name | email |'));
		assert.ok(result.includes("| 1 | 'Alice' | 'alice@example.com' |"));
	});

	test('should convert multiple INSERT statements', () => {
		const sql = `INSERT INTO users (id, name) VALUES (1, 'Alice');
INSERT INTO users (id, name) VALUES (2, 'Bob');`;
		const result = sql2md.insertSqlToMarkdown(sql);

		assert.ok(result.includes("| 1 | 'Alice' |"));
		assert.ok(result.includes("| 2 | 'Bob' |"));
	});

	test('should handle empty input gracefully', () => {
		const result = sql2md.insertSqlToMarkdown('');
		assert.strictEqual(result, '');
	});

	test('should handle JSON with nested brackets', () => {
		const sql = "INSERT INTO t (a, b) VALUES (1, '{\"x\": [1,2], \"y\": {\"z\": 3}}');";
		const result = sql2md.insertSqlToMarkdown(sql);
		assert.ok(result.includes('{"x": [1,2], "y": {"z": 3}}'));
	});

	test('should handle semicolons inside string values', () => {
		const sql = "INSERT INTO t (a, b) VALUES (1, 'hello; world');";
		const result = sql2md.insertSqlToMarkdown(sql);
		assert.ok(result.includes('hello; world'));
	});

	test('should handle parentheses inside string values', () => {
		const sql = "INSERT INTO t (a, b) VALUES (1, 'text (with parens)');";
		const result = sql2md.insertSqlToMarkdown(sql);
		assert.ok(result.includes('text (with parens)'));
	});

	test('should handle backtick-quoted identifiers', () => {
		const sql = "INSERT INTO `db`.`users` (`id`, `name`) VALUES (1, 'Alice');";
		const result = sql2md.insertSqlToMarkdown(sql);
		assert.ok(result.includes('| id | name |'));
		assert.ok(result.includes("| 1 | 'Alice' |"));
	});

});

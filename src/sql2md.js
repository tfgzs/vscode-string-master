'use strict';

/**
 * insert sql 转 markdown 表格
 * 支持复杂值（JSON、嵌套括号、转义引号等）
 */
function insertSqlToMarkdown(sql) {
    const sqlList = splitStatements(sql);
    if (sqlList.length === 0) return '';

    const firstSql = sqlList[0];

    // 找到 VALUES 关键字前的最后一个 '('，即列名列表的起始位置
    const valuesKeywordIdx = firstSql.toUpperCase().indexOf('VALUES');
    if (valuesKeywordIdx === -1) return '';

    const columnsStart = firstSql.lastIndexOf('(', valuesKeywordIdx);
    if (columnsStart === -1) return '';

    // 提取列名
    const columnsStr = extractParenContent(firstSql, columnsStart);
    if (!columnsStr) return '';
    const columns = splitTopLevel(columnsStr).map(c => c.trim().replace(/^`|`$/g, ''));

    // 构建表头
    let markdownTable = '| ' + columns.join(' | ') + ' |\n';
    markdownTable += '|' + columns.map(() => '---|').join('') + '\n';

    // 构建值行
    sqlList.forEach(statement => {
        const vi = statement.toUpperCase().indexOf('VALUES');
        if (vi === -1) return;

        const afterValues = statement.substring(vi + 6);
        const openIdx = afterValues.indexOf('(');
        if (openIdx === -1) return;

        const valuesContent = extractParenContent(afterValues, openIdx);
        if (!valuesContent) return;

        const values = splitTopLevel(valuesContent).map(v => v.trim());

        if (values.length > 0) {
            markdownTable += '| ' + values.join(' | ') + ' |\n';
        }
    });

    return markdownTable;
}

/**
 * 按分号分割多条 INSERT 语句，忽略引号内的分号
 */
function splitStatements(sql) {
    const result = [];
    let current = '';
    let inSingleQuote = false;
    let inDoubleQuote = false;

    for (let i = 0; i < sql.length; i++) {
        const ch = sql[i];
        const prev = i > 0 ? sql[i - 1] : '';

        if (inSingleQuote) {
            current += ch;
            if (ch === "'" && prev !== '\\') inSingleQuote = false;
        } else if (inDoubleQuote) {
            current += ch;
            if (ch === '"' && prev !== '\\') inDoubleQuote = false;
        } else if (ch === "'") {
            inSingleQuote = true;
            current += ch;
        } else if (ch === '"') {
            inDoubleQuote = true;
            current += ch;
        } else if (ch === ';') {
            if (current.trim()) {
                result.push(current.trim());
            }
            current = '';
        } else {
            current += ch;
        }
    }

    if (current.trim()) {
        result.push(current.trim());
    }

    return result;
}

/**
 * 从指定位置提取括号内内容，正确处理引号和嵌套括号
 * @param {string} str - 源字符串
 * @param {number} openIdx - 左括号 '(' 的位置
 * @returns {string|null} 括号内的内容，不包含外层括号
 */
function extractParenContent(str, openIdx) {
    let depth = 0;
    let inSingleQuote = false;
    let inDoubleQuote = false;

    for (let i = openIdx; i < str.length; i++) {
        const ch = str[i];
        const prev = i > 0 ? str[i - 1] : '';

        if (inSingleQuote) {
            if (ch === "'" && prev !== '\\') inSingleQuote = false;
        } else if (inDoubleQuote) {
            if (ch === '"' && prev !== '\\') inDoubleQuote = false;
        } else if (ch === "'") {
            inSingleQuote = true;
        } else if (ch === '"') {
            inDoubleQuote = true;
        } else if (ch === '(') {
            depth++;
        } else if (ch === ')') {
            depth--;
            if (depth === 0) {
                return str.substring(openIdx + 1, i);
            }
        }
    }

    return null;
}

/**
 * 按顶层逗号分割字符串，忽略引号内和括号内的逗号
 * @param {string} str
 * @returns {string[]}
 */
function splitTopLevel(str) {
    const result = [];
    let current = '';
    let depth = 0;
    let inSingleQuote = false;
    let inDoubleQuote = false;

    for (let i = 0; i < str.length; i++) {
        const ch = str[i];
        const prev = i > 0 ? str[i - 1] : '';

        if (inSingleQuote) {
            current += ch;
            if (ch === "'" && prev !== '\\') inSingleQuote = false;
        } else if (inDoubleQuote) {
            current += ch;
            if (ch === '"' && prev !== '\\') inDoubleQuote = false;
        } else if (ch === "'") {
            inSingleQuote = true;
            current += ch;
        } else if (ch === '"') {
            inDoubleQuote = true;
            current += ch;
        } else if (ch === '(' || ch === '[' || ch === '{') {
            depth++;
            current += ch;
        } else if (ch === ')' || ch === ']' || ch === '}') {
            depth--;
            current += ch;
        } else if (ch === ',' && depth === 0) {
            result.push(current);
            current = '';
        } else {
            current += ch;
        }
    }

    if (current) {
        result.push(current);
    }

    return result;
}

module.exports = {
    insertSqlToMarkdown
};

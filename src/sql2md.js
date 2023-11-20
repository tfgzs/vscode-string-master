'use strict';
const _ = require('lodash');

/**
 * insert sql 转 markdown 表格
 */
function insertSqlToMarkdown(sql) {
    // 使用lodash库的split方法将sql语句按照";"分割成数组
    const sqlList = _.split(sql, ';');

    const firstSql=sqlList[0];
    // 提取表名和列名
    // const tableName = sql.match(/INTO\s+([^\s]+)/i)[1];
    const columns = firstSql.match(/\(([^)]+)\)/is)[1].split(',');

    // 构建表头
    let markdownTable = '| ';
    markdownTable += columns.join(' | ');
    markdownTable += ' |\n';

     // 构建分隔线
     let separator = '|';
     for (let i = 0; i < columns.length; i++) {
         separator += '---------|';
     }
     markdownTable += separator + '\n';

    
     // 构建值行
    sqlList.forEach(statement => {
        // 提取值
        const valuesMatch = statement.match(/VALUES\s+\(([^)]+)\)/is);
        const values = valuesMatch ? valuesMatch[1].split(',') : [];

        // 每个值一行
        if (values.length > 0) {
            markdownTable += '| ';
            markdownTable += values.map(value => value.trim()).join(' | ');
            markdownTable += ' |\n';
        }
    });

    return markdownTable;
}

module.exports = {
    insertSqlToMarkdown
}
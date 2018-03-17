//数据库操作文件

const mysql = require('mysql');
const config = require('./../../config/config.default');
const dbConfig = config.database;

const pool = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USERNAME,
    password: dbConfig.PASSWORD,
    database: dbConfig.DATABASE,
    port: dbConfig.PORT
});

let query = function (sql, values) {

    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })

};
//创建表
let createTable = function (sql) {
    return query(sql, [])
};
module.exports = {
    query
};
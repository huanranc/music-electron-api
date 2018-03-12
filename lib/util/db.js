//数据库操作文件

const mysql = require('mysql');
const config = require('./../../config/config')
const dbConfig = config.database

const pool = mysql.createPool({
  host     :  dbConfig.HOST,
  user     :  dbConfig.USERNAME,
  password :  dbConfig.PASSWORD,
  database :  dbConfig.DATABASE
})

let query = function( sql, values ) {

  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {

          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })

}


let users =
    `create table if not exists users(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     pass VARCHAR(100) NOT NULL,
     avator VARCHAR(100) NOT NULL,
     moment VARCHAR(100) NOT NULL,
     PRIMARY KEY ( id )
    );`

let createTable = ( sql ) => {
      return query( sql, [] )
}
    
  // 建表
createTable(users)

// 注册用户
let insertData = function( value ) {
  let _sql = "insert into users set name=?,pass=?,avator=?,moment=?;"
  return query( _sql, value )
}

module.exports = {
  query,
  createTable,
  insertData
}
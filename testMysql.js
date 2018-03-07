'use strict'
var mysql      = require('mysql');
var pool  = mysql.createPool({
  host : '120.77.38.20',
  user     : 'root',
  password : 'Mcc616254086',
  database : 'Reading',
  connectionLimit : 10
  //charset  : 'gbk'
});

let mySql1 = 'SELECT id, book_name, cover, book_type, author, is_show, book.book_describe from book where id in (1, 2)'
//let mySqlData1 = [row, offset]
pool.getConnection(function(err, connection) {

    connection.query(mySql1, function (error, results, fields) {
        console.log('查询1', results)
        

        if (error) throw error
    });

});  
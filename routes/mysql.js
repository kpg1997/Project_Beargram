const mysql = require('mysql');
const client = mysql.createConnection({
    host: 'beargram.cafe24app.com',
    user: 'kpg1997',
    password: 'qlalf8956!!',
    database: 'kpg1997',
    port: '3306',
});
module.exports = client;



  


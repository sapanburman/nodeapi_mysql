const mysql = require('mysql2');
const dbconfig=require('../config/credentials')
//Creating a connection pool
const dbconn = mysql.createPool({
    connectionLimit: 1000,
    host: 'localhost',
    user: 'dev',
    password: dbconfig.DB_PASS,
    database: 'TestApi',
    multipleStatements: true,
    timezone: '+05:30'
});

//Adding Connection Handling to Middleware
dbconn.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release();
    return;  
});

// Promisify for Node.js async/await.
const mysqlPool = dbconn.promise();

module.exports = mysqlPool;
// Get the client
const mariadb = require('mysql2/promise')

// Create the connection to database
const connection = async () => {
  const conn = await mariadb.createConnection({
    host: 'localhost',
    user: 'root',
    password : 'root',
    database: 'Bookstore',
    dateStrings : true
  });

  return conn;
}

module.exports = connection
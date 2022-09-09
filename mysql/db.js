let mysql = require("mysql");

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "menagerie",
});

function query(sql, callback) {
  pool.getConnection(function (err, connection) {
    connection.query(sql, function (err, rows) {
      callback(err, rows);
      connection.end();
    });
  });
}

exports.query = query;

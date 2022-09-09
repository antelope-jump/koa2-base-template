const db = require("../mysql/db.js");
const operate = (sql) => {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, data) => {
      if (err) throw reject(err);
      resolve(data);
    });
  });
};

module.exports = operate;

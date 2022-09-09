const operate = require("../utils/operater");

const insert = (data) => {
  const { name, owner, species, sex, birth, death } = data;

  let sql = `INSERT INTO pet(name, owner, species, sex, birth, death) VALUES("${name}", "${owner}", "${species}", "${sex}", "${birth}", "${death}")`;
  return operate(sql);
};

const search = () => {
  const sql = `SELECT * FROM pet`;
  return operate(sql);
};

const userFind = ({ username, password }) => {
  console.log("userFind", username, password);
  let sql = `SELECT * FROM user WHERE username="${username}"&&password="${password}"`;
  return operate(sql);
};
module.exports = { insert, search, userFind };

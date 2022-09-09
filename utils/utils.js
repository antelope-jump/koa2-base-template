const fs = require("fs");

const readFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      "./upload/7ae0ff443fcbaac95559bdb01.png",
      "utf-8",
      function (err, data) {
        if (err) {
          throw err;
        }
        resolve(data);
      }
    );
  });
};

module.exports = {
  readFile,
};

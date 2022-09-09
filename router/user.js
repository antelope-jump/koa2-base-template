const Router = require("koa-router");
const Response = require("../class/response");
let router = new Router();
const funData = require("../mysql/sql.js");
const jwt = require("jsonwebtoken"); //1、引入
const utils = require("../utils/utils");
router.get("/", async (ctx) => {
  ctx.body = new Response(200, "这里是用户主页", { name: "123" });
});

router.post("/news", async (ctx) => {
  const data = await funData.insert(ctx.request.body);
  ctx.body = new Response(200, "操作成功", { id: data.insertId });
  // fs.writeFile("./test.txt", JSON.stringify(ctx.request.body), function (err) {
  //   if (err) {
  //     throw err;
  //   }
  //   // 写入成功后读取测试
  //   fs.readFile("./test.txt", "utf-8", function (err, data) {
  //     if (err) {
  //       throw err;
  //     }
  //     console.log(data);
  //   });
  // });
});
router.get("/getpictur", async (ctx) => {
  const data = await utils.readFile();
  ctx.body = data;
});
router.get("/news/search", async (ctx) => {
  console.log(1);
  const data = await funData.search();
  // console.log(data);
  ctx.body = new Response(200, "操作成功", { list: data });
  // fs.writeFile("./test.txt", JSON.stringify(ctx.request.body), function (err) {
  //   if (err) {
  //     throw err;
  //   }
  //   // 写入成功后读取测试
  //   fs.readFile("./test.txt", "utf-8", function (err, data) {
  //     if (err) {
  //       throw err;
  //     }
  //     console.log(data);
  //   });
  // });
});
router.post("/upload", async (ctx) => {
  const data = ctx.request.files;
  const fileList = [];
  for (key in data) {
    const fileName = data[key].newFilename;
    fileList.push(fileName);
  }
  ctx.status = 200;
  ctx.body = new Response(200, "上传成功", { filepath: fileList });
});
router.get("/details", async (ctx) => {
  console.log(ctx.request.query);
  ctx.body = ctx.request.query;
});
router.post("/login", async (ctx) => {
  const { username, password } = ctx.request.body;
  const findResult = await funData.userFind({ password, username });
  console.log("findResult", findResult.length);
  if (findResult.length < 1) {
    ctx.body = {
      code: 404,
      msg: "账号不存在,请注册",
    };
  } else {
    let token = jwt.sign(
      //携带信息
      { username, password },
      "test", //秘钥
      {
        //有效期
        expiresIn: "1h", //1h一小时
      }
    );
    ctx.status = 200;
    ctx.body = {
      code: 200,
      msg: "登陆成功",
      data: {
        token,
      },
    };
  }
});

module.exports = router;

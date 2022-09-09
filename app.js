const koa = require("koa");
var Router = require("koa-router");
let home = require("./router/home.js");
let user = require("./router/user.js");
const { join } = require("path");
const koaBody = require("koa-body");
const Response = require("./class/response");
const jwt = require("jsonwebtoken"); //1、引入
const app = new koa();
const { logger } = require("./logger/index");
// 错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // console.log(err);
    ctx.response.status = err.statusCode || err.status || 500;
    ctx.response.body = new Response(500, err.message);
    // 手动释放error事件
    ctx.app.emit("error", err, ctx);
  }
});
app.use(
  koaBody({
    multipart: true,
    formidable: {
      // 上传存放的路劲
      uploadDir: join(__dirname, "upload"),
      // 保持后缀名\
      keepExtensions: true,
      // 文件大小
      maxFileSize: 1024 * 9,
      onFileBegin: (name, file) => {
        // 获取后缀, 如: .js  .txt
        // console.log(name, file);
        const reg = file.originalFilename.split(".");
        const ext = reg[reg.length - 1];
        // 修改上传文件名
        file.path = join(__dirname, "upload/") + Date.now() + ext;
      },
      onError(err) {
        // ctx.body = err;
      },
    },
  })
);
//配置koa中间件
//配置路由
let router = new Router();
const whitelist = ["/user/login"];
router.use("/user", user.routes());
router.use("/", home.routes());
app.use(async (ctx, next) => {
  // 允许所有域名请求
  ctx.set("Access-Control-Allow-Origin", "*");
  //  只允许 http://localhost:8080 域名的请求
  // ctx.set("Access-Control-Allow-Origin", "http://localhost:8080");

  // 设置允许的跨域请求方式
  ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");

  // 字段是必需的。值一个逗号分隔的字符串，表示服务器所支持的所有头信息字段.
  ctx.set(
    "Access-Control-Allow-Headers",
    "x-requested-with, accept, origin, content-type"
  );

  // 服务器收到请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，即可做出响应。

  // Content-Type表示具体请求中的媒体类型信息
  ctx.set("Content-Type", "application/json;charset=utf-8");

  // 该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。 当设置成允许请求携带凭证cookie时，需要保证"Access-Control-Allow-Origin"是服务器有的域名，而不能是"*";
  ctx.set("Access-Control-Allow-Credentials", true);

  // 该字段可选，用来指定本次预检请求的有效期，单位为秒。
  // 当请求方法是PUT或DELETE等特殊方法或者Content-Type字段的类型是application/json时，服务器会提前发送一次请求进行验证
  // 下面的的设置只本次验证的有效时间，即在该时间段内服务端可以不用进行验证
  ctx.set("Access-Control-Max-Age", 300);

  /*
  CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：
      Cache-Control、
      Content-Language、
      Content-Type、
      Expires、
      Last-Modified、
      Pragma。
  */
  // 需要获取其他字段时，使用Access-Control-Expose-Headers，
  // getResponseHeader('myData')可以返回我们所需的值
  ctx.set("Access-Control-Expose-Headers", "myData");

  await next();
});
app.use(async (ctx, next) => {
  if (whitelist.includes(ctx.request.path)) {
    await next();
  } else {
    let { authorization } = ctx.request.header; //解构
    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, "test", (err, decoded) => {
      if (err) {
        if (err.name == "TokenExpiredError") {
          //token过期
          let str = {
            iat: 1,
            exp: 0,
            msg: "token过期",
          };
          return str;
        } else if (err.name == "JsonWebTokenError") {
          //无效的token
          let str = {
            iat: 1,
            exp: 0,
            msg: "无效的token",
          };
          return str;
        }
      } else {
        return decoded;
      }
    });
    if (payload.iat < payload.exp) {
      // return true; //开始时间小于结束时间，代表token还有效
      await next();
    } else {
      ctx.body = {
        status: 50014,
        message: "token 已过期",
      };
      return false;
    }
  }
});
/*启动路由*/
app.use(router.routes());
app.use(router.allowedMethods());

app.on("error", (err, ctx) => {
  logger.error(err);
});
//监听端口
app.listen(4000, () => {
  console.log("[demo] server is starting at port 4000");
});

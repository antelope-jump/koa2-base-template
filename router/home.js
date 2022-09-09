const Router = require('koa-router');

let router = new Router();
router.get('/',async(ctx)=>{
    ctx.body="这是前台首页";
})


router.get('/news',async(ctx)=>{
    ctx.body ='这是前台新闻页面';
})
router.get('/userList',async(ctx)=>{
    ctx.body ='这里是用户列表';
})


module.exports=router;
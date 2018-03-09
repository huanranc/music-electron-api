const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const mysql = require('mysql')
const MysqlStore = require('koa-mysql-session');
const convert = require('koa-convert')
const config = require('./config/config');
const bodyParser = require('koa-bodyparser')
const koaLogger = require('koa-logger');
var cors = require('koa-cors');
const apicache = require("apicache");
const serve = require('koa-static');


const app = new Koa();
const router = new Router();

// // session存储配置
// const sessionMysqlConfig= {
//   user: config.database.USERNAME,
//   password: config.database.PASSWORD,
//   database: config.database.DATABASE,
//   host: config.database.HOST,
// }

// // 配置session中间件
// app.use(session({
//   key: 'USER_SID',
//   store: new MysqlStore(sessionMysqlConfig)
// }))

// 配置控制台日志中间件
app.use(convert(koaLogger()))

// 配置ctx.body解析中间件
app.use(bodyParser())

// 跨域设置
app.use(cors());

// app.use = serve(path.join(__dirname));

app.use(async (ctx,next) => {
  ctx.type="text/html";
  ctx.body = 'music electron';
  const proxy=ctx.query.proxy;
  if (proxy) {
    ctx.req.headers.cookie = ctx.req.headers.cookie + `__proxy__${proxy}`;
  }
  await next();
});


router.get('/',async ctx => {
  ctx.body = 'music electron';
})

// 获取专辑内容
router.get("/album", async ctx => {
  ctx.body=require("./router/album");
});

router.get('/hello',async(ctx,next)=>{
  ctx.body='hello'
})

app.use(router.routes())

const port = process.env.PORT || 3002;

app.listen(port,()=>{console.log(`localhost:${port}`)});
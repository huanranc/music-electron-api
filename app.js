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
const { createWebAPIRequestPromise } = require('./util/util');


const app = new Koa();

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

app.use(async (ctx,next) => {
  // ctx.type="text/html";
  // ctx.body = 'music electron';
  const proxy=ctx.query.proxy;
  if (proxy) {
    ctx.req.headers.cookie = ctx.req.headers.cookie + `__proxy__${proxy}`;
    ctx.res.setHeader('')
  }
  await next();
});

let home = new Router()
home.get('/',async ctx => {
  ctx.body = 'music electron';
})

let album = new Router()

// 获取专辑内容
album.get('/',async(ctx,next)=>{
  const req_cookie = ctx.cookies.get('Cookie') ? ctx.cookies.get('Cookie') : ''
  const data ={
    csrf_token: ''
  }
  const id=ctx.query.id
  // createWebAPIRequest(
  //   'music.163.com',
  //   `/weapi/v1/album/${id}`,
  //   'POST',
  //   data,
  //   cookie,
  //   music_req => {
  //     //console.log(music_req);
  //     ctx.type="json/text"
  //     ctx.body = music_req
  //   }
  // )
  const {body, cookie} = await createWebAPIRequestPromise(
    'music.163.com',
    `/weapi/v1/album/${id}`,
    'POST',
    data,
    req_cookie);
  ctx.type="application/json"

  ctx.body = body;
  console.log(cookie);
})

let top_album = new Router()

// 新碟上架
top_album.get('/',async(ctx,next)=>{
  const req_cookie = ctx.cookies.get('Cookie') ? ctx.cookies.get('Cookie') : ''
  const data ={
    offset: ctx.query.offset || 0,
    total: true,
    limit: ctx.query.limit || 50,
    csrf_token: ''
  }
  const id=ctx.query.id
  const {body, cookie} = await createWebAPIRequestPromise(
    'music.163.com',
    '/weapi/album/new',
    'POST',
    data,
    req_cookie);
  ctx.type="application/json"
  ctx.body = body;
  console.log(ctx.type);
})

let top_artists = new Router()
// 热门歌手
top_artists.get('/',async(ctx,next)=>{
  const req_cookie = ctx.cookies.get('Cookie') ? ctx.cookies.get('Cookie') : ''
  const data ={
    offset: ctx.query.offset || 0,
    total: true,
    limit: ctx.query.limit || 50,
    csrf_token: ''
  }
  const id=ctx.query.id
  const {body, cookie} = await createWebAPIRequestPromise(
    'music.163.com',
    '/weapi/artist/top',
    'POST',
    data,
    req_cookie);
  ctx.type="application/json"
  ctx.body = body;
  console.log(ctx.type);
})

let personalized = new Router()
//推荐歌单
personalized.get('/',async(ctx,next)=>{
  const req_cookie = ctx.cookies.get('Cookie') ? ctx.cookies.get('Cookie') : ''
  const data ={
    offset: ctx.query.offset || 0,
    total: true,
    limit: ctx.query.limit || 50,
    csrf_token: ''
  }
  const id=ctx.query.id
  const {body, cookie} = await createWebAPIRequestPromise(
    'music.163.com',
    '/weapi/personalized/playlist',
    'POST',
    data,
    req_cookie);
  ctx.type="application/json"
  ctx.body = body;
  console.log(ctx.type);
})

let personalized_newsonng = new Router()
//推荐新音乐
personalized_newsonng.get('/',async(ctx,next)=>{
  const req_cookie = ctx.cookies.get('Cookie') ? ctx.cookies.get('Cookie') : ''
  const data ={
    offset: ctx.query.offset || 0,
    total: true,
    limit: ctx.query.limit || 50,
    csrf_token: ''
  }
  const id=ctx.query.id
  const {body, cookie} = await createWebAPIRequestPromise(
    'music.163.com',
    '/weapi/personalized/newsong',
    'POST',
    data,
    req_cookie);
  ctx.type="application/json"
  ctx.body = body;
  console.log(ctx.type);
})


let top_playlist_highquality = new Router()
//获取精品歌单
top_playlist_highquality.get('/',async(ctx,next)=>{
  const req_cookie = ctx.cookies.get('Cookie') ? ctx.cookies.get('Cookie') : ''
  const data ={
    cat: ctx.query.cat || '全部',
    offset: ctx.query.offset || 0,
    limit: ctx.query.limit || 20,
    csrf_token: ''
  }
  const id=ctx.query.id
  const {body, cookie} = await createWebAPIRequestPromise(
    'music.163.com',
    '/weapi/playlist/highquality/list',
    'POST',
    data,
    req_cookie);
  ctx.type="application/json"
  ctx.body = body;
  console.log(ctx.type);
})

let playlist_detail = new Router()
//获取歌单详情
playlist_detail.get('/',async(ctx,next)=>{
  const req_cookie = ctx.cookies.get('Cookie') ? ctx.cookies.get('Cookie') : ''
  const data ={
    id: ctx.query.id,
    n: 100000,
    csrf_token: ''
  }
  const id=ctx.query.id
  const {body, cookie} = await createWebAPIRequestPromise(
    'music.163.com',
    `/api/playlist/detail?id=${id}`,
    'POST',
    data,
    req_cookie);
  ctx.type="application/json"
  ctx.body = body;
  console.log(ctx.type);
})

let search = new Router()
//搜索
search.get('/',async(ctx,next)=>{
  const req_cookie = ctx.cookies.get('Cookie') ? ctx.cookies.get('Cookie') : ''
  const data ={
    offset: ctx.query.offset || 0,
    limit: ctx.query.limit || 20,
    s: ctx.keywords,
    tyep: ctx.type|| 1,
    csrf_token: ''
  }
  const id=ctx.query.id
  const {body, cookie} = await createWebAPIRequestPromise(
    'music.163.com',
    '/weapi/search/get',
    'POST',
    data,
    req_cookie);
  ctx.type="application/json"
  ctx.body = body;
  console.log(ctx.type);
})

let router = new Router();

router.use('/',home.routes(),home.allowedMethods())
router.use('/album',album.routes(),album.allowedMethods())
router.use('/top/album',top_album.routes(),top_album.allowedMethods())
router.use('/top/artists',top_artists.routes(),top_artists.allowedMethods())
router.use('/personalized',personalized.routes(),personalized.allowedMethods())
router.use('/personalized/newsong',personalized_newsonng.routes(),personalized_newsonng.allowedMethods())
router.use('/top/playlist/highquality',top_playlist_highquality.routes(),top_playlist_highquality.allowedMethods())
router.use('/playlist/detail',playlist_detail.routes(),playlist_detail.allowedMethods())
router.use('/search',search.routes(),search.allowedMethods())

app.use(router.routes()).use(router.allowedMethods())

const port = process.env.PORT || 3000

app.listen(port,()=>{console.log(`localhost:${port}`)});
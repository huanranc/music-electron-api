const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const mysql = require('mysql');
const MysqlStore = require('koa-mysql-session');
const session = require('koa-session-minimal');
const convert = require('koa-convert');
const config = require('./config/config');
let bodyParser = require('koa-bodyparser');
const koaLogger = require('koa-logger');
let cors = require('koa-cors');
const userModel = require('./lib/util/db');
const { query } = require('./lib/util/db');
const { createWebAPIRequestPromise } = require('./util/util');


const app = new Koa();

// 配置存储session信息的mysql
let store = new MysqlStore({
  user: 'root',
  password: 'root',
  database: 'music_electron',
  host: 'localhost',
});

// 使用session中间件
app.use(session({
  key: 'SESSION_ID'
}));


// 配置控制台日志中间件
app.use(convert(koaLogger()));

// 配置ctx.body解析中间件
app.use(bodyParser());

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

let home = new Router();
home.get('/',async ctx => {
  ctx.body = 'music electron';
});

let album = new Router();

// 获取专辑内容
album.get('/',async(ctx,next)=>{
  const req_cookie = ctx.cookies.get('Cookie') ? ctx.cookies.get('Cookie') : ''
  const data ={
    csrf_token: ''
  };
  const id=ctx.query.id;
  const {body, cookie} = await createWebAPIRequestPromise(
    'music.163.com',
    `/weapi/v1/album/${id}`,
    'POST',
    data,
    req_cookie);
  ctx.type="application/json";

  ctx.body = body;
  console.log(cookie);
});

let top_album = new Router();

// 新碟上架
top_album.get('/',async(ctx,next)=>{
  const req_cookie = ctx.cookies.get('Cookie') ? ctx.cookies.get('Cookie') : ''
  const data ={
    offset: ctx.query.offset || 0,
    total: true,
    limit: ctx.query.limit || 50,
    csrf_token: ''
  };
  const id=ctx.query.id;
  const {body, cookie} = await createWebAPIRequestPromise(
    'music.163.com',
    '/weapi/album/new',
    'POST',
    data,
    req_cookie);
  ctx.type="application/json";
  ctx.body = body;
  console.log(ctx.type);
});

let top_artists = new Router();
// 热门歌手
top_artists.get('/',async(ctx,next)=>{
  const req_cookie = ctx.cookies.get('Cookie') ? ctx.cookies.get('Cookie') : '';
  const data ={
    offset: ctx.query.offset || 0,
    total: true,
    limit: ctx.query.limit || 50,
    csrf_token: ''
  };
  const id=ctx.query.id;
  const {body, cookie} = await createWebAPIRequestPromise(
    'music.163.com',
    '/weapi/artist/top',
    'POST',
    data,
    req_cookie);
  ctx.type="application/json";
  ctx.body = body;
  console.log(ctx.type);
});

let artists = new Router();
// 歌手榜
artists.get('/',async(ctx,next)=>{
  const req_cookie = ctx.cookies.get('Cookie') ? ctx.cookies.get('Cookie') : ''
  const data ={
    offset: ctx.query.offset || 0,
    total: true,
    limit: ctx.query.limit || 50,
    csrf_token: ''
  };
  const id=ctx.query.id;
  const {body, cookie} = await createWebAPIRequestPromise(
    'music.163.com',
    '/eapi/toplist/artist?params=B5CAE4715306477C2EFA74D383640F01BF227BF8E889F80E2E2A442958463A7E589CC99878CFCE88D165B64712332AF39EC61B7E68903B2F9F079E8D1AB99FC61049A6D5B97AF8E6FFE8DA16ED540D2CFA80205B889ACA39F8B05AE593FDF5A094F118FF4600C2025094ECF6EB58F6D424B7A97B21A8C1D7CF0609AF2FBE9FDD88826E1667C889757BA920684C5C425FF01B5514AF1EB08AB7D298DB4D65187829E315F9FFBBEB43C2AE3DC21222B31CEC6FF337957AC122FBCB3E793FC1960151B0BDEBB1565BFD835E7A7D6A2D034A5591070D42C32DA4B69E0061C46D61239221A1C64EF676D891B44D7B855E27C82A7EB376F0B0C27952F2006E302B47DA1DE86C3488D53FD98ED9FDC6AA341DF0ECF92BA2E8F77E41811BF9447973C5C34FFED13E28AC544347F9E6ADF4B0008C371FC41C4490D3C9E1A225791D2170326231C40662633AA93D5CEF9AABC777AF268A4B13C560157339478DFAD5D910C966B43E1F017410DBF06D189E2BD6D0CD2682F343A83994E66CA73B5E2A67A122842BF945F2B434CBDE4C5A589A3A90F70DF1A8B63E7BAFBEB624956C62CFB1114AB841379541E5BB4625F2C28CAEA6A67E77A7EEAA1149D9D0F7E190D3A3408DF88B62FBF27996ABC925A93E5A67B4B0D1D931214BB07064F2BA4DCBA2E548E5A110E9B992C21E3930EB488172929C02C06D76BB193EF923D1906E0A0C4D75F5EB909AE77B0A2E55539A182D0B2533C654F2C90A038406B8850BFC022639F2B3FB7EDF40FD74AEA0B9119E9987D2909C01C587794F53459DB8EE83AA8D15FBEAC71EB3A00D8E40E78FE9A9A4068495D9257B39D8F825086F391FD5E7A48AACA96BC261E334A1929C81633234A0B22C573AEAD05BC8B4216283ACFD9E022950AEC812F554B913B4457FDF68AA2CC5E476922C2670D49154BC1DEB6D464F60DBFAD2BB4144762CD3721F52D42FDAE56DB9C529EDB6FB946CD725B3E2EA2AFDCF3F759D384B4F7F75AAA6F01F8093C8A140B3B388FF57272A6A7E10274290A79CDCA69E37BC066CE8CCD5B4BB4E12DA841B',
    'POST',
    data,
    req_cookie);
  ctx.type="application/json";
  ctx.body = body;
});

let personalized = new Router();

//推荐歌单
personalized.get('/',async(ctx,next)=>{
  const req_cookie = ctx.cookies.get('Cookie') ? ctx.cookies.get('Cookie') : '';
  const data ={
    offset: ctx.query.offset || 0,
    total: true,
    limit: ctx.query.limit || 50,
    csrf_token: ''
  };
  const id=ctx.query.id;
  const {body, cookie} = await createWebAPIRequestPromise(
    'music.163.com',
    '/weapi/personalized/playlist',
    'POST',
    data,
    req_cookie);
  ctx.type="application/json";
  ctx.body = body;
  console.log(ctx.type);
});

let personalized_newsonng = new Router();
//推荐新音乐
personalized_newsonng.get('/',async(ctx,next)=>{
  const req_cookie = ctx.cookies.get('Cookie') ? ctx.cookies.get('Cookie') : '';
  const data ={
    offset: ctx.query.offset || 0,
    total: true,
    limit: ctx.query.limit || 10,
    csrf_token: ''
  };
  const id=ctx.query.id;
  const {body, cookie} = await createWebAPIRequestPromise(
    'music.163.com',
    '/weapi/personalized/newsong',
    'POST',
    data,
    req_cookie);
  ctx.type="application/json";
  ctx.body = body;
  console.log(ctx.type);
});


let top_playlist_highquality = new Router();
//获取精品歌单
top_playlist_highquality.get('/',async(ctx,next)=>{
  const req_cookie = ctx.cookies.get('Cookie') ? ctx.cookies.get('Cookie') : '';
  const data ={
    cat: ctx.query.cat || '全部',
    offset: ctx.query.offset || 0,
    limit: ctx.query.limit || 20,
    csrf_token: ''
  };
  const id=ctx.query.id;
  const {body, cookie} = await createWebAPIRequestPromise(
    'music.163.com',
    '/weapi/playlist/highquality/list',
    'POST',
    data,
    req_cookie);
  ctx.type="application/json";
  ctx.body = body;
  console.log(ctx.type);
});

let playlist_detail = new Router();
//获取歌单详情
playlist_detail.get('/',async(ctx,next)=>{
  const req_cookie = ctx.cookies.get('Cookie') ? ctx.cookies.get('Cookie') : ''
  const data ={
    id: ctx.query.id,
    offset: 0,
    total: true,
    limit: 1000,
    n: 1000,
    csrf_token: ''
  };
  const id=ctx.query.id;
  const {body, cookie} = await createWebAPIRequestPromise(
    'music.163.com',
    '/weapi/v3/playlist/detail',
    'POST',
    data,
    req_cookie);
  ctx.type="application/json";
  ctx.body = body;
  console.log(ctx.type);
});

let search = new Router();
//搜索 type:1 单曲  10 专辑 100歌手 1000歌单
search.get('/',async(ctx,next)=>{
  const req_cookie = ctx.cookies.get('Cookie') ? ctx.cookies.get('Cookie') : '';
  const keywords = ctx.query.keywords;
  const type = ctx.query.type || 1;
  const limit = ctx.query.limit || 30;
  const offset = ctx.query.offset || 0;
  const data ={
    limit,
    type,
    s: keywords,
    offset,
    csrf_token: ''
  };
  const id=ctx.query.id;
  const {body, cookie} = await createWebAPIRequestPromise(
    'music.163.com',
    '/weapi/search/get',
    'POST',
    data,
    req_cookie);
  ctx.type="application/json";
  ctx.body = body;
});

let lyric = new Router();
//获取歌词
lyric.get('/',async(ctx,next)=>{
  const req_cookie = ctx.cookies.get('Cookie') ? ctx.cookies.get('Cookie') : '';
  const data ={
    csrf_token: ''
  };
  const id=ctx.query.id;
  const {body, cookie} = await createWebAPIRequestPromise(
    'music.163.com',
    `/weapi/song/lyric?os=osx&id=${id}&lv=-1&kv=-1&tv=-1`,
    'POST',
    data,
    req_cookie);
  ctx.type="application/json";
  ctx.body = body;
  console.log(ctx.type);
});

//登录
let login = new Router();
login.post('/',async(ctx,next) => {
  console.log(ctx.request.body);
  let _sql=`
  SELECT * from m_users
    where username="${ctx.request.body.username}"
    limit 1`;
    let result = await query(_sql);
    if(result.length>0) {
      ctx.body="已注册";
      if(ctx.request.body.password===result[0].password) {
        ctx.cookies.set('user_id',result[0].id);
        ctx.session = {
          user_id:result[0].id
        };
        ctx.body="success"
      } else {
        ctx.body="failed"
      }
    } else {
      ctx.body="未注册"
    }
});

//注册
let register = new Router();
register.post('/', async(ctx, next) => {
  console.log(ctx.request.body);
  const username = ctx.request.body.username;
  let sql=`SELECT * FROM m_users WHERE username='${username}'`;
  const dataAll =  await query( sql);
  if(dataAll.length>0) {
    ctx.body="用户名存在了"
  }
  else {
    let email='';
    if (ctx.request.body.email) {
      email = ctx.request.body.email;
    }
    let time =Math.round(new Date().getTime()/1000).toString();
    console.log(time);
    let data = await query(`INSERT INTO m_users (username, password, email, reg_time)
    VALUES(
      '${username}',
      '${ctx.request.body.password}',
      '${email}',
      ${time})`
    );
    console.log(data);
      ctx.body="成功"
  }
});

//用户歌单
let user_list=new Router();
user_list.get('/', async(ctx, next) => {
  ctx.body="用户歌单"
});




let router = new Router();

router.use('/',home.routes(),home.allowedMethods());
router.use('/album',album.routes(),album.allowedMethods());
router.use('/top/album',top_album.routes(),top_album.allowedMethods());
router.use('/top/artists',top_artists.routes(),top_artists.allowedMethods());
router.use('/toplist/artist',artists.routes(),artists.allowedMethods());
router.use('/personalized',personalized.routes(),personalized.allowedMethods());
router.use('/personalized/newsong',personalized_newsonng.routes(),personalized_newsonng.allowedMethods());
router.use('/top/playlist/highquality',top_playlist_highquality.routes(),top_playlist_highquality.allowedMethods());
router.use('/playlist/detail',playlist_detail.routes(),playlist_detail.allowedMethods());
router.use('/search',search.routes(),search.allowedMethods());
router.use('/lyric',lyric.routes(),lyric.allowedMethods());

router.use('/login',login.routes(),login.allowedMethods());
router.use('/register',register.routes(),register.allowedMethods());

router.use('/user/list',user_list.routes(),user_list.allowedMethods());

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3000;

app.listen(port,()=>{console.log(`localhost:${port}`)});

//参考 https://github.com/Binaryify/NeteaseCloudMusicApi/blob/master/util/util.js
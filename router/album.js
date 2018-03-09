const Koa = require('koa');
const Router = require('koa-router');

const { createWebAPIRequest } = require('../util/util');

let router = new Router();

router.get('/album',async(ctx,next)=>{
  const data ={
    csrf_token: ''
  }
  const id=ctx.query.id
  createWebAPIRequest(
    'music.163.com',
    `/weapi/v1/album/${id}`,
    'POST',
    data,
    music_req => {
      ctx.req.send(music_req)
    },
    err => ctx.req.status(502).send('fetch error')
  )
  await next();
})

module.exports = router
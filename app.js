const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

app.use(async (ctx,next) => {
  // ctx.type="text/html";
  // ctx.body = 'music electron';
  await next();
});

router.get('/',async ctx => {
  ctx.body = 'music electron';
})

router.get('/test:id',async(ctx,next)=>{
  var id=ctx.params.id;
  ctx.body=`test${id}`
})

router.get('/hello',async(ctx,next)=>{
  ctx.body='hello'
})
app.use(router.routes())

const port = process.env.PORT || 3000;

app.listen(port,()=>{console.log(`localhost:${port}`)});
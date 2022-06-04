import Koa from 'koa'
import 'dotenv/config'

const app = new Koa();

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// response
app.use(async ctx => {
  const result = await fetch(
    process.env.API_URL ?? ''
  )
  .then(res => res.json())
  .catch(error => {
    console.error(error)

    return '请求异常'
  })
  console.log('result: ', result)

  ctx.body = result;
});

app.listen(3000);
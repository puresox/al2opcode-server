const Router = require('koa-router');
const al2code = require('./al2code');

const router = new Router();

router
  .get('/', async (ctx) => {
    await ctx.render('index');
  })
  .post('/', async (ctx) => {
    const { input } = ctx.request.body;
    const inputLines = input.split('\r\n');
    const outputLines = [];
    inputLines.forEach((line) => {
      if (line) {
        outputLines.push(al2code(line));
      }
    });
    await ctx.render('result', {
      outputLines,
    });
  });

module.exports = router;

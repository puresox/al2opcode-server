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
    let error = '';
    try {
      inputLines.forEach((line) => {
        if (line) {
          outputLines.push(al2code(line));
        }
      });
    } catch (err) {
      if (!err.message.includes('无法识别') && !err.message.includes('进制转换溢出')) {
        error = '请提交规范代码！';
      } else {
        error = err.message;
      }
    }
    await ctx.render('result', {
      outputLines,
      error,
    });
  });

module.exports = router;

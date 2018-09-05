const router = require('koa-router')()
var NeihanModel = require('../model/Neihan');

router.prefix('/neihan');

router.get('/', async (ctx, next) => {
  let messages = await NeihanModel.find().limit(20).sort({_id:-1});
  ctx.body= {messages:messages}
})

module.exports = router

const router = require('koa-router')()
var NeihanModel = require('../model/Neihan');

router.prefix('/neihan');

router.get('/', async(ctx, next) => {
    let page = ctx.request.query.page || 1
    let messages = await NeihanModel.find().skip((page-1) * 20).limit(20).sort({createAt: -1});
    ctx.body = {messages: messages}
})

module.exports = router

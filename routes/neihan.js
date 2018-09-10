const router = require('koa-router')()
var NeihanModel = require('../model/Neihan');

router.prefix('/neihan');

router.get('/', async(ctx, next) => {
    let page = ctx.request.query.page || 1
    let id = ctx.request.query.id || 0
    let type = ctx.request.query.type || ""
    if (type && type == "share") {
        let messages = await NeihanModel.find({
            _id: {$gte: id},
            source: "neihan"
        }).skip((page - 1) * 20).limit(20).sort({createAt: -1});
    } else {
        let messages = await NeihanModel.find({
            _id: {$gt: id},
            source: "neihan"
        }).skip((page - 1) * 20).limit(20).sort({createAt: -1});
    }
    ctx.body = {messages: messages}
})

module.exports = router

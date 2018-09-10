const router = require('koa-router')()
var NeihanModel = require('../model/Neihan');
var version = require('../conf/proj.json').version;

router.prefix('/neihan');

router.get('/', async(ctx, next) => {
    let page = ctx.request.query.page || 1
    let id = ctx.request.query.id
    let type = ctx.request.query.type || ""
    if (type && type == "share") {
        var messages = await NeihanModel.find({
            _id: {$gte: id},
            source: "neihan"
        }).skip((page - 1) * 20).limit(20).sort({createAt: -1});
    } else {
        if (id) {
            var messages = await NeihanModel.find({
                _id: {$gt: id},
                source: "neihan"
            }).skip((page - 1) * 20).limit(20).sort({createAt: -1});
        } else {
            var messages = await NeihanModel.find({source: "neihan"}).skip((page - 1) * 20).limit(20).sort({createAt: -1});
        }
    }
    ctx.body = {messages: messages,version:version}
})

module.exports = router

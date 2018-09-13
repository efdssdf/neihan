const router = require('koa-router')()
var NeihanModel = require('../model/Neihan');

router.prefix('/neihan');

router.get('/', async(ctx, next) => {
    let page = ctx.request.query.page || 1
    let id = ctx.request.query.id
    let type = ctx.request.query.type || ""
    let arr = [];
    let soureArr = ["neihan","gaoxiaogif","jiefu"]
    if (id && type && type == "share") {
        var share_message = await NeihanModel.find({_id: id, source: "neihan"});
        let res = JSON.parse(JSON.stringify(share_message));
        res[0].page = page
        arr.push(res[0])
    }
    var messages = await NeihanModel.find({source: {$in:soureArr}}).skip((page - 1) * 20).limit(20).sort({createAt: 1});
    for (var message of messages) {
        let res = JSON.parse(JSON.stringify(message));
        res.page = page
        arr.push(res)
    }
    ctx.body = {messages: arr, version: "1.0.1"}
})

module.exports = router

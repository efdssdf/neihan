const router = require('koa-router')()
var NeihanModel = require('../model/Neihan');

router.prefix('/neihan');

router.get('/', async(ctx, next) => {
    let page = ctx.request.query.page || 1
    let id = ctx.request.query.id
    let type = ctx.request.query.type || ""
    let arr = [];
    if (type && type == "share") {
        var messages = await NeihanModel.find({
            _id: {$gte: id},
            source: "neihan"
        }).skip((page - 1) * 20).limit(20).sort({createAt: -1});
        for(var message of messages){
            let res = JSON.parse(JSON.stringify(message));
            res.page = page
            arr.push(res)
        }
    } else {
        if (id) {
            var messages = await NeihanModel.find({
                _id: {$gt: id},
                source: "neihan"
            }).skip((page - 1) * 20).limit(20).sort({createAt: -1});
            for(var message of messages){
                let res = JSON.parse(JSON.stringify(message));
                res.page = page
                arr.push(res)
            }
        } else {
            var messages = await NeihanModel.find({source: "neihan"}).skip((page - 1) * 20).limit(20).sort({createAt: -1});
            for(var message of messages){
                let res = JSON.parse(JSON.stringify(message));
                res.page = page
                arr.push(res)
            }
        }
    }
    ctx.body = {messages: arr,version:"1.0.0"}
})

module.exports = router

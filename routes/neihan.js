const router = require('koa-router')()
var NeihanModel = require('../model/Neihan');
var ad = require('../conf/ad.json')

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
    if(messages.length>=20){
        for (var message of messages) {
            let res = JSON.parse(JSON.stringify(message));
            res.page = page
            arr.push(res)
        }
        arr.splice(4,0,ad.ad1)
        arr.splice(11,0,ad.ad2)
        arr.splice(18,0,ad.ad3)
    }else{
        for (var message of messages) {
            let res = JSON.parse(JSON.stringify(message));
            res.page = page
            arr.push(res)
        }
        arr.code = "end"
    }
    ctx.body = {messages: arr,code:arr.code, version: "1.0.2"}
})


router.get('/test', async(ctx, next) => {
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
    if(messages.length>=20){
        for (var message of messages) {
            let res = JSON.parse(JSON.stringify(message));
            res.page = page
            arr.push(res)
        }
        // arr.splice(4,0,ad.ad1)
        // arr.splice(11,0,ad.ad2)
        // arr.splice(18,0,ad.ad3)
    }else{
        for (var message of messages) {
            let res = JSON.parse(JSON.stringify(message));
            res.page = page
            arr.push(res)
        }
        arr.code = "end"
    }
    ctx.body = {messages: arr,code:arr.code, version: "1.0.2"}
})

module.exports = router

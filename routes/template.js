const router = require('koa-router')()
var mem = require('../util/mem')
var wechat = require('../util/wechat')
var UserModel = require('../model/User');

router.prefix('/template');

router.post('/form', async(ctx, next) => {
    let code = ctx.request.body.code || "1"
    let wxcode = ctx.request.body.wxcode
    let formid = ctx.request.body.formid
    let openid = await wechat.getOpenid(code, wxcode)
    console.log(code, wxcode, formid, openid, '------------------------------code')
    if (openid) {
        await UserModel.update({openid: openid, code: code}, {
                $addToSet: {
                    formIds: {
                        formid: formid,
                        createAt: Date.now()
                    }
                }
            }, {upsert: true}
        )
    }
    ctx.body = {}
});

router.get('/send', async(ctx, next) => {
    let code = ctx.request.query.code || "1"
    let templateCode = ctx.request.query.templateCode || "1"
    let page = ctx.request.query.page
    let values = JSON.parse(ctx.request.query.values)
    let users = await UserModel.find({code: code});
    for (let user of users) {
        for (let formid of user.formIds) {
            if (Date.now() - formid.createAt < 7 * 24 * 1000) {
                await wechat.sendTemplateMessage(code, templateCode, user.openid, formid.formid, page, values)
                await UserModel.update({openid: user.openid, code: code}, {$pull: {formIds: {formid: formid}}})
                break
            } else {
                await UserModel.update({openid: user.openid, code: code}, {$pull: {formIds: {formid: formid}}})
            }
        }
    }
    ctx.body = {}
})

module.exports = router

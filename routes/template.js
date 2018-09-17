const router = require('koa-router')()
var mem = require('../util/mem')
var wechat = require('../util/wechat')
let weichat_conf = require('../conf/weichat.json');
var UserModel = require('../model/User');

router.prefix('/template');

router.post('/form', async(ctx, next) => {
    let code = ctx.request.body.code || "1"
    let wxcode = ctx.request.body.wxcode
    let formid = ctx.request.body.formid
    console.log(formid,'-----------------------------formid')
    let openid = await wechat.getOpenid(code, wxcode)
    await UserModel.findOneAndUpdate({openid: openid,code:code}, {$addToSet: {formIds: {formid: formid, createAt: Date.now()}}})
});

router.get('/send', async(ctx, next) => {
    let code = ctx.request.query.code || "1"
    let templateCode = ctx.request.query.templateCode || "1"
    let values = ctx.request.query.values
    let users = await UserModel.find({code:code});
    for (let user of users) {
        for (let formid of user.formIds) {
            if (Date.now() - formid.createAt < 7 * 24 - 1000) {
                wechat.sendTemplateMessage(templateCode, user.openid, formid.formid, values)
                UserModel.update({openid:user.openid},{$pull:{formIds:{formid:formid}}})
            }else{
                UserModel.update({openid:user.openid},{$pull:{formIds:{formid:formid}}})
            }
        }
    }
})

module.exports = router

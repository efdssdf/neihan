const koa2Req = require('koa2-request');
const mem = require('./mem');
const weichat_conf = require('../conf/wechat.json');
const template_conf = require('../conf/template.json');
const UserModel = require('../model/User');
const request = require('superagent');

async function getAccessToken(code) {
    // let token = await mem.get('mp_access_token_' + code);
    // if (!token) {
        let conf = weichat_conf[code];
        let url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + conf.appid + "&secret=" + conf.appsecret
        let res = await koa2Req(url)
        let data = JSON.parse(res.body)
        token = data.access_token
        await mem.set('mp_access_token_' + code, token, (data.expires_in - 60))
        return token
    // } else {
    //     return token
    // }
}

async function getOpenid(code, wxcode) {
    let conf = weichat_conf[code];
    let url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + conf.appid + "&secret=" + conf.appsecret + "&js_code=" + wxcode + "&grant_type=authorization_code"
    let res = await koa2Req(url)
    let data = JSON.parse(res.body)
    let openid = data.openid
    if (openid) {
        await UserModel.update({openid: openid}, {code: code, wxcode: wxcode},{upsert: true})
    }
    return openid
}

async function sendTemplateMessage(code, templateCode, openid, formid, page, values) {
    let token = await getAccessToken(code)
    let temp_conf = template_conf[templateCode]
    let url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + token
    console.log(url,'--------------------------url')
    let data = {
        "touser": openid,
        "template_id": temp_conf.template_id,
        "form_id": formid,
        "page": page,
        "data": values,
        "emphasis_keyword":"keyword1.DATA"
    }
    console.log(data,'--------------------------data')
    // let res = await koa2Req.post({url: url, data: data})
    let res = await request.post(url).send(data).end()
    console.log(res.body,'-------------------------res')
    return null
}

async function uploadTempMedia(code, filename) {
    let token = await getAccessToken(code)
    var url = 'https://api.weixin.qq.com/cgi-bin/media/upload?access_token=' + token + '&type=image'
    let formData = {
        media: {
            value: fs.createReadStream(__dirname + '/img'),
            options: {
                filename: filename,
                contentType: 'image/jpeg'
            }
        }
    }
    let res = koa2Req.post({url: url, formData: formData})
}

module.exports = {
    getOpenid: getOpenid,
    sendTemplateMessage: sendTemplateMessage,
    uploadTempMedia: uploadTempMedia
}
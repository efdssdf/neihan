let koa2Req = require('koa2-request');
let mem = require('./mem');
let weichat_conf = require('../conf/wechat.json');
let template_conf = require('../conf/template.json');

async function getAccessToken(code) {
    let token = await mem.get('mp_access_token_' + code);
    if (!token) {
        let conf = weichat_conf[code];
        let url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + conf.appid + "&secret=" + conf.appsecret
        let res = await koa2Req(url)
        let data = JSON.parse(res.body)
        token = data.access_token
        await mem.set('mp_access_token_' + code, token, (data.expires_in - 60))
        return token
    } else {
        return token
    }
}

async function getOpenid(code, wxcode) {
    let conf = weichat_conf[code];
    let url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + conf.appid + "&secret=" + conf.appsecret + "&code=" + wxcode + "&grant_type=authorization_code"
    let res = await koa2Req(url)
    let data = JSON.parse(res.body)
    let openid = data.openid
    return openid
}

async function sendTemplateMessage(code, openid, formid, page, values) {
    let token = await getAccessToken(code)
    let temp_conf = template_conf[code]
    let url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + token
    let data = {
        access_token: token,
        touser: openid,
        template_id: temp_conf.template_id,
        form_id: formid,
        page: page,
        data: values
    }
    let res = await koa2Req.post({url: url, form: data})
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
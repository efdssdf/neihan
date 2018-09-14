var NeihanModel = require('../model/Neihan');
var http = require('http');
var koa2Req = require('koa2-request');
var sizeOf = require('image-size');
var async = require('async');

var sleep = function (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    })
};

async function filter() {
    let arrSource = ["neihan", "gaoxiaogif", "jiefu"];
    let delArr = []
    let messages = await NeihanModel.find({"source": "gaoxiaogif"})
    // let messages = await NeihanModel.find({source: {$in: arrSource}, createAt: {$gte: Date.now() / 1000 - 2 * 3600}})
    async.eachLimit(messages, 1, async function (message, callback) {
        if (message.source == "neihan") {
            var res = await koa2Req(message.thumbnail)
            if (res && res.statusCode != 200) {
                delArr.push(message._id)
            }
        } else {
            var res = await koa2Req(message.thumbnail)
            if (res && res.statusCode != 200) {
                console.log(res.statusCode, '--------------status')
                delArr.push(message._id)
            } else {
                http.get(message.thumbnail, function (response) {
                    var chunks = [];
                    response.on('data', function (chunk) {
                        chunks.push(chunk);
                    }).on('end', function () {
                        var buffer = Buffer.concat(chunks);
                        try {
                            if (buffer && sizeOf(buffer).width < 300) {
                                console.log(sizeOf(buffer).width, "----------------------width")
                                delArr.push(message._id)
                            }
                        } catch (e) {
                            console.log(e, '-------------------e')
                            delArr.push(message._id)
                        }
                    }).setTimeout(30000, function () {
                        delArr.push(message._id)
                    });
                });
            }
        }
        await sleep(2000)
        callback(null)
    }, function (err) {
        NeihanModel.remove({_id: {$in: delArr}}, function (err, data) {
        })
    })
}
async function del() {
    let messages = await NeihanModel.find({"source": "jiefu"})
    var arr = []
    async.eachLimit(messages, 1, function (message, callback) {
        if (message.thumbnail.indexOf('gif') != -1) {
            // console.log(message.thumbnail,'------------------------------')
            arr.push(message._id)
        }
        callback(null)
    }, function (err) {
        console.log(arr.length, '--------------------')
        // NeihanModel.remove({_id: {$in: arr}}, function (err, data) {
        //     console.log(data)
        // })
    })
}
filter()
// del()
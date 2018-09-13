var NeihanModel = require('../model/Neihan');
var koa2Req = require('koa2-request');
var http = require('http');
var sizeOf = require('image-size');
var schedule = require("node-schedule");
var async = require('async');

var sleep = function (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    })
};

async function filter() {
    let arrSource = ["neihan","gaoxiaogif","jiefu"];
    let delArr = []
    // let messages = await NeihanModel.find({"source": "jiefu"})
    let messages = await NeihanModel.find({source: {$in: arrSource}, createAt: {$gte: Date.now() / 1000 - 2 * 3600}})
    async.eachLimit(messages, 1, async function (message, callback) {
        try {
            if (message.source == "neihan") {
                var res = await koa2Req(message.thumbnail)
                if (res && res.statusCode != 200) {
                    delArr.push(message._id)
                }
            } else {
                var res = await koa2Req(message.thumbnail)
                if (res && res.statusCode != 200) {
                    delArr.push(message._id)
                } else {
                    http.get(message.thumbnail, function (response) {
                        var chunks = [];
                        response.on('data', function (chunk) {
                            chunks.push(chunk);
                        }).on('end', function () {
                            var buffer = Buffer.concat(chunks);
                            if (buffer && sizeOf(buffer).width < 320) {
                                delArr.push(message._id)
                            }
                        }).setTimeout(10000, function () {
                            delArr.push(message._id)
                        });
                    });
                }
            }
        } catch (e) {
            delArr.push(message._id)
        }
        await sleep(2000)
        callback(null)
    }, function (err) {
        NeihanModel.remove({_id: {$in: delArr}}, function (err, data) {
        })
    })
}

var rule = new schedule.RecurrenceRule();
var times = [20];
rule.hour = times;
var j = schedule.scheduleJob(rule, async function () {
    console.log('过滤图片');
    await filter()
});
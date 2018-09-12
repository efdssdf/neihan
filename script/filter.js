var NeihanModel = require('../model/Neihan');
var koa2Req = require('koa2-request');
var http = require('http');
var sizeOf = require('image-size');
var schedule = require("node-schedule");

var sleep = function (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    })
};

async function filter() {
    // let messages = await NeihanModel.find({"source": "jiefu"}).sort({createAt: -1})
    let messages = await NeihanModel.find({createAt: {$gte: Date.now()/1000 - 2 * 3600}})
    for (var i of messages) {
        console.log(i.thumbnail)
        var res = await koa2Req(i.thumbnail)
        if (res && res.statusCode != 200) {
            await NeihanModel.findByIdAndDelete(i._id)
        }
    }
    return;
}

async function filterSize() {
    let arrSource = ["gaoxiaogif"];
    // let messages = await NeihanModel.find({"source": "jiefu"}).sort({createAt: -1})
    let messages = await NeihanModel.find({source: {$in:arrSource},createAt: {$gte: Date.now()/1000 - 2 * 3600}})
    for (var i of messages) {
        http.get(i.thumbnail, function (response) {
            var chunks = [];
            response.on('data', function (chunk) {
                chunks.push(chunk);
            }).on('end', async function () {
                var buffer = Buffer.concat(chunks);
                if (buffer && sizeOf(buffer).width < 320) {
                    await NeihanModel.findByIdAndDelete(i._id)
                }
            }).setTimeout(10000, async function(){
                await NeihanModel.findByIdAndDelete(i._id)
            });
        });
        await sleep(2000)
    }
    return;
}

var rule = new schedule.RecurrenceRule();
var times = [20];
rule.hour = times;
var j = schedule.scheduleJob(rule, async function () {
    console.log('过滤图片');
    await filter()
    await filterSize()
});
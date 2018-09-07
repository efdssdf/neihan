var NeihanModel = require('../model/Neihan');
var koa2Req = require('koa2-request');
var schedule = require("node-schedule");

async function filter() {
    let messages = await NeihanModel.find({createAt: {$lt: Date.now()/1000 - 2 * 3600}})
    for(var i of messages){
        var res = await koa2Req(i.thumbnail)
        if(res.statusCode!=200){
            await NeihanModel.findByIdAndDelete(i._id)
        }
    }
}

var rule = new schedule.RecurrenceRule();
var times = [20];
rule.hour = times;
var j = schedule.scheduleJob(rule, function () {
    console.log('过滤图片');
    filter()
});
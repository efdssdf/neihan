var NeihanModel = require('../model/Neihan');
var http = require('http');
var sizeOf = require('image-size');

var sleep = function (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    })
};

async function filter() {
    let messages = await NeihanModel.find({"source": "gaoxiaogif"})
    for (var i of messages) {
        console.log(i.thumbnail,'-------')
        http.get(i.thumbnail, function (response) {
            var chunks = [];
            response.on('data', function (chunk) {
                chunks.push(chunk);
            }).on('end', async function () {
                var buffer = Buffer.concat(chunks);
                if (sizeOf(buffer).width < 320) {
                    console.log(sizeOf(buffer).width,'------------')
                    await NeihanModel.findByIdAndDelete(i._id)
                }
            });
        });
        await sleep(200)
    }
}
filter()
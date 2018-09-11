var NeihanModel = require('../model/Neihan');
var http = require('http');
var sizeOf = require('image-size');

async function filter() {
    let messages = await NeihanModel.find({"source": "gaoxiaogif"})
    for (var i of messages) {
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
    }
}
filter()
var mongoose = require('mongoose');
// mongoose.set('debug',true)
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').fuwu_mongodb;
var db = mongoose.createConnection(connect_url);

var NeihanSchema = new Schema({
    title: String,
    thumbnail: String,
    createAt: Number
});


var NeihanModel = db.model('Neihan', NeihanSchema);

module.exports = NeihanModel;
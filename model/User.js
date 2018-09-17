var mongoose = require('mongoose');
// mongoose.set('debug',true)
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var UserSchema = new Schema({
    openid: String,
    code:String,
    formIds:Array
});

var UserModel = db.model('User', UserSchema);

module.exports = UserModel;
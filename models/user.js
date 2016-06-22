/**
 * @author: Jason.友伟 zhanyouwei@meitunmama.com
 * Created on 16/5/31.
 */

var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;

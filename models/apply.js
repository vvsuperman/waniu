/**
 * @author: Jason.占友伟 zhanyouwei@icloud.com
 * Created on 16/5/28.
 */

var mongoose = require('mongoose');
var ApplySchema = require('../schemas/apply');
var ApplyModel = mongoose.model('apply', ApplySchema);

module.exports = ApplyModel;

/**
 * @author: Jason.占友伟 zhanyouwei@icloud.com
 * Created on 16/5/28.
 */

var mongoose = require('mongoose');
var IndustrySchema = require('../schemas/industry');
var IndustryModel = mongoose.model('industry', IndustrySchema);

module.exports = IndustryModel;


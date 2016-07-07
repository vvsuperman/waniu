/**
 * @author: Jason.友伟 zhanyouwei@meitunmama.com
 * Created on 16/7/5.
 * id 自增模型
 */

var mongoose = require('mongoose');
var IncIdSchema = require('../schemas/incId');
var IncIdModel = mongoose.model('incId', IncIdSchema);

module.exports = IncIdModel;

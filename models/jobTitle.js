var mongoose = require('mongoose');
var JobTitleSchema = require('../schemas/jobTitle');
var JobTitle = mongoose.model('JobTitle', JobTitleSchema);

module.exports = JobTitle;


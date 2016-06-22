var mongoose = require('mongoose');
var JobTypeSchema = require('../schemas/jobType');
var JobType = mongoose.model('JobType', JobTypeSchema);

module.exports = JobType;


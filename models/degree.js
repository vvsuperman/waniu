var mongoose = require('mongoose');
var DegreeSchema = require('../schemas/degree');
var Degree = mongoose.model('Degree', DegreeSchema);

module.exports = Degree;


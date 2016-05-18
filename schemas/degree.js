var mongoose = require('mongoose');


var degreeSchema = new mongoose.Schema({
	
    name:String,    							    //职位名称
	
	
	meta: {
		createdAt: {
			type: Date,
			default: Date.now()
		},

		updatedAt: {
			type: Date,
			default: Date.now()
		}
	}
});


degreeSchema.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createdAt = this.meta.updatedAt = Date.now();
	} else {
		this.meta.updatedAt = Date.now();
	}

	console.log("save jobtitle...........");

	next();
})

degreeSchema.statics = {
	fetch: function(callback) {
		return this.find({}).sort('meta.updatedAt').exec(callback);
	},

	findById: function(id, callback) {
		return this.findOne({_id: id}).exec(callback);
	}
}

module.exports = degreeSchema;

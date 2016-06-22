var mongoose = require('mongoose');


var JobTypeSchema = new mongoose.Schema({

    name:String,    							    //职位名称
    weight:{type:Number,default:0},    //权重，用于调整顺序


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


JobTypeSchema.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createdAt = this.meta.updatedAt = Date.now();
	} else {
		this.meta.updatedAt = Date.now();
	}

	console.log("save jobtype...........");

	next();
})

JobTypeSchema.statics = {
	fetch: function(callback) {
		return this.find({}).sort('meta.updatedAt').exec(callback);
	},

	findById: function(id, callback) {
		return this.findOne({_id: id}).exec(callback);
	}
}

module.exports = JobTypeSchema;

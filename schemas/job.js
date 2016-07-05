var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


var JobSchema = new mongoose.Schema({
  id: String,         //职位id
  jobType: {type: ObjectId, ref: 'JobType'},         //职位id
  jobTitle: String,         //职位名称
  industry: {type: ObjectId, ref: 'industry'},         //行业id
  minSalary: Number,                    				//最小薪水
  maxSalary: Number,     							    //最大薪水
  city: String,           							//期望城市
  degree: String,	        	//学历要求
  attraction: [],         							    //职位诱惑
  description: String,    							    //职位描述
  weight: {type: Number, default: 0},    //权重，用于置顶
  isRemove: {type: Number, default: 0},    //删除标记，用于标记是否被删除
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


JobSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }

  console.log("save job...........");

  next();
});

JobSchema.statics = {
  fetch: function (callback) {
    return this.find({}).sort('meta.updatedAt').exec(callback);
  },

  findById: function (id, callback) {
    return this.findOne({_id: id}).exec(callback);
  }
};

module.exports = JobSchema;

/**
 * @author: Jason.占友伟 zhanyouwei@icloud.com
 * Created on 16/5/28.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var ApplySchema = new mongoose.Schema({
  name: String,    							          //申请者姓名
  phone: String,    							          //申请者手机号
  city: String,    							          //申请者所在城市
  job: {type: ObjectId, ref: 'Job'},         //职位id
  isCheck: {type: Number, default: 0},         //查看标记, 0 未查看

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

ApplySchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }

  next();
});

ApplySchema.statics = {
  fetch: function (callback) {
    return this.find({}).sort('meta.updatedAt').exec(callback);
  },

  findById: function (id, callback) {
    return this.findOne({_id: id}).exec(callback);
  }
};

module.exports = ApplySchema;

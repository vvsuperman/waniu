/**
 * @author: Jason.占友伟 zhanyouwei@icloud.com
 * Created on 16/5/28.
 */
var mongoose = require('mongoose');


var IndustrySchema = new mongoose.Schema({

  name: String,    							      //行业名称
  weight: {type: Number, default: 0},     //权重，用于调整顺序


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


IndustrySchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }

  next();
});

IndustrySchema.statics = {
  fetch: function (callback) {
    return this.find({}).sort('meta.updatedAt').exec(callback);
  },

  findById: function (id, callback) {
    return this.findOne({_id: id}).exec(callback);
  }
};

module.exports = IndustrySchema;

/**
 * @author: Jason.友伟 zhanyouwei@meitunmama.com
 * Created on 16/7/5.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var IncIdSchema = new mongoose.Schema({
  name: {type: String},                      // 集合名
  currentId: {type: Number, default: 1},     // 当前ID
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

IncIdSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }

  next();
});

IncIdSchema.statics = {
  fetch: function (callback) {
    return this.find({}).sort('meta.updatedAt').exec(callback);
  },

  findById: function (id, callback) {
    return this.findOne({_id: id}).exec(callback);
  }
};

module.exports = IncIdSchema;

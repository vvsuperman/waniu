/**
 * @author: Jason.友伟 zhanyouwei@icloud.com
 * Created on 16/5/31.
 */

var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  nickname: String,    							          //昵称
  pass: String,    							              //密码

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

UserSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }

  next();
});

UserSchema.statics = {
  fetch: function (callback) {
    return this.find({}).sort('meta.updatedAt').exec(callback);
  },

  findById: function (id, callback) {
    return this.findOne({_id: id}).exec(callback);
  }
};

module.exports = UserSchema;

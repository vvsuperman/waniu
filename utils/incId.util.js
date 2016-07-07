/**
 * @author: Jason.占友伟 zhanyouwei@icloud.com
 * Created on 16/7/5.
 */

var Job = require('../models/job');
var IncIdModel = require('../models/incId');
IncIdModel.remove({}, function(err) {
  console.log('collection removed');
});
var incIdModel = new IncIdModel({
  name: 'job',
  currentId: 1000000
});
incIdModel.save();
Job.find({}, function (err, jobList) {
  if (err) {
    console.log(err);
    return;
  }
  jobList.forEach(function (job) {
    IncIdModel.findOneAndUpdate(
      {name: 'job'},
      {$inc: {'currentId': 1}},
      {new: true, upsert: true},
      function (err, updatedIdentity) {
        if (err) return next(err);

        job.id = updatedIdentity.currentId;

        job.save(function (error, doc) {
          if (error) {
            console.log(error);
          }
          console.log(doc._id + '==============>' + doc.id);
        });
      }
    );
  });
});

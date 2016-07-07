/**
 * @author: Jason.占友伟 zhanyouwei@icloud.com
 * Created on 16/7/5.
 */

var Job = require('../models/job');
var IncIdModel = require('../models/incId');
Job.find({}, function (err, jobList) {
  if (err) {
    console.log(err);
    return;
  }
  jobList.forEach(function (job) {
    if (!job.id) {
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
    }
  });
});

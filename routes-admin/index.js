/**
 * @author: Jason.友伟 zhanyouwei@icloud.com
 * Created on 16/5/16.
 */

var express = require('express');
var router = express.Router();
var Job = require('../models/job');
var JobType = require('../models/jobType');
var IndustryModel = require('../models/industry');
var ApplyModel = require('../models/apply');
var UserModel = require('../models/user');
var IncIdModel = require('../models/incId');
var Degree = require('../models/degree');
var routerFilter = require('../libs/router.filter');
var async = require('async');
var crypto = require('crypto');
var _ = require('lodash');

var pageSize = 10;

router.get('/waniuadmin', routerFilter.authorize, function (req, res, next) {
  var key = req.query.key ? req.query.key.trim() : '';
  var page = req.query.page ? req.query.page - 1 : 0;
  var startNum = page * pageSize;

  var queryData = {
    "isRemove": {$ne: 1},
    $or: [
      {'description': {'$regex': key, $options: '$i'}},
      {'city': {'$regex': key, $options: '$i'}},
      {'name': {'$regex': key, $options: '$i'}}]
  };
  async.parallel([
    function (callback) {
      Job.find(queryData)
        .populate('jobType', 'name')
        .populate('industry', 'name')
        .sort({weight: -1})
        .skip(startNum)
        .limit(pageSize)
        .exec(function (err, results) {
          if (err) {
            callback(err);
            return;
          }
          async.each(results, function (item, childCallback) {
            ApplyModel.find({job: item._id}).exec(function (childError, childResults) {
              if (childError) {
                childCallback(childError);
              } else {
                item.applyList = childResults.length;
                item.newApplyList = 0;
                childResults.forEach(function (childResultsItem) {
                  if (!childResultsItem.isCheck) {
                    item.newApplyList += 1;
                  }
                });
                childCallback(null);
              }
            });
          }, function (eachErr) {
            if (eachErr) {
              next(eachErr);
            } else {
              callback(null, results);
            }
          });
        });
    },
    function (callback) {
      Job.find({}, function (err, results) {
        if (err) {
          callback(err);
          return;
        }
        callback(null, results);
      });
    }
  ], function (err, results) {
    if (err) {
      next(err);
      return;
    }

    res.render("admin/index", {
      jobs: results[0],
      pageData: {
        total: results[1].length,
        currentPage: page + 1,
        totalPage: Math.ceil(results[1].length / pageSize)
      }
    });
  });
});

router.get('/newjob', routerFilter.authorize, function (req, res, next) {
  async.parallel([
    function (callback) {
      JobType.find({})
        .sort({weight: -1})
        .exec(function (err, results) {
          if (err) {
            callback(err);
            return;
          }
          callback(null, results);
        });
    },
    function (callback) {
      IndustryModel.find({}, function (err, results) {
        if (err) {
          callback(err);
          return;
        }
        callback(null, results);
      });
    }
  ], function (err, results) {
    if (err) {
      next(err);
      return;
    }
    res.render("admin/newjob", {jobType: results[0], industry: results[1]});
  });

});

router.get('/editjob/:id', routerFilter.authorize, function (req, res, next) {
  async.parallel([
    function (callback) {
      Job.find({_id: req.params.id})
        .populate('jobType', 'name')
        .populate('industry', 'name')
        .exec(function (err, results) {
          if (err) {
            callback(err);
            return;
          }
          callback(null, results);
        });
    },
    function (callback) {
      JobType.find({}, function (err, results) {
        if (err) {
          callback(err);
          return;
        }
        callback(null, results);
      });
    },
    function (callback) {
      IndustryModel.find({}, function (err, results) {
        if (err) {
          callback(err);
          return;
        }
        callback(null, results);
      });
    }
  ], function (err, results) {
    if (err) {
      next(err);
      return;
    }
    if (results[0].length) {
      var data = {job: results[0][0], jobType: results[1], industry: results[2]};
      res.render('admin/editjob', data);
    } else {
      res.render('404');
    }
  });
});

router.get('/lookjob/:id', routerFilter.authorize, function (req, res, next) {

  console.log('lookjob...........',req.params.id);
  Job.find({_id: req.params.id})
    .populate('jobType', 'name')
    .populate('industry', 'name')
    .exec(function (err, results) {
      if (err) {
        console.log(err);
        next(err);
        return;
      }
      res.render('admin/lookjob', {job: results[0]});
    });
});

router.get('/candidate', routerFilter.authorize, function (req, res) {
  res.render("admin/candidate");
});

router.get('/applylist/:id', routerFilter.authorize, function (req, res, next) {
  var page = req.query.page ? req.query.page - 1 : 0;
  if (page < 0) {
    page = 0;
  }
  var startNum = page * pageSize;

  async.parallel([
    function (callback) {
      ApplyModel
        .find({job: req.params.id})
        .populate('job')
        .skip(startNum)
        .limit(pageSize)
        .exec(function (err, results) {
          if (err) {
            callback(err);
            return;
          }
          callback(null, results);
        });
    },
    function (callback) {
      Job
        .find({_id: req.params.id})
        .populate('jobType', 'name')
        .populate('industry', 'name')
        .exec(function (err, results) {
          if (err) {
            callback(err);
            return;
          }
          callback(null, results);
        });
    },
    function (callback) {
      ApplyModel.find({job: req.params.id}, function (err, results) {
        if (err) {
          callback(err);
          return;
        }
        callback(null, results);
      });
    }
  ], function (err, results) {
    if (err) {
      next(err);
      return;
    }
    if (results[1].length) {
      res.render('admin/applylist', {
        applyList: results[0],
        job: results[1][0],
        pageData: {
          total: results[2].length,
          currentPage: page + 1,
          totalPage: Math.ceil(results[2].length / pageSize)
        }
      });
      ApplyModel.update({job: results[1][0]._id}, {$set: {isCheck: 1}}, {multi: true}, function (update_err, update_count) {
      });
    } else {
      res.render('404');
    }
  });

});

router.get('/reportforms', routerFilter.authorize, function (req, res, next) {
  var jobTitle = req.query.jobTitle ? req.query.jobTitle.trim() : '';
  var city = req.query.city ? req.query.city.trim() : null;
  var workExperience = req.query.workExperience ? req.query.workExperience.trim() : null;

  var page = req.query.page ? req.query.page - 1 : 0;
  var startNum = page * pageSize;
  var queryData = {};
  var queryParams = [];
  if (city) {
    queryParams.push({'city': {'$regex': city}});
  }
  if (workExperience) {
    queryParams.push({'workExperience': {'$regex': workExperience}});
  }
  if (queryParams.length) {
    queryData.$or = queryParams;
  }

  async.parallel([
    function (callback) {
      ApplyModel.find(queryData)
        .populate('job', 'jobTitle', {jobTitle: {$regex: jobTitle}})
        .sort({weight: -1})
        .skip(startNum)
        .limit(pageSize)
        .exec(function (err, results) {
          if (err) {
            callback(err);
            return;
          }
          callback(null, results);
        });
    },
    function (callback) {
      ApplyModel.find({}, function (err, results) {
        if (err) {
          callback(err);
          return;
        }
        callback(null, results);
      });
    }
  ], function (err, results) {
    if (err) {
      next(err);
      return;
    }
    results[0] = _.filter(results[0], function (item) {
      return item.job != null;
    });
    res.render('admin/report-forms', {
      applyList: results[0],
      pageData: {
        total: results[1].length,
        currentPage: page + 1,
        totalPage: Math.ceil(results[1].length / pageSize)
      }
    });
  });
});

//职位置顶
router.post('/job/top', routerFilter.authorize, function (req, res) {
  var id = req.body.id;
  if (id === undefined) {
    res.status(400).send({code: 400, message: '参数错误,id不存在!'});
    return false;
  } else {
    Job.findById(id, function (err, job) {
      if (job === undefined) {
        res.status(400).send({code: 400, message: '职位不存在!'});
        return false;
      }
      //找到weight值最大的那个
      Job.findOne({})
        .sort({weight: -1})
        .exec(function (err, wJob) {
          job.weight = wJob.weight + 1;
          job.save(function (err, rtJob) {
            if (err) {
              res.status(500).send({code: 500, message: '保存数据错误!'});
            } else {
              //res.json({state: 0, job: rtJob});
              res.send(rtJob);
            }
          });
        });
    })
  }
});

//职位新增
router.post('/job', routerFilter.authorize, function (req, res, next) {
  var reqJob = req.body.job;


  if (reqJob === undefined || reqJob.jobTitle === undefined || reqJob.jobType === undefined || reqJob.minSalary === undefined
    || reqJob.city === undefined || reqJob.industry === undefined) {

    res.status(400).send({code: 400, message: '输入均不得为空'});

    return false;
  }

  IncIdModel.findOneAndUpdate(
    {name: 'job'},
    {$inc: {'currentId': 1}},
    {new: true, upsert: true},
    function (err, updatedIdentity) {
      if (err) return next(err);

      var job = new Job({
        id: updatedIdentity.currentId,
        jobTitle: reqJob.jobTitle,               //职位id
        jobType: reqJob.jobType,                 //职位id
        industry: reqJob.industry,               //所属行业id
        minSalary: reqJob.minSalary,             //最小薪水
        maxSalary: reqJob.maxSalary,             //最大薪水
        city: reqJob.city,                       //期望城市
        degree: reqJob.degree,                   //学历要求
        attraction: reqJob.attraction,           //职位诱惑
        description: reqJob.description
      });

      job.save(function (error, pJob) {
        if (error) {
          res.status(500).send({code: 500, message: '保存job异常'});
        }
        res.send(pJob);
      });
    }
  );

});

//删除职位
router.delete('/job', routerFilter.authorize, function (req, res) {
  var jobId = req.body.jobId;
  if (jobId === undefined) {
    res.status(400).send({code: 400, message: '参数错误'});
    return false;
  }

  Job.findById(jobId, function (err, job) {

    // 未找到该id

    if (job === undefined) {
      res.status(400).send({code: 400, message: '该job不存在'});

      return false;
    }
    job.isRemove = 1;

    //是否可以直接存，通过id reqJob.save?
    job.save(function (error, pJob) {
      if (err) {
        res.status(500).send({code: 500, message: '删除失败, 请稍后重试!'});
      } else {
        res.send();
      }
    });
  });
});

//职位修改
router.put('/job', routerFilter.authorize, function (req, res) {

  var reqJob = req.body;

  if (reqJob.id === undefined) {
    res.status(400).send({code: 400, message: 'id不得为空'});
    return false;
  }


  Job.findById(reqJob.id, function (err, job) {

    // 未找到该id

    if (job === undefined) {
      res.status(400).send({code: 400, message: '该job不存在'});

      return false;
    }
    job.jobTitle = reqJob.jobTitle;
    job.jobType = reqJob.jobType;
    job.industry = reqJob.industry;
    job.minSalary = reqJob.minSalary;
    job.maxSalary = reqJob.maxSalary;
    job.city = reqJob.city;
    job.degree = reqJob.degree;
    job.attraction = reqJob.attraction;
    job.description = reqJob.description;

    //是否可以直接存，通过id reqJob.save?
    job.save(function (error, pJob) {
      if (error) {
        res.status(500).send({code: 500, message: '修改job异常'});
      }
      res.send(pJob);
    });

  })
});


router.get('/testmd5',function(req,res,next){

  console.log(crypto.createHash('md5').update("admin123!*@898_+@)*ap}|").digest('hex'));

})

router.get('/login', function (req, res, next) {
  res.render('admin/login');
});
router.post('/dologin', function (req, res) {
  console.log(req.body);
  if (req.body.nickname === '' || req.body.pass === '') {
    res.status(400).send({code: 400, message: '登录失败,用户名或密码不能为空!'});
    return;
  }

  var pwd = crypto.createHash('md5').update(req.body.pass+"!*@898_+@)*ap}|").digest('hex');

  UserModel.findOne({nickname: req.body.nickname, pass: pwd}, function (err, result) {
    if (err) {
      res.status(500).send({code: 500, message: '登录失败,服务器忙,请稍后重试!'});
      return;
    }
    if (result === null) {
      res.status(400).send({code: 400, message: '登录失败,用户名或密码错误!'});
    } else {
      req.session.user = {
        nickname: result.nickname
      };
      console.log(req.session);
      res.redirect('/admin/waniuadmin');
    }
  });

});

module.exports = router;

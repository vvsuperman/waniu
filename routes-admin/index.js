/**
 * @author: Jason.友伟 zhanyouwei@icloud.com
 * Created on 16/5/16.
 */

var express = require('express');
var router = express.Router();
var Job = require('../models/job');
var JobTitle = require('../models/jobTitle');
var IndustryModel = require('../models/industry');
var ApplyModel = require('../models/apply');
var Degree = require('../models/degree');
var async = require('async');

var pageSize = 2;

router.get('/waniuadmin', function (req, res, next) {
  var queryData = {};
  if (req.query.search) {
    //TODO: 方维 添加搜索功能
  }
  var page = req.query.page ? req.query.page - 1 : 0;
  var startNum = page * pageSize;

  async.parallel([
    function (callback) {
      Job.find(queryData)
        .populate('jobTitle', 'name')
        .populate('industry', 'name')
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

router.get('/newjob', function (req, res, next) {
  async.parallel([
    function (callback) {
      JobTitle.find({}, function (err, results) {
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
    res.render("admin/newjob", {jobTitle: results[0], industry: results[1]});
  });

});

router.get('/editjob/:id', function (req, res, next) {
  async.parallel([
    function (callback) {
      Job.find({_id: req.params.id})
        .populate('jobTitle', 'name')
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
      JobTitle.find({}, function (err, results) {
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
      var data = {job: results[0][0], jobTitle: results[1], industry: results[2]};
      res.render('admin/editjob', data);
    } else {
      res.render('404');
    }
  });
});

router.get('/lookjob/:id', function (req, res, next) {
  Job.find({_id: req.params.id})
    .populate('jobTitle', 'name')
    .populate('industry', 'name')
    .exec(function (err, results) {
      if (err) {
        next(err);
        return;
      }
      res.render('admin/lookjob', {job: results[0]});
    });
});

router.get('/candidate', function (req, res) {
  res.render("admin/candidate");
});

router.get('/applylist/:id', function (req, res, next) {
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
        .populate('jobTitle', 'name')
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
    } else {
      res.render('404');
    }
  });

});

//职位置顶
router.post('/job/top', function (req, res) {
  var id = req.body.id;
  if (id === undefined) {
    res.sendStatus(400);
    res.send({code: 400, message: '参数错误,id不存在!'});
    return false;
  } else {
    Job.findById(id, function (err, job) {
      if (job === undefined) {
        res.sendStatus(400);
        res.send({code: 400, message: '职位不存在!'});
        return false;
      }
      //找到weight值最大的那个
      Job.findOne({})
        .sort({weight: -1})
        .exec(function (err, wJob) {
          job.weight = wJob.weight + 1;
          job.save(function (err, rtJob) {
            if (err) {
              res.sendStatus(500);
              res.send({code: 500, message: '保存数据错误!'});
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
router.post('/job', function (req, res) {


  var reqJob = req.body.job;


  if (reqJob === undefined || reqJob.jobTitle === undefined || reqJob.minSalary === undefined
    || reqJob.city === undefined || reqJob.industry === undefined) {

    res.sendStatus(400);
    res.send({code: 400, message: '输入均不得为空'});

    return false;
  }

  var job = new Job({
    jobTitle: reqJob.jobTitle,          //职位id
    industry: reqJob.industry,          //所属行业id
    minSalary: reqJob.minSalary,         //最小薪水
    maxSalary: reqJob.maxSalary,         //最大薪水
    city: reqJob.city,                 //期望城市
    degree: reqJob.degree,                 //学历要求
    attraction: reqJob.attraction,           //职位诱惑
    description: reqJob.description
  });

  job.save(function (error, pJob) {
    if (error) {
      res.sendStatus(500);
      res.send({code: 500, message: '保存job异常'});
    }
    res.send(pJob);
  });
});

//职位修改
router.put('/job', function (req, res) {

  var reqJob = req.body;

  if (reqJob.id === undefined) {
    res.sendStatus(400);
    res.send({code: 400, message: 'id不得为空'});
    return false;
  }


  Job.findById(reqJob.id, function (err, job) {

    // 未找到该id

    if (job === undefined) {
      res.sendStatus(400);
      res.send({code: 400, message: '该job不存在'});

      return false;
    }

    job.jobTitle = reqJob.jobTitle;
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
        res.sendStatus(500);
        res.send({code: 500, message: '修改job异常'});
      }
      res.send(pJob);
    });

  })
});


module.exports = router;

/**
 * @author: Jason.友伟 zhanyouwei@icloud.com
 * Created on 16/5/16.
 */

var express = require('express');
var router = express.Router();

router.get('/waniuadmin', function (req, res) {
  res.render("admin/index");
});

router.get('/newjob', function (req, res) {
  res.render("admin/newjob");
});

//职位修改
router.put('/job', function (req, res) {

  var reqJob = req.body.job;

  if (reqJob.id === undefined) {

    res.json({
      state: 1,
      msg: 'id不得为空'
    })
    return false;
  }


  Job.findById(reqJob.id, function (err, job) {

    // 未找到该id

    if (job === undefined) {

      res.json({
        state: 1,
        msg: '该job不存在'
      })

      return false;
    }

    job.jobTitle = reqJob.jobTitle;
    job.minSalary = reqJob.minSalary;
    job.maxSalary = reqJob.maxSalary;
    job.city = reqJob.city;
    job.degree = reqJob.degree;
    job.attraction = reqJob.attraction;
    job.description = reqJob.description;

    //是否可以直接存，通过id reqJob.save?
    job.save(function (error, pJob) {
      if (error) console.log(error);
      res.json({
        state: 0,
        job: pJob
      })
    });

  })
});

//职位新增
router.post('/job', function (req, res) {

  var reqJob = req.body.job;

  if(reqJob===undefined || reqJob.jobTitle=== undefined || reqJob.minSalary === undefined
    || reqJob.city === undefined ){

    res.json({

      state: 1,
      msg: '输入均不得为空'

    })

    return false;
  }


  var job = new Job({

    jobTitle: reqJob.jobTitle,          //职位id
    minSalary: reqJob.minSalary,         //最小薪水
    maxSalary: reqJob.maxSalary,         //最大薪水
    city: reqJob.city,                 //期望城市
    degree: reqJob.degree,                 //学历要求
    attraction: reqJob.attraction,           //职位诱惑
    description: reqJob.description,

  });

  job.save(function (error, pJob) {

    if (error) console.log(error);

    res.json({
      state: 0,
      job: pJob
    })
  });


});

module.exports = router;

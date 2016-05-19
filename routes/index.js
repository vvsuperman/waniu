  var express = require('express');
  var router = express.Router();
  var mongoose = require('mongoose');
  var underscore = require('underscore');
  var request = require('request');

  var http = require("http");

  var unirest = require('unirest');
  var httpinvoke = require('httpinvoke');
  var async = require("async");

  var Schema = mongoose.Schema;
  var ObjectId = Schema.Types.ObjectId;

  var Job = require('../models/job');
  var JobTitle = require('../models/jobTitle');
  var Degree = require('../models/degree');

  var pageSize = 10; //每页十条记录


  //TODO: 数据库连接最好不要放在路由中,放在控制器中比较合适
  //mongoose.connect('mongodb://localhost:12345/waniudb');
  mongoose.connect('mongodb://localhost:27017/waniudb');

  router.get('/', function (req, res) {
    res.render("index");
  });



  //职位修改
  router.put('/job', function (req, res) {

     var reqJob = req.body.job;

     if(reqJob.id === undefined){

          res.json({
            state: 1,
            msg: 'id不得为空'
          })
          return false;
     }  




    Job.findById(reqJob.id, function (err, job) {

        // 未找到该id

        if(job === undefined){
           
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
  })




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

  //查询所有的职位名称
  router.get('/jobTitle', function (req, res) {

    JobTitle.find({}, function (err, jobTitles) {

      if (err) console.log(err);

      res.json({
        state: 0,
        jobTitles: jobTitles
      });
    });
  });



  //职位查询
  router.get('/job/:pageNum', function (req, res) {

    var pageNum = req.params.pageNum;

    if (pageNum === undefined) {

      res.json({
        state: 1,
        msg: '页数不得为空'
      });

      return false;
    }

    Job.find({})
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .exec(function (err, jobs) {
        if (err) console.log(err);

        res.json({
          state: 0,
          jobs: jobs
        })
      })

  });




  router.get('/login', function (req, res, next) {
    res.render('login');
  });

  module.exports = router;

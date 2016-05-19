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

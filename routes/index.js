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
var ApplyModel = require('../models/apply');
var Degree = require('../models/degree');
var hex = require('./hex');

var pageSize = 10; //每页十条记录


//TODO: 数据库连接最好不要放在路由中,放在控制器中比较合适
//mongoose.connect('mongodb://localhost:12345/waniudb');
mongoose.connect('mongodb://localhost:27017/waniudb');




//生成微信签名
router.post('/wsjsdk',function(req,res){
  var url = req.body.url;
  console.log('url.......',url);
  var APPID = "wxaae5c90f87df2f1b";
  var APPSECRET = "00aafd2544f3ed2ff9f4111e327cc97a";
  var targetUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+APPID+'&secret='+APPSECRET;  

  request.get(targetUrl, function(err,response,body) {  
    var rt ={}  
    rt.token =  eval('(' + body+ ')').access_token;
    var ticketUrl = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="+rt.token+"&type=jsapi";

    request.get(ticketUrl, function(err,response,body) {  

      rt.token = eval('(' + body+ ')').ticket;    

      console.log('ticket.........',rt.token);  

      var pArray = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
      rt.nonce_arr = "";
      for(var i=0;i<10;i++){
       rt.nonce_arr += pArray.charAt(Math.floor( Math.random() * pArray.length ));
     }
     rt.timestamp = Date.parse(new Date());
     var jsapi_ticket_arr = "jsapi_ticket=" + rt.token + '&noncestr=' + rt.nonce_arr + '&timestamp=' +
     rt.timestamp + '&url=' + url;                       
     rt.jsapi_ticket = hex.hex_sha1(jsapi_ticket_arr);
     rt.appId = APPID;                 
     res.json({state:0,result:rt});
   })                   
  })   
})



router.get('/', function (req, res) {
  Job.find({})
    .populate('jobTitle', 'name')
    .sort({weight: -1})
    .skip(0)
    .limit(20)
    .exec(function (err, results) {
      if (err) {
        next(err);
        return;
      }
      res.render("index", {jobs: results});
    });

});


router.post('/search', function (req, res) {
  var key = req.body.key;
  if (key === undefined) {
    res.json({state: 1, msg: 'key不可为空'});
    return false;
  }

  var keys = [];
  keys = key.split(/\s./);


  async.map(keys, function (key, callback) {

    //分别对description, city, jobTitle使用正则
    async.parallel([
      // description正则
      function (cbParal) {
        Job.find({'description': {'$regex': key}})
          .populate('jobTitle', 'name')
          .exec(function (err, jobs) {
            console.log(jobs);
            cbParal(null, jobs);
          })
      },
      //对city使用正则
      function (cbParal) {
        Job.find({'city': {'$regex': key}})
          .populate('jobTitle', 'name')
          .exec(function (err, jobs) {
            cbParal(null, jobs);
          })
      },
      //对jobTitle使用正则
      function (cbParal) {
        JobTitle.find({'name': {'$regex': key}})
          .populate('jobTitle', 'name')
          .exec(function (err, jobTitles) {
            if (jobTitles.length == 0) {
              cbParal(null);
            } else {
              //分别对所有匹配的jobtitles使用正则
              async.map(jobTitles, function (jobTitle, cbAs) {
                Job.find({jobTitle: jobTitle}, function (err, jobs) {
                  cbAs(null, jobs);
                })
              }, function (err, results) {
                cbParal(null, results);
              })
            }
          })
      }], function (err, results) {
      callback(null, results);
    });
  }, function (err, results) {
    var rtResult = [];
    //递归处理数组数据，将所有的job放到返回数组中去
    function getResult(a) {
      if (a instanceof Array) {
        if (a.length > 0) {
          for (var i in a) {
            getResult(a[i])
          }
        }
      } else {
        if (a != null) {
          rtResult.push(a);
        }
      }
    }

    getResult(results);
    res.json(rtResult)
  });

});


//查询所有的职位名称
router.get('/jobTitle', function (req, res) {

  JobTitle.find({})
    .sort({weight: -1})
    .exec(function (err, jobTitles) {

      if (err) console.log(err);

      res.json({
        state: 0,
        jobTitles: jobTitles
      });
    });
});

//职位详细信息查询
router.get('/job/:id', function (req, res) {
  var id = req.params.id;

  if (id === undefined) {
    res.json({state: 1, msg: 'id不可为空'});
    return false;
  }

  Job.findById(id, function (err, job) {

    if (err) {
      console.log(err);
      res.json({state: 1, msg: '获取数据错误'});
      return false;
    } else {

      if (job === undefined) {
        res.json({state: 1, msg: '职位不存在'});
        return false;
      } else {
        res.json({state: 0, job: job})
      }
    }


  })

});


//职位列表查询
router.get('/jobs/:pageNum', function (req, res) {

  var pageNum = req.params.pageNum;

  if (pageNum === undefined) {
    res.sendStatus(400);
    res.send({code: 400, message: '参数错误,页数不得为空!'});
    return false;
  }

  Job.find({})
    .populate('jobTitle', 'name')
    .sort({weight: -1})
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .exec(function (err, jobs) {
      if (err) {
        res.sendStatus(500);
        res.send({code: 500, message: '服务器错误,获取数据失败!'});
      } else {
        res.send(jobs);
      }
    })
});

router.post('/applyjob', function (req, res, next) {
  var reqData = req.body;
  if (reqData.name === undefined || reqData.phone === undefined
    || reqData.city === undefined) {
    res.sendStatus(400);
    res.send({code: 400, message: '输入均不得为空'});
    return false;
  }

  var applyModel = new ApplyModel({
    name: reqData.name,
    phone: reqData.phone,
    city: reqData.city,
    job: reqData.jobId
  });

  applyModel.save(function (err, result) {
    if (err) {
      res.sendStatus(500);
      res.send({code: 500, message: '服务器忙,请稍后重试'});
    }
    res.send(result);
  });
});


module.exports = router;

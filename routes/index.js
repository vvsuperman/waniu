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


//服务器mongodb端口号为12345
//TODO: 数据库连接最好不要放在路由中,放在控制器中比较合适
//mongoose.connect('mongodb://localhost:12345/waniudb');
mongoose.connect('mongodb://localhost:27017/waniudb');

router.get('/', function (req, res) {
  res.render("index");
});



//增加或修改职位
router.get('/job/add', function(req,res){
    var reqJob = req.body.job;


    // if(reqJob===undefined || reqJob.jobTitle=== undefined || reqJob.minSalary === undefined
    // 	|| reqJob.city === undefined )

    //无id为新增
    if(reqJob.id === undefined){

    	var job = new Job({
			
			jobTitle: reqJob.jobTitle ,          //职位id
			minSalary: reqJob.minSalary,         //最小薪水
			maxSalary: reqJob.maxSalary,         //最大薪水
			city: req.city,           			 //期望城市
		    degree: req.degree,	        	     //学历要求
		    attraction:req.attraction,         	 //职位诱惑
		    description:req.description,    

		});

		zonePrice.save(function(error, pJob) {
			if (error) console.log(error);		
			res.json({
				state:0,
				job:pJob
			})
		});	

    }else{

        Job.findById(reqJob.id, function(err, job){
        		
        		job.jobTitle = reqJob.jobTitle;
        		job.minSalary = reqJob.minSalary;
        		job.maxSalary = reqJob.maxSalary;
        		job.city = reqJob.city;
        		job.degree = reqJob.degree;
        		job.attraction = reqJob.attraction;
        		job.description = reqJob.description;

        		//是否可以直接存，通过id reqJob.save?
        		job.save(function(error, pJob) {
					if (error) console.log(error);	
					res.json({
						state:0,
						job:pJob
			        })	
				});	

        })

    }
  

})

//查询职位名称
router.get('jobTitle/find', function(req,res){
      JobTitle.find({}).exec(
      	function(err,jobTitles){
	      	res.json({
					state:0,
					job:pJob
		    });
      });
})


router.get('/login', function (req, res, next) {
  res.render('login');
});

module.exports = router;

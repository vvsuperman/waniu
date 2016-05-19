var app = require('../app');
var request = require('supertest')(app);
var should = require("should");

describe('routes/index.js', function () {

  //新建job
  var reqJob = {

    jobTitle: "573bfec51699b1da6e16186b",    //jobtitles的id
    minSalary: 1000,         //最小薪水
    maxSalary: 2000,         //最大薪水
    city: '上海',           			 //期望城市
    degree: '本科',	        	     //学历要求
    attraction: ['妹子多', '福利好'],         	 //职位诱惑
    description: '好工作，不等人',

  };

  //修改job
  var reqModifyJob = {
    id: "573c045dc0e2fd0d280e51e9",         //id
    jobTitle: "573bfec51699b1da6e16186b",    //jobtitles的id
    minSalary: 1000,         //最小薪水
    maxSalary: 3000,         //最大薪水
    city: '北京',           			 //期望城市
    degree: '研究生',	        	     //学历要求
    attraction: ['妹子多', '福利好','升值快'],         	 //职位诱惑
    description: '你，就是下一个俞敏洪',

  };

  //错误的job数据
  var errorJob = {
    id: "573c045dc0e2fd0d280e51e91",         //id
    jobTitle: "573bfec51699b1da6e16186b",    //jobtitles的id
    minSalary: 1000,         //最小薪水
    maxSalary: 3000,         //最大薪水
    city: '北京',                  //期望城市
    degree: '研究生',                 //学历要求
    attraction: ['妹子多', '福利好','升值快'],            //职位诱惑
    description: '你，就是下一个俞敏洪',

  };


  describe('职位管理', function () {

    // it('创建job', function (done) {
    //   request.post('/job')
    //     .send({
    //       job: reqJob
    //     })
    //     .expect(200, function (err, res) {
    //       should.not.exist(err);
    //       res.body.state.should.containEql(0);
    //       done();
    //     })
    // })

    it('修改job成功', function (done) {
      request.put('/job')
        .send({
          job: reqModifyJob
        })
        .expect(200, function (err, res) {
          should.not.exist(err);
          res.body.state.should.containEql(0);
          done();
        })
    })

    it('修改job失败', function (done) {
      request.put('/job')
        .send({
          job: errorJob
        })
        .expect(200, function (err, res) {
          should.not.exist(err);
          res.body.state.should.containEql(1);
          done();
        })
    })

  })

  // describe('findJobTitles', function () {

  //   it('查询所有职位名称', function (done) {
  //     request.get('/jobTitle')
  //       .expect(200, function (err, res) {
  //         // should.not.exist(err);
  //         // res.body.state.should.containEql(0);
  //         console.log(res.body.jobTitles);
  //         done();
  //       })
  //   })


  // })

  // describe('findJobs', function () {

  //   it('查询职位信息', function (done) {
  //     request.get('/job/1')        
  //       .expect(200, function (err, res) {
  //         // should.not.exist(err);
  //         // res.body.state.should.containEql(0);
  //         console.log(res.body.jobs);
  //         done();
  //       })
  //   })


  // })


})

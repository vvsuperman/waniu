var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var underscore = require('underscore');
var request = require('request');
var Zone = require('../models/zone');
var http = require("http");
var ZonePrice = require('../models/zonePrice');
var unirest = require('unirest');
var httpinvoke = require('httpinvoke');
var async = require("async");

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var pageSize = 10; //每页十条记录


//服务器mongodb端口号为12345
//TODO: 数据库连接最好不要放在路由中,放在控制器中比较合适
//mongoose.connect('mongodb://localhost:12345/waniudb');
mongoose.connect('mongodb://localhost:27017/waniudb');

router.get('/', function (req, res) {
  res.render("index");
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

module.exports = router;

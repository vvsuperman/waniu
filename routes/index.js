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
mongoose.connect('mongodb://localhost:12345/waniudb');

router.get('/', function(req, res) {
	res.render("index");	
});

router.get('/waniuadmin', function(req,res){
	console.log("waniu admin..........");
	res.render("admin")
});

module.exports = router;

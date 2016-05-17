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

module.exports = router;

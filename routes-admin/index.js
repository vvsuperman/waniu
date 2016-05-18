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

router.post('/job', function (req, res) {
  res.send();
});

router.delete('/job', function (req, res) {
  res.send();
});

router.put('/job', function (req, res) {
  res.send();
});

router.get('/job/:id', function (req, res) {
  res.send();
});

module.exports = router;

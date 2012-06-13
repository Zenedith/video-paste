var
  config = require('config'),
  secure = require("node-secure");

var Login_Controller = {
  google: function(req, res) {
    res.render('index/index', {title: 'video-paste api'});
  },
  facebook: function(req, res) {
    res.render('index/index', {title: 'video-paste api'});
  },
  twitter: function(req, res) {
    res.render('index/index', {title: 'video-paste api'});
  },
  live: function(req, res) {
    res.render('index/index', {title: 'video-paste api'});
  }
};

module.exports = Login_Controller;
secure.secureMethods(module.exports);

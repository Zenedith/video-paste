var
  config = require('config'),
  secure = require("node-secure");

var Login_Controller = {
  facebook: function(req, res) {
    res.render('index/index', {title: 'video-paste api'});
  }
};

module.exports = Login_Controller;
secure.secureMethods(module.exports);

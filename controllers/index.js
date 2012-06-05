var
  config = require('config'),
  secure = require("node-secure");

var Index_Controller = {
  index: function(req, res) {
    res.render('index/index', {title: 'video-paste api'});
  }
};

module.exports = Index_Controller;
secure.secureMethods(module.exports);

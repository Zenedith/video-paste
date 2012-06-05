var
  config = require('config'),
  secure = require("node-secure");

var Api_Controller = {
  // api/getSession/:api_key
  get_session: function(req, res, next) {

    //TODO TEMP!
    var
      api_key = req.params.api_key,
      apiKeys = ['win7', 'android'];

    //validate key
    if (!~apiKeys.indexOf(api_key)) {
      return next(error(401, 'invalid api key'));
    }

    if (api_key) {
      res.send({"sess":"3ec6d5a02375a2b778d3bfd866a6676c1f69f8b057d24aea65e939a124e486c6"});
    }
    else {
      next();
    }
  },
  //create post
  post_create: function(req, res, next) {
    res.send({});
  },
};

module.exports = Api_Controller;
secure.secureMethods(module.exports);

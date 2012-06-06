var
  config = require('config'),
  secure = require("node-secure");

var Api_Controller = {
  validate_session: function (req, res, next) {
    var sessionId = req.params.sessionId;

//    console.log(sessionId);

    // sessionId isnt present
    if (!sessionId) {
      return false;
    }

    //TODO TEMP!
    var apiSess = ['3ec6d5a02375a2b778d3bfd866a6676c1f69f8b057d24aea65e939a124e486c6'];

    // sessionId is invalid
    if (!~apiSess.indexOf(sessionId)) {
      return false;
    }

    req.sessionId = sessionId;
    return true;
  },
  get_session: function (req, res, next) {

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
    var ok = Api_Controller.validate_session(req);

    if (!ok) {
      return next(error(401, 'invalid api sessionId'));
    }

    res.send({status: 'ok'}); //status 202
  },
  //get top link:  /api/getTopLinks/:sessionId/:categoryId/:limit/:page
  get_top_link: function(req, res, next) {
    var ok = Api_Controller.validate_session(req);

    if (!ok) {
      return next(error(401, 'invalid api sessionId'));
    }

    var
      categoryId = req.params.categoryId || 0,
      limit = req.params.limit || 1,
      page = req.params.page || 1,
      data = [];

    var elem = {
      id: 1,
      categoryId: categoryId,
      url: "https://www.youtube.com/watch?v=hFmPRt_B3Tk&feature=g-all-f",
      author: "zenedith",
      views: 12222322,
      likes: 10001211,
      added: 1339013450
    };

    for (var i=1; i <= limit; ++i) {
      elem.id = i;
      data.push(elem);
    }

    var response = {
      count: 20 * limit,
      pages: 20,
      currentPage: page,
      isNextPage: page < 20,
      isPrevPage: page > 1,
      result: data
    };

    res.send(response);
  }
};

module.exports = Api_Controller;
secure.secureMethods(module.exports);

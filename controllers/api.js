var
  log = require(process.env.APP_PATH + "/lib/log"),
  config = require('config'),
  secure = require("node-secure");

var Api_Controller = {
  validate_key: function (key) {
    //TODO
    return true;
  },
  validate_session: function (sessionId) {

//    console.log(sessionId);

    // sessionId isnt present
//    if (!sessionId) {
//      return false;
//    }
//
//    //TODO TEMP!
//    var apiSess = ['3ec6d5a02375a2b778d3bfd866a6676c1f69f8b057d24aea65e939a124e486c6'];
//
//    // sessionId is invalid
//    if (!~apiSess.indexOf(sessionId)) {
//      return false;
//    }
//
//    req.sessionId = sessionId;
    return true;
  },
  generate_key: function (req, res, next) {
    var
      Key_Generator = require(process.env.APP_PATH + "/models/key/generator").Key_Generator,
      generateKey = require(process.env.APP_PATH + "/models/response/generateKey").generateKey,
      key = new Key_Generator();

    key.createNewKey(function (err, obj) {
      if (!err) {
        res.json(new generateKey(obj));
      }
      else {
        next(err);
      }
    });
  },
  get_session: function (req, res, next) {
    var key = req.params.apiKey;
//    var ok = Api_Controller.validate_key(key);
//
//    if (!ok) {
//      return next(error(401, 'invalid api key'));
//    }

    var
      ip = res.connection.remoteAddress,
      forwardedFor = '',
      Session_Generator = require(process.env.APP_PATH + "/models/session/generator").Session_Generator,
      getSession = require(process.env.APP_PATH + "/models/response/getSession").getSession,
      sess = new Session_Generator();

    sess.createNewSession(key, ip, forwardedFor, function (err, obj) {
      if (!err) {
        res.json(new getSession(obj));
      }
      else {
        next(err);
      }
    });
  },
  //create post
  post_create: function(req, res, next) {
    var
      sessionId = req.params.sessionId,
      url = req.body.url || '';

    console.log(req.params);
    console.log(req.body);

    var ok = Api_Controller.validate_session(sessionId);

    if (!ok) {
      return next(error(401, 'invalid api sessionId'));
    }

    //TODO sanitize url
    console.log(url);

    if (!url) {
      return next(error(400, 'Bad Request (url)'));
    }

//    res.statusCode = 201; //status 201: created
    res.json({status: 'ok'}, 201);
  },
  //get top link:  /api/getTopLinks/:sessionId/:categoryId/:limit/:page
  get_top_link: function(req, res, next) {
    var sessionId = req.params.sessionId;
    var ok = Api_Controller.validate_session(sessionId);

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

    res.json(response);
  }
};

module.exports = Api_Controller;
secure.secureMethods(module.exports);

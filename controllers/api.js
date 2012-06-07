var
  log = require(process.env.APP_PATH + "/lib/log"),
  config = require('config'),
  RequestLogger = require(process.env.APP_PATH + "/lib/requestLogger").RequestLogger,
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
        var data = new generateKey(obj);
        res.json(data);
        RequestLogger.log(req, data);
      }
      else {
        return next(err);
      }
    });
  },
  //api/loginByFb/:apiKey/:id/:name/:fist_name/:last_name/:locale
  login_fb: function (req, res, next) {
    var
      apiKey = req.params.apiKey,
      fbId = req.params.id,
      name = req.params.name,
      fist_name = req.params.fist_name,
      last_name = req.params.last_name,
      locale = req.params.locale;

//    var ok = Api_Controller.validate_key(key);
      //
//          if (!ok) {
//            return next(error(401, 'invalid api key'));
//          }

    var data = {status: 'ok'};
    res.json(data, 201);
    RequestLogger.log(req, data);
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
        var data = new getSession(obj);
        res.json(data);
        RequestLogger.log(req, data);
      }
      else {
        return next(err);
      }
    });
  },

  //api/postLike/:sessionId/:postId
  post_like: function(req, res, next) {

  },

  //api/postRate/:sessionId/:postId
  //rate from post body
  post_rate: function(req, res, next) {
    var
      rate = ~~req.body.rate || 0;

    if (rate === 0) {
      var err = error(400, 'Bad Request (rate)');
      return next(err);
    }

    //check accepted value
    if (rate > 1) {
      rate = 1;
    }

    if (rate < -1) {
      rate = -1;
    }

    console.log(rate);
    console.log(req.body.rate);


  },

  // create postLink
  // url and categoryId from POST bod
  post_create: function(req, res, next) {
    var
      sanitize = require('validator').sanitize,
      check = require('validator').check,
      sessionId = req.params.sessionId,
      url = req.body.url || '';

//    console.log(req.params);
//    console.log(req.body);

    var ok = Api_Controller.validate_session(sessionId);

    if (!ok) {
      var err = error(603, 'invalid api sessionId');
      return next(err);
    }

    try {
      url = sanitize(url).xss();
      check(url).notEmpty().isUrl();
    }
    catch (e) {
      var err = error(400, 'Bad request (url param)');
      return next(err);
    }

    var
      authorId = 0,     //TODO author from session
      categoryId = req.body.categoryId || 0;
      Post = require(process.env.APP_PATH + "/models/post").Post,
      postLink = require(process.env.APP_PATH + "/models/response/postLink").postLink,
      post = new Post();

    try {
      post.createNewPost(url, categoryId, authorId, function (err, obj) {
        if (!err) {
          var data = new postLink(obj);

          res.json(data, 201);
          RequestLogger.log(req, data);
        }
        else {
          return next(err);
        }
      });
    }
    catch (err) {
      return next(err);
    }

  },
  //get top link:  /api/getTopLinks/:sessionId/:categoryId/:limit/:page
  get_top_link: function(req, res, next) {
    var sessionId = req.params.sessionId;
    var ok = Api_Controller.validate_session(sessionId);

    if (!ok) {
      var err = error(603, 'invalid api sessionId');
      return next(err);
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
    RequestLogger.log(req, response);
  }
};

module.exports = Api_Controller;
secure.secureMethods(module.exports);

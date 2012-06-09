var
  log = require(process.env.APP_PATH + "/lib/log"),
  config = require('config'),
  RequestLogger = require(process.env.APP_PATH + "/lib/requestLogger").RequestLogger,
  secure = require("node-secure");

var Api_Controller = {
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
      Key = require(process.env.APP_PATH + "/models/key").Key,
      key_obj = new Key();

    //validate key
    key_obj.isValidKey(apiKey, function (err, obj) {

      //if something wrong
      if (err) {
        return next(err);
      }

      var
        fbId = req.params.id,
        name = req.params.name,
        fist_name = req.params.fist_name,
        last_name = req.params.last_name,
        locale = req.params.locale,
        User = require(process.env.APP_PATH + "/models/user").User,
        accountType = require(process.env.APP_PATH + "/models/user/accountType").accountType,
        user = new User();

      user.getIdByExternalId(fbId, accountType.FACEBOOK, function(err2, id) {

        if (err2) {
          return next(err2);
        }

        //if user not finded, create new
        if (!id) {
          user.createNewFbUser(fbId, name, fist_name, last_name, locale, function (err3, obj) {
            if (!err3) {
              req.userId = obj.getId(); //add info about user and forward to get session method
              return Api_Controller.get_session(req, res, next);
            }

            return next(err3);
          });
        }
        else {
          req.userId = id; //add info about user and forward to get session method
          return Api_Controller.get_session(req, res, next);
        }
      });
    });
  },
  get_session: function (req, res, next) {
    var
      Key = require(process.env.APP_PATH + "/models/key").Key,
      key_obj = new Key(),
      apiKey = req.params.apiKey;

    //validate key
    key_obj.isValidKey(apiKey, function (err, obj) {

      //if something wrong
      if (err) {
        return next(err);
      }

      var
        ip = res.connection.remoteAddress,
        forwardedFor = '',
        Session_Generator = require(process.env.APP_PATH + "/models/session/generator").Session_Generator,
        getSession = require(process.env.APP_PATH + "/models/response/getSession").getSession,
        sess = new Session_Generator();

      sess.createNewSession(apiKey, ip, forwardedFor, req.userId, function (err, obj) {
        if (!err) {
          var data = new getSession(obj);
          res.json(data);
          RequestLogger.log(req, data);
        }
        else {
          return next(err);
        }
      });
    });
  },

  //api/postLink/:sessionId/:postId
  post_get: function(req, res, next) {
    var
      Session = require(process.env.APP_PATH + "/models/session").Session,
      sess_obj = new Session(),
      sessionId = req.params.sessionId;

    //validate session and key
    sess_obj.isValidSession(sessionId, function (err, obj) {

      //if something wrong
      if (err) {
        return next(err);
      }

      var
        postId = req.params.postId || 0;

      if (postId < 1) {
        var err = error(400, 'Bad Request (postId)');
        return next(err);
      }

      var
        Post = require(process.env.APP_PATH + "/models/post").Post,
        postLink = require(process.env.APP_PATH + "/models/response/postLink").postLink,
        post = new Post();

      post.load(postId, function (err, obj) {

        if (!err) {
          var data = new postLink(obj);

          res.json(data);
          RequestLogger.log(req, data);
        }
        else {
          var err = error(400, 'Bad Request (postId)');
          return next(err);
        }
      });
    });
  },


  //api/postViews/:sessionId/:postId
  post_view: function(req, res, next) {
    var
      Session = require(process.env.APP_PATH + "/models/session").Session,
      sess_obj = new Session(),
      sessionId = req.params.sessionId;

    //validate session and key
    sess_obj.isValidSession(sessionId, function (err, obj) {

      //if something wrong
      if (err) {
        return next(err);
      }

      var
        postId = req.params.postId || 0,
        userId = obj.getUserId();

      if (userId < 1) {
        return next(error(401, 'Session not authorized (userId)'));
      }


      if (postId < 1) {
        var err = error(400, 'Bad Request (postId)');
        return next(err);
      }

      var
        Post = require(process.env.APP_PATH + "/models/post").Post,
        postViews = require(process.env.APP_PATH + "/models/response/postViews").postViews,
        post = new Post();

      post.views(postId, function (err, obj) {
  //      console.log(err);
  //      console.log(obj);

        if (!err) {
          var data = new postViews(obj);

          res.json(data);
          RequestLogger.log(req, data);
        }
        else {
          var err = error(400, 'Bad Request (postId)');
          return next(err);
        }
      });
    });
  },

  //api/postRate/:sessionId/:postId
  //rate from post body
  post_rate: function(req, res, next) {
    var
      Session = require(process.env.APP_PATH + "/models/session").Session,
      sess_obj = new Session(),
      sessionId = req.params.sessionId;

    //validate session and key
    sess_obj.isValidSession(sessionId, function (err, obj) {

      //if something wrong
      if (err) {
        return next(err);
      }

      var
        postId = req.params.postId || 0,
        rate = ~~req.body.rate || 0,
        userId = obj.getUserId();

      if (userId < 1) {
        return next(error(401, 'Session not authorized (userId)'));
      }

      if (postId < 1) {
        var err = error(400, 'Bad Request (postId)');
        return next(err);
      }

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

      var
        Post = require(process.env.APP_PATH + "/models/post").Post,
        postRate = require(process.env.APP_PATH + "/models/response/postRate").postRate,
        post = new Post();

      post.rate(postId, rate, function (err2, obj) {
        if (!err2) {
          var data = new postRate(obj);

          res.json(data);
          RequestLogger.log(req, data);
        }
        else {
          return next(err2);
        }
      });
    });
  },

  // create postLink
  // url and categoryId from POST body
  post_create: function(req, res, next) {
    var
      Session = require(process.env.APP_PATH + "/models/session").Session,
      sess_obj = new Session(),
      sessionId = req.params.sessionId;

    //validate session and key
    sess_obj.isValidSession(sessionId, function (err, obj) {

      //if something wrong
      if (err) {
        return next(err);
      }

      var
        sanitize = require('validator').sanitize,
        check = require('validator').check,
        url = req.body.url || ''
        userId = obj.getUserId();

      if (userId < 1) {
        return next(error(401, 'Session not authorized (userId)'));
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
        categoryId = req.body.categoryId || 0;
        postLink = require(process.env.APP_PATH + "/models/response/postLink").postLink,
        Post = require(process.env.APP_PATH + "/models/post").Post,
        post = new Post();

      try {
        post.createNewPost(url, categoryId, userId, function (err2, p_obj) {
          if (!err2) {
            var data = new postLink(p_obj);

            res.json(data, 201);
            RequestLogger.log(req, data);
          }
          else {
            return next(err2);
          }
        });
      }
      catch (err3) {
        return next(err3);
      }
    });
  },
  //get top link:  /api/getTopLinks/:sessionId/:categoryId/:limit/:page
  get_top_link: function(req, res, next) {
    var
      Session = require(process.env.APP_PATH + "/models/session").Session,
      sess_obj = new Session(),
      sessionId = req.params.sessionId;

    //validate session and key
    sess_obj.isValidSession(sessionId, function (err, obj) {

      //if something wrong
      if (err) {
        return next(err);
      }

      var
//        categoryId = parseInt(req.params.categoryId || 0),
        limit = parseInt(req.params.limit || 1),
        page = parseInt(req.params.page || 1),
        getTopLinks = require(process.env.APP_PATH + "/models/response/getTopLinks").getTopLinks,
        Post_List = require(process.env.APP_PATH + "/models/post/list").Post_List,
        postList = new Post_List();

      postList.get(limit, page, function (err2, listObj) {

        if (err2) {
          return next(err2);
        }

//      var elem = {
//        id: 1,
//        categoryId: categoryId,
//        url: "https://www.youtube.com/watch?v=hFmPRt_B3Tk&feature=g-all-f",
//        author: "zenedith",
//        views: 12222322,
//        rate: 10001211,
//        added: 1339013450
//      };
//
//      for (var i=1; i <= limit; ++i) {
//        elem.id = i;
//        data.push(elem);
//      }
//
//      var response = {
//        count: 20 * limit,
//        pages: 20,
//        currentPage: page,
//        isNextPage: page < 20,
//        isPrevPage: page > 1,
//        result: data
//      };

        var data = new getTopLinks(listObj);

        res.json(data);
        RequestLogger.log(req, data);
      });

    });
  }
};

module.exports = Api_Controller;
secure.secureMethods(module.exports);

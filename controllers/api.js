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
        ip = req.headers['x-real-ip'] || res.connection.remoteAddress,
        forwardedFor = req.headers['x-forwarded-for'] || '',
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
        postId = parseInt(req.params.postId) || 0;

      if (postId < 1) {
        return next(error(400, 'Bad Request (postId)'));
      }

      var
        Post = require(process.env.APP_PATH + "/models/post").Post,
        postLink = require(process.env.APP_PATH + "/models/response/postLink").postLink,
        post = new Post();

      post.load(postId, function (err2, p_obj) {

        if (err2) {
          return next(err2);
        }

        var
          User_Names = require(process.env.APP_PATH + "/models/user/names").User_Names,
          usersIds = {};

        usersIds[p_obj.getUserId()] = ''; //add post user id

        new User_Names(usersIds, function (err3, userNamesObj) {

          if (err3) {
            return next(err3);
          }

          var
            data = new postLink(p_obj, userNamesObj);

          res.json(data);
          RequestLogger.log(req, data);
        });
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
        postId = parseInt(req.params.postId) || 0;
//        userId = obj.getUserId();
//
//      if (userId < 1) {
//        return next(error(401, 'Session not authorized (userId)'));
//      }


      if (postId < 1) {
        return next(error(400, 'Bad Request (postId)'));
      }

      var
        Post = require(process.env.APP_PATH + "/models/post").Post,
        postViews = require(process.env.APP_PATH + "/models/response/postViews").postViews,
        post = new Post();

      post.views(postId, function (err, obj) {

        if (!err) {
          var data = new postViews(obj);

          res.json(data);
          RequestLogger.log(req, data);
        }
        else {
          return next(error(400, 'Bad Request (postId)'));
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
        postId = parseInt(req.params.postId) || 0,
        rate = parseInt(req.body.rate) || 0,
        userId = obj.getUserId();

      if (userId < 1) {
        return next(error(401, 'Session not authorized (userId)'));
      }

      if (postId < 1) {
        return next(error(400, 'Bad Request (postId)'));
      }

      if (rate === 0) {
        return next(error(400, 'Bad Request (rate)'));
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

      post.rate(postId, rate, userId, function (err2, obj) {
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
        userId = obj.getUserId();

      if (userId < 1) {
        return next(error(401, 'Session not authorized (userId)'));
      }

      var
        url = req.body.url || '',
        Url = require(process.env.APP_PATH + "/models/url").Url,
        urlObj = new Url(url);

      if (!urlObj.isValid()) {
        return next(error(400, 'Bad request (url param)'));
      }

      var
        categoryId = parseInt(req.body.categoryId) || 0;
        postLink = require(process.env.APP_PATH + "/models/response/postLink").postLink,
        Post = require(process.env.APP_PATH + "/models/post").Post,
        post = new Post();

      try {
        post.createNewPost(urlObj.get(), categoryId, userId, function (err2, p_obj) {

          if (err2) {
            return next(err2);
          }

          var
            User_Names = require(process.env.APP_PATH + "/models/user/names").User_Names,
            usersIds = {};

          usersIds[p_obj.getUserId()] = ''; //add post user id

          new User_Names(usersIds, function (err3, userNamesObj) {

            if (err3) {
              return next(err3);
            }

            var
              data = new postLink(p_obj, userNamesObj);


            res.json(data, 201);
            RequestLogger.log(req, data);
          });

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
//        categoryId = parseInt(req.params.categoryId) || 0,
        limit = parseInt(req.params.limit) || 1,
        page = parseInt(req.params.page) || 1,
        getTopLinks = require(process.env.APP_PATH + "/models/response/getTopLinks").getTopLinks,
        Post_List = require(process.env.APP_PATH + "/models/post/list").Post_List,
        postList = new Post_List();

      postList.get(limit, page, function (err2, listObj) {

        if (err2) {
          return next(err2);
        }

        new getTopLinks(listObj, function (err3, data){
          if (err3) {
            return next(err3);
          }

          res.json(data);
          RequestLogger.log(req, data);
        });

      });

    });
  }
};

module.exports = Api_Controller;
secure.secureMethods(module.exports);

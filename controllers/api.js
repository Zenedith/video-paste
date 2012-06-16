var
  log = require(process.env.APP_PATH + "/lib/log"),
  config = require('config'),
  RequestLogger = require(process.env.APP_PATH + "/lib/requestLogger").RequestLogger,
  disableServiceAuth = true,  //problem with access key renew in some services
  sanitize = require('validator').sanitize,
  secure = require("node-secure");

var Api_Controller = {
  generate_key: function (req, res, next) {
    var
      Key_Generator = require(process.env.APP_PATH + "/models/key/generator").Key_Generator,
      generateKey = require(process.env.APP_PATH + "/models/response/generateKey").generateKey,
      key = new Key_Generator();

    key.createNewKey(function (err, obj) {

      //if something wrong
      if (err) {
        return next(err);
      }

      var data = new generateKey(obj);
      res.json(data);
      RequestLogger.log(req, data);
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
        input = JSON.parse(req.body.data || '{}');

      for (var k in input) {
        input[k] = sanitize(input[k]).xss();

        if (!input[k]) {
          return next(error(400, 'Bad request (bad ' + k + ' value)'));
        }
      }

      var
        fbId = input.id,
        name = input.name,
        fist_name = input.fist_name,
        last_name = input.last_name,
        locale = input.locale,
        User = require(process.env.APP_PATH + "/models/user").User,
        accountType = require(process.env.APP_PATH + "/models/user/accountType").accountType,
        user = new User(),
        User_Validate_Facebook = require(process.env.APP_PATH + "/models/user/validate/facebook").User_Validate_Facebook,
        userValidateFacebook = new User_Validate_Facebook();


      userValidateFacebook.isValid(fbId, name, fist_name, last_name, function (errFb, data) {

        if (!disableServiceAuth && errFb) {
          return next(errFb);
        }

        user.getIdByExternalId(fbId, accountType.FACEBOOK, function(err2, id) {

          if (err2) {
            return next(err2);
          }

          //if user not finded, create new
          if (!id) {
            user.createNewAccount(accountType.FACEBOOK, fbId, name, fist_name, last_name, locale, function (err3, obj) {
              if (!err3) {
                req.userId = obj.getId(); //add info about user and forward to get session method
                return Api_Controller.get_session(req, res, next);
              }

              return next(err3);
            });
          }
          else {
            req.userId = id; //add info about user and forward to get session method

            //TODO check to update user data with new ones!

            return Api_Controller.get_session(req, res, next);
          }
        });
      });
    });
  },
  //api/loginByWindowsLive/:apiKey/:id/:name/:fist_name/:last_name/:locale
  login_winlive: function (req, res, next) {
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
        input = JSON.parse(req.body.data || '{}');

      for (var k in input) {
        input[k] = sanitize(input[k]).xss();

        if (!input[k]) {
          return next(error(400, 'Bad request (bad ' + k + ' value)'));
        }
      }

      var
        mId = input.id,
        name = input.name || null,
        fist_name = input.fist_name || null,
        last_name = input.last_name || null,
        locale = input.locale || '',
        User = require(process.env.APP_PATH + "/models/user").User,
        accountType = require(process.env.APP_PATH + "/models/user/accountType").accountType,
        user = new User(),
        User_Validate_Live = require(process.env.APP_PATH + "/models/user/validate/live").User_Validate_Live,
        userValidateLive = new User_Validate_Live();

      userValidateLive.isValid(mId, name, fist_name, last_name, function (errLive, data) {

        if (!disableServiceAuth && errLive) {
          return next(errLive);
        }

        user.getIdByExternalId(mId, accountType.WINDOWS_LIVE, function(err2, id) {

          if (err2) {
            return next(err2);
          }

          //if user not finded, create new
          if (!id) {
            user.createNewAccount(accountType.WINDOWS_LIVE, mId, name, fist_name, last_name, locale, function (err3, obj) {
              if (!err3) {
                req.userId = obj.getId(); //add info about user and forward to get session method
                return Api_Controller.get_session(req, res, next);
              }

              return next(err3);
            });
          }
          else {
            req.userId = id; //add info about user and forward to get session method

            //TODO check to update user data with new ones!

            return Api_Controller.get_session(req, res, next);
          }
        });
      });
    });
  },
  //api/loginByGoogle/:apiKey/:id/:name/:given_name/:family_name
  login_google: function (req, res, next) {
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
        input = JSON.parse(req.body.data || '{}');

      for (var k in input) {
        input[k] = sanitize(input[k]).xss();

        if (!input[k]) {
          return next(error(400, 'Bad request (bad ' + k + ' value)'));
        }
      }

      var
        gId = input.id,
        name = input.name,
        fist_name = input.given_name,
        last_name = input.family_name,
        locale = '',
        User = require(process.env.APP_PATH + "/models/user").User,
        accountType = require(process.env.APP_PATH + "/models/user/accountType").accountType,
        user = new User(),
        User_Validate_Google = require(process.env.APP_PATH + "/models/user/validate/google").User_Validate_Google,
        userValidateGoogle = new User_Validate_Google();

      userValidateGoogle.isValid(gId, name, fist_name, last_name, function (errG, data) {

        if (!disableServiceAuth && errG) {
          return next(errG);
        }

        user.getIdByExternalId(gId, accountType.GOOGLE, function(err2, id) {

          if (err2) {
            return next(err2);
          }

          //if user not finded, create new
          if (!id) {
            user.createNewAccount(accountType.GOOGLE, gId, name, fist_name, last_name, locale, function (err3, obj) {
              if (!err3) {
                req.userId = obj.getId(); //add info about user and forward to get session method
                return Api_Controller.get_session(req, res, next);
              }

              return next(err3);
            });
          }
          else {
            req.userId = id; //add info about user and forward to get session method

            //TODO check to update user data with new ones!

            return Api_Controller.get_session(req, res, next);
          }
        });
      });
    });
  },
  //api/loginByTwitter/:apiKey/:id/:name
  login_twitter: function (req, res, next) {
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
        input = JSON.parse(req.body.data || '{}');

      for (var k in input) {
        input[k] = sanitize(input[k]).xss();

        if (!input[k]) {
          return next(error(400, 'Bad request (bad ' + k + ' value)'));
        }
      }

      var
        tId = input.id,
        name = input.name,
        fist_name = '',
        last_name = '',
        locale = '',
        User = require(process.env.APP_PATH + "/models/user").User,
        accountType = require(process.env.APP_PATH + "/models/user/accountType").accountType,
        user = new User();

      var
        User_Validate_Twitter = require(process.env.APP_PATH + "/models/user/validate/twitter").User_Validate_Twitter,
        userValidateTwitter = new User_Validate_Twitter();

      userValidateTwitter.isValid(tId, name, function (errT, data) {

        if (!disableServiceAuth && errT) {
          return next(errT);
        }

        user.getIdByExternalId(tId, accountType.TWITTER, function(err2, id) {

          if (err2) {
            return next(err2);
          }

          //if user not finded, create new
          if (!id) {
            user.createNewAccount(accountType.TWITTER, tId, name, fist_name, last_name, locale, function (err3, obj) {
              if (!err3) {
                req.userId = obj.getId(); //add info about user and forward to get session method
                return Api_Controller.get_session(req, res, next);
              }

              return next(err3);
            });
          }
          else {
            req.userId = id; //add info about user and forward to get session method

            //TODO check to update user data with new ones!

            return Api_Controller.get_session(req, res, next);
          }
        });
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
        return next(error(400, 'Bad request (bad postId value)'));
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
        return next(error(400, 'Bad request (bad postId value)'));
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
          return next(error(400, 'Bad request (bad postId value)'));
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
        input = JSON.parse(req.body.data || '{}'),
        rate = parseInt(input.rate) || 0,
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
        input = JSON.parse(req.body.data || '{}'),
        url = input.url || '',
        Url = require(process.env.APP_PATH + "/models/url").Url,
        urlObj = new Url(url);

      if (!urlObj.isValid()) {
        return next(error(400, 'Bad request (url param)'));
      }

      var
        categoryId = parseInt(input.categoryId) || 0;
        tags = input.tags || [];
        postLink = require(process.env.APP_PATH + "/models/response/postLink").postLink,
        Post = require(process.env.APP_PATH + "/models/post").Post,
        post = new Post();

      try {
        post.createNewPost(urlObj, categoryId, tags, userId, function (err2, p_obj) {

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

      if (limit > 100) {
        return next(error(400, 'Bad request (too big limit value)'));
      }

      postList.getByRate(limit, page, function (err2, listObj) {

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
  },
  //get top link:  /api/getNewLinks/:sessionId/:categoryId/:limit/:page
  get_new_links: function(req, res, next) {
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
        getNewLinks = require(process.env.APP_PATH + "/models/response/getNewLinks").getNewLinks,
        Post_List_New = require(process.env.APP_PATH + "/models/post/list/new").Post_List_New,
        postListNew = new Post_List_New();

      if (limit > 100) {
        return next(error(400, 'Bad request (too big limit value)'));
      }

      postListNew.get(limit, page, function (err2, listObj) {

        if (err2) {
          return next(err2);
        }

        new getNewLinks(listObj, function (err3, data){
          if (err3) {
            return next(err3);
          }

          res.json(data);
          RequestLogger.log(req, data);
        });

      });

    });
  },
  //api/tags/:apiKey
  tags: function (req, res, next) {
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
        searchKey = req.params.searchKey || '',
        limit = parseInt(req.params.limit) || 1,
        page = parseInt(req.params.page) || 1,
        getTags = require(process.env.APP_PATH + "/models/response/getTags").getTags;
        Tag_Search_List = require(process.env.APP_PATH + "/models/tag/search/list").Tag_Search_List,
        tagSearchList = new Tag_Search_List();

      if (limit > 100) {
        return next(error(400, 'Bad request (too big limit value)'));
      }

      //searchKey is optional
      if (searchKey) {
        searchKey = sanitize(searchKey).xss();

        if (!searchKey) {
          return next(error(400, 'Bad request (bad searchKey value)'));
        }
      }

      tagSearchList.get(searchKey, limit, page, function (err2, listObj) {

        if (err2) {
          return next(err2);
        }

        var data = new getTags(listObj);
        res.json(data);
        RequestLogger.log(req, data);
      });
    });
  },
  //api/getLinksByTag/:sessionId/:tagName/:limit/:page
  getLinksByTag: function (req, res, next) {
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
        tagName = req.params.tagName || '',
        limit = parseInt(req.params.limit) || 1,
        page = parseInt(req.params.page) || 1,
        getLinksByTag = require(process.env.APP_PATH + "/models/response/getLinksByTag").getLinksByTag;
        Post_List = require(process.env.APP_PATH + "/models/post/list").Post_List,
        postList = new Post_List();

      if (limit > 100) {
        return next(error(400, 'Bad request (too big limit value)'));
      }

      tagName = sanitize(tagName).xss();

      if (!tagName) {
        return next(error(400, 'Bad request (bad tagName value)'));
      }

      postList.searchByTag(tagName, page, limit, function(err2, listObj) {
        if (err2) {
          return next(err2);
        }

        new getLinksByTag(listObj, function (err3, data){
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

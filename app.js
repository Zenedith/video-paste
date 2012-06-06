if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

if (!process.env.APP_PATH) {
  process.env.APP_PATH = __dirname;
}

process.on('uncaughtException', function (err) {
  console.log('error: ' + err);
});


//global
error = function (status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
};

var
    express = require('express'),
    config = require('config'),
    port = config.app.port || process.env.PORT,
//    i18n = require("i18n"),
//    expressValidator = require('express-validator'),
    log = require(process.env.APP_PATH + "/lib/log"),
    controller = require(process.env.APP_PATH + "/lib/controller");

if (process.env.NODE_ENV == 'dotcloud') {
  var fs = require('fs');
  var env = JSON.parse(fs.readFileSync('/home/dotcloud/environment.json', 'utf-8'));
  port = env['PORT_WWW']; //override port
}



  var app = express.createServer();
  // Configuration

//  i18n.configure({
//    // setup some locales - other locales default to en silently
//    locales:['en', 'pl']
//  });
//  //create global translate function (dont use register: global as jade uses __ as internal variable!)
//  __t = i18n.__;
  __t = function(str) { console.log(str); return str;};

  app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());

    app.set('config', config);

    //access.log format (default is full)

    if (process.env.NODE_ENV != 'development') {
      app.use(express.logger());
    }

  //  app.use(express.logger({ format: ':method :url' }));
//    app.use(expressValidator);  //data validator and sanitizer

    //standard mvc
    app.use(express.bodyParser());
    app.use(express.cookieParser('secret_22'));
    app.use(express.methodOverride());

  // using 'accept-language' header to guess language settings
//    app.use(i18n.init);
  //  i18n.setLocale('en');

//    app.use('/api', function(req, res, next){
//
//      //exclude getSession method
//      if (!req.url.match(/^\/getSession\//g)) {
//
//        var sessionId = req.query['sessionId'];
//
//        if (!sessionId) {
//          console.log(req);
//          sessionId = req.params.sessionId;
//        }
//
//        console.log(sessionId);
//
//        // sessionId isnt present
//        if (!sessionId) {
//          return next(error(401, 'invalid api sessionId'));
//        }
//
//        var apiSess = ['3ec6d5a02375a2b778d3bfd866a6676c1f69f8b057d24aea65e939a124e486c6'];
//
//        // sessionId is invalid
//        if (!~apiSess.indexOf(sessionId)) {
//          return next(error(401, 'invalid api sessionId'));
//        }
//
//        req.sessionId = sessionId;
//      }
//
//      next();
//    });

    // position our routes above the error handling middleware,
    // and below our API middleware, since we want the API validation
    // to take place BEFORE our routes
    app.use(app.router);
    controller.bootControllers(app, '');

    // middleware with an arity of 4 are considered
    // error handling middleware. When you next(err)
    // it will be passed through the defined middleware
    // in order, but ONLY those with an arity of 4, ignoring
    // regular middleware.
    app.use(function(err, req, res, next){
      log.error(err.message);

      if (process.env.NODE_ENV != 'development') {
        err.message = 'Unexpected api problem';
      }

      res.send(err.status || 500, { error: err.message });
    });

    // our custom JSON 404 middleware. Since it's placed last
    // it will be the last middleware called, if all others
    // invoke next() and do not respond.
    app.use(function(req, res){
      res.send(404, { error: "Bad method name" });
    });
  });

app.listen(port);
log.debug("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
log.debug('Using Express %s', express.version);

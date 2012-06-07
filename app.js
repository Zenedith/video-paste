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
error = function (code, msg) {
  var err = new Error(msg);

  switch (code) {
    case 400:
      err.error = 'ERR_BAD_REQUEST';
      break;
    case 401:
      err.error = 'ERR_UNAUTHORIZED';
      break;
    case 403:
      err.error = 'ERR_NOT_ALLOWED';
      break;
    case 404:
      err.error = 'ERR_NOT_FOUND';
      break;
    case 405:
      err.error = 'ERR_METHOD_NOT_ALLOWED';
    break;
  }

  err.data = '';
  err.code = code;
  err.msg = msg;
  return err;
};

var
    express = require('express'),
    config = require('config'),
//    i18n = require("i18n"),
//    expressValidator = require('express-validator'),
    RequestLogger = require(process.env.APP_PATH + "/lib/requestLogger").RequestLogger,
    log = require(process.env.APP_PATH + "/lib/log"),
    controller = require(process.env.APP_PATH + "/lib/controller");

if (process.env.NODE_ENV == 'dotcloud') {
  var fs = require('fs');
  var env = JSON.parse(fs.readFileSync('environment.json', 'utf-8'));

  config.app.port = env['PORT_WWW']; //override port
  config.db.use = "redis";
  config.db.redis.host = env['DOTCLOUD_DATA_REDIS_HOST']; //override redis host
  config.db.redis.port = env['DOTCLOUD_DATA_REDIS_PORT']; //override redis port
  config.db.redis.auth = env['DOTCLOUD_DATA_REDIS_PASSWORD']; //override redis auth
}

  var
    app = express.createServer();

  //global socketio!
  socketio = require('socket.io').listen(app);
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

//    app.use(express.static(__dirname + '/public'));
//    app.use(express.compiler({src: __dirname + '/public', enable: ['less'] }));

//    app.use('/api', function(req, res, next) {
//
//      //count IP calls
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
//      log.error(err.message);
//      console.log('50x');
//      console.log(err);
      if (process.env.NODE_ENV != 'development') {
        err.message = 'Unexpected api problem';
      }

      res.send(err, { 'Content-Type': 'application/json' }, err.code);
      RequestLogger.log(req, err);
    });

    // our custom JSON 404 middleware. Since it's placed last
    // it will be the last middleware called, if all others
    // invoke next() and do not respond.
    app.use(function(req, res, next){
//      console.log('404');
      var err = error(404, 'Bad method name');
      res.send(err, { 'Content-Type': 'application/json' }, 404);
      RequestLogger.log(req, err);
    });
  });

//expresso need it
module.exports = app;

app.listen(config.app.port || process.env.PORT);
log.debug("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
log.debug('Using Express %s', express.version);

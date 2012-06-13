if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

if (!process.env.APP_PATH) {
  process.env.APP_PATH = __dirname;
}

process.on('uncaughtException', function (err) {
  console.log('error: ' + err);
});


var
    express = require('express'),
    config = require('config'),
    GoogleAnalytics = require('ga'),
//    i18n = require("i18n"),
//    expressValidator = require('express-validator'),
    Errors = require(process.env.APP_PATH + "/models/errors").Errors,
    RequestLogger = require(process.env.APP_PATH + "/lib/requestLogger").RequestLogger,
    log = require(process.env.APP_PATH + "/lib/log"),
    controller = require(process.env.APP_PATH + "/lib/controller"),
    auth = require('connect-auth');



//global
error = Errors;



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

    app.helpers({
      config: config
    });

    app.set('config', config);

    //access.log format (default is full)

    if (process.env.NODE_ENV != 'development') {
      app.use(express.logger());
    }

  //  app.use(express.logger({ format: ':method :url' }));
//    app.use(expressValidator);  //data validator and sanitizer

    var logoutHandler = function (v1, v2, v3) {
      console.log('logoutHandler');
      console.log(v1, v2, v3);
    };

    //standard mvc
    app.use(express.cookieParser('my secret here'))
      .use(express.session({secret: "string" }))
      .use(express.bodyParser())
      .use(express.methodOverride())
      .use(auth({
        strategies:[
            auth.Twitter({consumerKey: config.auth.twitter.consumerkey, consumerSecret: config.auth.twitter.consumersecret}),
            auth.Facebook({appId : config.auth.facebook.appid, appSecret: config.auth.facebook.appsecret, scope: "email", callback: 'http://localhost:3001/auth/facebook_callback'}),
            auth.Google2({appId : config.auth.google.clientid, appSecret: config.auth.google.clientsecret, callback: 'http://localhost:3001/auth/google/login', requestEmailPermission: true})
          ],
        trace: true,
        logoutHandler: logoutHandler})
       );


  // using 'accept-language' header to guess language settings
//    app.use(i18n.init);
  //  i18n.setLocale('en');

//    app.use(express.static(__dirname + '/public'));
//    app.use(express.compiler({src: __dirname + '/public', enable: ['less'] }));
//
    app.use('/api', function(req, res, next) {

      var
        ip = req.headers['x-real-ip'] || res.connection.remoteAddress,
        forwardedFor = req.headers['x-forwarded-for'] || '';

      if (config.app.enable_google_analytics) {
        ua = "UA-32533263-1",
        host = req.headers['host'],
        ga = new GoogleAnalytics(ua, host);
        ga.trackPage(req.originalUrl);
      }

//TODO      count IP calls
      next();
    });

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

      //check error type
      if (!err.hasOwnProperty('code')) {
        log.error('500: ' + req.originalUrl + ', error: ' + err.message); //log real message
        err = error(500, 'Unexpexted error occured'); //override message
      }
      else {
        log.error(err.code + ': ' + req.originalUrl + ', error: ' + err.message);
      }

      //on development show debug stack only if no testing (modeule parent)
      if (process.env.NODE_ENV === 'development' && !module.parent) {
        return next(err); //goto express.errorHandler
      }

      if (/RedisClient/i.test(err.msg)) {
        err.msg = 'Database problem';
      }

      //if /api call, show json output
      if (/^\/api\//.test(req.originalUrl)) {
        res.send(err, { 'Content-Type': 'application/json' }, 200);
        RequestLogger.log(req, err);
      }
      else {
        res.status(500);
        res.render('info', { title: 'Nieoczekiwany problem (500)' });
      }
    });

    app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));

    // our custom JSON 404 middleware. Since it's placed last
    // it will be the last middleware called, if all others
    // invoke next() and do not respond.
    app.use(function(req, res, next){
      log.error('404: ' + req.originalUrl);

      //if /api call, show json output
      if (/^\/api\//.test(req.originalUrl)) {
        var err = error(404, 'Bad method name');
        res.send(err, { 'Content-Type': 'application/json' }, 200);
        RequestLogger.log(req, err);
      }
      else {
        res.status(404);
        res.render('info', { title: 'Strona nie została odnaleziona (404)' });
      }
    });
  });


module.exports = app;

//expresso need it
if (!module.parent) {
  app.listen(config.app.port || process.env.PORT);
  log.debug("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
  log.debug('Using Express %s', express.version);
}

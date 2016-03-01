var Api = function () {
    var
        restify = require('restify'),
        config = require('config'),
        log = require(process.env.APP_PATH + "/lib/logger").logger,
//    Restify_TokensTable = require(process.env.APP_PATH + "/lib/restify/tokensTable").Restify_TokensTable,
        RequestLogger = require(process.env.APP_PATH + "/lib/requestLogger").RequestLogger,
        controller = require(process.env.APP_PATH + "/lib/controller"),
        api = restify.createServer();

//  api.use(restify.acceptParser(api.acceptable));  // express vhost handled
    api.use(restify.queryParser());
    api.use(restify.bodyParser());
//  api.use(restify.urlEncodedBodyParser());
//  api.use(restify.conditionalRequest());// express vhost handled

    //https://en.wikipedia.org/wiki/Token_bucket

    if (!process.env.TESTER) {
        api.use(restify.throttle({
            burst: 10,
            rate: 5,
//      tokensTable: new Restify_TokensTable(), //default is LRU
            ip: true,
//      xff: true,
            overrides: {
                '127.0.0.1': {
                    burst: 20,
                    rate: 10
                }
            }
        }));
    }

    //TODO 50x error handling

    //all valid request go there
    api.use(function (req, res, next) {
        var
            ip = req.headers['x-real-ip'] || req.headers['remote-addr'] || res.connection.remoteAddress,
            forwardedFor = req.headers['x-forwarded-for'] || '';

        if (config.app.enable_google_analytics) {
            var
                ua = "UA-32533263-1",
                host = req.headers.host,
                GoogleAnalytics = require('ga'),
                ga = new GoogleAnalytics(ua, host);

            ga.trackPage(req.originalUrl);
        }

        // TODO count IP calls
        next();
    });

    controller.bootControllers(api, 'api');

    api.on('MethodNotAllowed', function (req, res) {
        log.error('400[api]: ' + req.originalUrl);

        var err = error(400, 'Method not allowed');
        res.end(JSON.stringify(err));
        RequestLogger.log(req, err);
    });

    api.on('NotFound', function (req, res) {
        log.error('404[api]: ' + req.originalUrl);

        var err = error(404, 'Bad method name');
        res.end(JSON.stringify(err));
        RequestLogger.log(req, err);
    });

    return api;
};

module.exports.Api = Api;

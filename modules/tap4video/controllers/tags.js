var
    Key = require(process.env.APP_PATH + "/models/key").Key,
    key_obj = new Key(),
    log = require(process.env.APP_PATH + "/lib/logger").logger,
    config = require('config'),
    RequestLogger = require(process.env.APP_PATH + "/lib/requestLogger").RequestLogger,
    disableServiceAuth = true, //problem with access key renew in some services
    sanitize = require('sanitizer'),
    secure = require("node-secure");

var Tags_Controller = {

    search: function (req, res, next) {
        var
            searchKey = getQueryStringParam(req.query, "searchKey"),
            limit = getQueryIntegerParam(req.query, "limit", 1),
            page = getQueryIntegerParam(req.query, "page", 1),
            apiKey = getKeyFromQuery(req.query);

        if (limit > 100) {
            return next(error(400, 'Bad request (too big limit value)'));
        }

        //validate key
        key_obj.isValidKey(apiKey, function (err, obj) {

            //if something wrong
            if (err) {
                return next(err);
            }

            var
                getTags = require(process.env.APP_PATH + "/models/response/getTags").getTags,
                Tag = require(process.env.APP_PATH + "/models/tag").Tag,
                tag = new Tag(searchKey);

            //searchKey is optional
            tag.getTags(searchKey, limit, page, function (err2, listObj) {

                if (err2) {
                    return next(err2);
                }

                var data = new getTags(listObj);
                res.json(data);
                RequestLogger.log(req, data);
            });
        });
    }
};

//private
var getKeyFromQuery = function (query) {
    return query.apiKey || "";
};

var getQueryStringParam = function (query, paramName) {
    var
        param = query[paramName] || "";

    return sanitize.escape(param);
};

var getQueryIntegerParam = function (query, paramName, defaultValue) {
    if (!defaultValue) {
        defaultValue = 0;
    }

    return ~~(query[paramName]) || defaultValue;
};


module.exports = Tags_Controller;
secure.secureMethods(module.exports);

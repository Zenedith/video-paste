var
    log = require(process.env.APP_PATH + "/lib/log"),
    secure = require("node-secure");

var List = function (limit, page, count, data) {
    log.debug('List.construct()');

    this.__count = count;
    this.__pages = Math.ceil(count / limit);
    this.__currentPage = page;
    this.__result = data;

    this.getCount = function () {
        return this.__count;
    };

    this.getPages = function () {
        return this.__pages;
    };

    this.getCurrentPage = function () {
        return this.__currentPage;
    };

    this.getResults = function () {
        return this.__result;
    };
};


exports.List = List;
secure.secureMethods(exports);

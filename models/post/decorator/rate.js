var
    Post_Rate = require(process.env.APP_PATH + "/models/post/rate").Post_Rate,
    Database = require(process.env.APP_PATH + "/lib/database").Database,
    secure = require("node-secure");

var Post_Decorator_Rate = function (idsObj, callback) {

    this.postRates = {};

    var
        ids = Object.keys(idsObj),
        idsLen = ids.length;

    this.prepareKeys = function () {
        var
            scoreSetName = Post_Rate.scoreNameRated,
            keyFields = [];

        if (idsLen) {

            for (var i = 0; i < idsLen; ++i) {
                var
                    key = [scoreSetName, ids[i]];

                keyFields.push(key);
            }
        }

        return {'zscore': keyFields};
    };

    this.load = function (data) {
        if (idsLen) {
            for (var i = 0; i < idsLen; ++i) {
                this.postRates[ids[i]] = data.pop();
            }
        }
    };

    this.getRate = function (id) {
        if (this.postRates.hasOwnProperty(id) && this.postRates[id]) {
            return this.postRates[id];
        }

        return 1;
    };
};

exports.Post_Decorator_Rate = Post_Decorator_Rate;
secure.secureMethods(exports);

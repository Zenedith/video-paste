var
    log = require(process.env.APP_PATH + "/lib/log"),
    config = require('config'),
    RequestLogger = require(process.env.APP_PATH + "/lib/requestLogger").RequestLogger,
    secure = require("node-secure");

var Task_Controller = {
    check_new_list: function (req, res, next) {

        var
            Post_List_New = require(process.env.APP_PATH + "/models/post/list/new").Post_List_New,
            postListNew = new Post_List_New();

        postListNew.cleanOlderPosts(function (err, removedCount) {

            if (err) {
                return next(err);
            }

            var data = {
                removedCount: removedCount
            };

            res.json(data);
            RequestLogger.log(req, data);
        });
    }

};

module.exports = Task_Controller;
secure.secureMethods(module.exports);

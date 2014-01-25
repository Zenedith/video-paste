var
    List = require(process.env.APP_PATH + "/models/list").List,
    log = require(process.env.APP_PATH + "/lib/log"),
    Database = require(process.env.APP_PATH + "/lib/database").Database,
//  util = require("util"),
    secure = require("node-secure");

var Post_List_New = function () {
    log.debug('Post_List_New.construct()');

    this.cleanOlderPosts = function (callback) {
        log.debug('Post_List_New.cleanOlderPosts()');

        var MIN_NEW_LIST_SIZE = 100;

        //check how many items on list
        Database.countValuesInSet(Post_List_New.setNameNew, function (errCount, count) {

            if (errCount) {
                return callback(errCount, null);
            }

            //if not too many items, return
            if (count < MIN_NEW_LIST_SIZE) {
                return callback(null, 0);
            }

            //get new post ids
            Database.getSortedValuesFromSet(Post_List_New.setNameNew, MIN_NEW_LIST_SIZE, -1, 'DESC', function (err, resList) {

                if (err) {
                    return callback(err, null);
                }

                var
                    removeCount = resList.length;

                //async
                for (var i = 0; i < removeCount; ++i) {

                    //TODO optimize: remove all ids at once
                    Database.removeValueFromSet(Post_List_New.setNameNew, resList[i], function (err, res) {
                        if (err) {
                            log.critical(err);
                        }
                    });
                }

                //dont wait to remove items
                return callback(null, removeCount);
            });
        });
    };
};


Post_List_New.setNameNew = 'new:posts';

exports.Post_List_New = Post_List_New;
secure.secureMethods(exports);

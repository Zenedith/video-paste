var
    Database = require(process.env.APP_PATH + "/lib/database").Database,
    Post_Tag = require(process.env.APP_PATH + "/models/post/tag").Post_Tag,
    secure = require("node-secure");

var Post_Decorator_Tags = function (idsObj, callback) {

    this.postsTags = {};

    var
        ids = Object.keys(idsObj),
        idsLen = ids.length;

    this.prepareKeys = function () {
        var
            start = 0,
            stop = -1,
            keyFields = [];

        if (idsLen) {

            for (var i = 0; i < idsLen; ++i) {
                var
                    listName = Post_Tag.getPostTagsListName(ids[i]),
                    key = [listName, start, stop];

                keyFields.push(key);
            }
        }

        return {'lrange': keyFields};
    };

    this.load = function (data) {

        if (idsLen) {
            for (var i = 0; i < idsLen; ++i) {
                this.postsTags[ids[i]] = data.pop();
            }
        }
    };

    this.getTags = function (id) {
        if (this.postsTags.hasOwnProperty(id) && this.postsTags[id]) {
            return this.postsTags[id];
        }

        return [];
    };
};

exports.Post_Decorator_Tags = Post_Decorator_Tags;
secure.secureMethods(exports);

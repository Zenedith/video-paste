var
    Tag = require(process.env.APP_PATH + "/models/tag").Tag,
    log = require(process.env.APP_PATH + "/lib/log"),
    Database = require(process.env.APP_PATH + "/lib/database").Database,
    secure = require("node-secure");

var Tag_Keyword = function () {
    log.debug('Tag_Keyword.construct()');

    this.updateKeywords = function (tagName, callback) {
        log.debug('Tag_Keyword.updateKeywords(' + tagName + ')');

        var
            tagLength = tagName.length,
            setValuesObj = {};

        //split tag name to search keywords
        for (var i = tagLength + 1; --i;) {
            var
                tag = tagName.substr(0, i),
                setName = Tag.getTagKeywordSetName(tag);

            setValuesObj[setName] = tagName;
        }

        Database.addManyValuesToManySets(setValuesObj, callback);
    };
};

exports.Tag_Keyword = Tag_Keyword;
secure.secureMethods(exports);

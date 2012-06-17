var
  Base = require(process.env.APP_PATH + "/models/base").Base,
  log = require(process.env.APP_PATH + "/lib/log"),
  Database = require(process.env.APP_PATH + "/lib/database").Database,
  async = require("async"),
  secure = require("node-secure");

var Tag_Search = function ()
{
  log.debug('Tag_Search.construct()');

  Base.call(this);  //call parent constructor

  this.__className = "Tag_Search";

  this.updateKeywords = function (tagName, callback) {
    log.debug('Tag_Search.updateKeywords(' + tagName + ')');

    this.setId(tagName);  //tag name as id (need to incrObjectScore)

    var
      _this = this;

    //add to tags set and increase score for tag
    Database.incrObjectScore(this, 'tags', 1, function (err, res){
      if (err) {
        return callback(err, null);
      }

      var
        tagLength = tagName.length,
        series = [];

      //split tag name to search keywords
      for (var i = tagLength + 1; --i;) {
        series.push(tagName.substr(0, i));
      }

      //add search keywords to tag
      async.forEach(
        series,
        function (tag, callbackSeries) {
          var
            setName = tag + ':tags';
          Database.addValueToSet(setName, tagName, callbackSeries);
        },
        function (err) {
          if (err) {
            return callback(err, null);
          }

          return callback(null, series);
        });
    });
  };
};


//extending base class
//util.inherits(Tag_Search, Base);
Tag_Search.prototype.__proto__ = Base.prototype;


exports.Tag_Search = Tag_Search;
secure.secureMethods(exports);

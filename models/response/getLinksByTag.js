//var
//  log = require(process.env.APP_PATH + "/lib/log");

var getLinksByTag = function (listObj, callback)
{
//  log.debug('getLinksByTag.construct()');

  this.count = parseInt(listObj.getCount());
  this.pages = parseInt(listObj.getPages());
  this.currentPage = parseInt(listObj.getCurrentPage());
  this.isNextPage = (this.currentPage < this.pages);
  this.isPrevPage = this.currentPage > 1;
  this.result = [];

  var
    _this = this,
    resList = listObj.getResults(),
    decorator_PostLinkTagsAndUserNames = require(process.env.APP_PATH + "/models/decorator/postLinkTagsAndUserNames").decorator_PostLinkTagsAndUserNames;

  decorator_PostLinkTagsAndUserNames(resList, function (err, data) {

    if (err) {
      return callback(err, null);
    }

    _this.result = data;
    return callback(null, _this);
  });
};


exports.getLinksByTag = getLinksByTag;

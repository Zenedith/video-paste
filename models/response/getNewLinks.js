//var
//  log = require(process.env.APP_PATH + "/lib/log");

var getNewLinks = function (listObj, callback)
{
//  log.debug('getNewLinks.construct()');

  this.count = parseInt(listObj.getCount());
  this.pages = parseInt(listObj.getPages());
  this.currentPage = parseInt(listObj.getCurrentPage());
  this.isNextPage = (this.currentPage < this.pages);
  this.isPrevPage = this.currentPage > 1;
  this.result = [];

  var
    _this = this,
    resList = listObj.getResults(),
    decorator_PostLink = require(process.env.APP_PATH + "/models/decorator/postLink").decorator_PostLink;

  decorator_PostLink(resList, function (err, data) {

    if (err) {
      return callback(err, null);
    }

    _this.result = data;
    return callback(null, _this);
  });
};

exports.getNewLinks = getNewLinks;

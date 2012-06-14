//var
//  log = require(process.env.APP_PATH + "/lib/log");

var getTags = function (listObj, callback)
{
//  log.debug('getTags.construct()');

  this.count = parseInt(listObj.getCount());
  this.pages = parseInt(listObj.getPages());
  this.currentPage = parseInt(listObj.getCurrentPage());
  this.isNextPage = (this.currentPage < this.pages);
  this.isPrevPage = this.currentPage > 1;
  this.result = listObj.getResults();
};

exports.getTags = getTags;

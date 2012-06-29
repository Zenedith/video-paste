//var
//  log = require(process.env.APP_PATH + "/lib/log");

var getTags = function (listObj, callback)
{
//  log.debug('getTags.construct()');

  this.count = ~~(listObj.getCount());
  this.pages = ~~(listObj.getPages());
  this.currentPage = ~~(listObj.getCurrentPage());
  this.isNextPage = (this.currentPage < this.pages);
  this.isPrevPage = this.currentPage > 1;
  this.result = listObj.getResults();
};

exports.getTags = getTags;

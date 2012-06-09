//var
//  log = require(process.env.APP_PATH + "/lib/log");

var getTopLinks = function (listObj)
{
//  log.debug('getTopLinks.construct()');

  this.count = parseInt(listObj.getCount());
  this.pages = parseInt(listObj.getPages());
  this.currentPage = parseInt(listObj.getCurrentPage());
  this.isNextPage = (this.currentPage < this.pages);
  this.isPrevPage = this.currentPage > 1;
  this.result = [];

  var
    resList = listObj.getResults(),
    postLink = require(process.env.APP_PATH + "/models/response/postLink").postLink;

    for (var lp in resList) {
      this.result.push(new postLink(resList[lp]));
    }
};

exports.getTopLinks = getTopLinks;

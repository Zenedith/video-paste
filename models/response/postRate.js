//var
//  log = require(process.env.APP_PATH + "/lib/log");

var postRate = function (postObj)
{
//  log.debug('postRate.construct()');

  this.postId = postObj.getId();
//  this.categoryId = postObj.getCategoryId();
//  this.added = postObj.getAddedTimestamp();
//  this.authorId = postObj.getAuthorId();  //TODO author name insted
//  this.url = postObj.getUrl();
  this.rate = postObj.getRating();
//  this.views = postObj.getViews();
};

exports.postRate = postRate;

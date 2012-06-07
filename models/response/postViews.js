//var
//  log = require(process.env.APP_PATH + "/lib/log");

var postViews = function (postObj)
{
//  log.debug('postViews.construct()');

  this.postId = postObj.getId();
//  this.categoryId = postObj.getCategoryId();
//  this.added = postObj.getAddedTimestamp();
//  this.authorId = postObj.getAuthorId();  //TODO author name insted
//  this.url = postObj.getUrl();
//  this.rate = postObj.getRating();
  this.views = postObj.getViews();
};

exports.postViews = postViews;

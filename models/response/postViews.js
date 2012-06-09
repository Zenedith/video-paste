//var
//  log = require(process.env.APP_PATH + "/lib/log");

var postViews = function (postObj)
{
//  log.debug('postViews.construct()');

  this.postId = parseInt(postObj.getId());
//  this.categoryId = parseInt(postObj.getCategoryId());
//  this.added = postObj.getAddedTimestamp();
//  this.userId = parseInt(postObj.getUserId());
//  this.url = postObj.getUrl();
//  this.rate = parseInt(postObj.getRating());
  this.views = parseInt(postObj.getViews());
};

exports.postViews = postViews;

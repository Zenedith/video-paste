//var
//  log = require(process.env.APP_PATH + "/lib/log");

var postLink = function (postObj, userNamesObj)
{
//  log.debug('postLink.construct()');

  this.postId = parseInt(postObj.getId());
  this.categoryId = parseInt(postObj.getCategoryId());
  this.added = postObj.getAddedTimestamp();
  this.userId = parseInt(postObj.getUserId());
  this.userName = userNamesObj.getName(this.userId);
  this.url = postObj.getUrl();
  this.thumbUrl = postObj.getThumbUrl();
  this.rate = parseInt(postObj.getRating());
  this.views = parseInt(postObj.getViews());
};

exports.postLink = postLink;

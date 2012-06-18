//var
//  log = require(process.env.APP_PATH + "/lib/log");

var postLink = function (postObj, userNamesObj, postTagsObj, postRateObj)
{
//  log.debug('postLink.construct()');

  this.postId = parseInt(postObj.getId());
  this.categoryId = parseInt(postObj.getCategoryId());
  this.added = postObj.getAddedTimestamp();
  this.userId = parseInt(postObj.getUserId());
  this.userName = userNamesObj.getName(this.userId);
  this.url = postObj.getUrl();
  this.thumbUrl = postObj.getThumbUrl();
  this.rate = parseInt(postRateObj.getRate(this.postId));
  this.views = parseInt(postObj.getViews());
  this.tags = postTagsObj.getTags(postObj.getId());

};

exports.postLink = postLink;

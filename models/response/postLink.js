//var
//  log = require(process.env.APP_PATH + "/lib/log");

var postLink = function (postObj, userNamesObj, postTagsObj, postRateObj, postViewsObj)
{
//  log.debug('postLink.construct()');

  this.postId = ~~(postObj.getId());
  this.categoryId = ~~(postObj.getCategoryId());
  this.added = postObj.getAddedTimestamp();
  this.userId = ~~(postObj.getUserId());
  this.userName = userNamesObj.getName(this.userId);
  this.url = postObj.getUrl();
  this.thumbUrl = postObj.getThumbUrl();  //TODO refactoring
  this.rate = ~~(postRateObj.getRate(this.postId));
  this.views = ~~(postViewsObj.getViews(this.postId));
  this.tags = postTagsObj.getTags(postObj.getId());

};

exports.postLink = postLink;

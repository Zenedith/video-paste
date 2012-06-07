//var
//  log = require(process.env.APP_PATH + "/lib/log");

var postLink = function (postObj)
{
//  log.debug('postLink.construct()');

  this.postId = postObj.getId();
  this.categoryId = postObj.getCategoryId();
  this.added = postObj.getAddedTimestamp();
  this.authorId = postObj.getAuthorId();  //TODO author name insted
  this.url = postObj.getUrl();
  this.rate = postObj.getRating();
  this.views = postObj.getViews();
};

exports.postLink = postLink;

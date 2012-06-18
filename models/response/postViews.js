//var
//  log = require(process.env.APP_PATH + "/lib/log");

var postViews = function (postObj)
{
//  log.debug('postViews.construct()');

  this.postId = parseInt(postObj.getId());
  this.views = parseInt(postObj.getViews());
};

exports.postViews = postViews;

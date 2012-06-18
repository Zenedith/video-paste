//var
//  log = require(process.env.APP_PATH + "/lib/log");

var postViews = function (postId, viewsValue)
{
//  log.debug('postViews.construct()');

  this.postId = parseInt(postId);
  this.views = parseInt(viewsValue);
};

exports.postViews = postViews;

var
  videoInfo = require(process.env.APP_PATH + "/models/response/videoInfo").videoInfo;

//  log = require(process.env.APP_PATH + "/lib/log");

var postLink = function (postObj, userNamesObj, postTagsObj, postRateObj, postViewsObj, videoInfoObj)
{
//  log.debug('postLink.construct()');
  
  this.postId = ~~(postObj.getId());
  
  var
    vObj = videoInfoObj.getVideoInfo(this.postId);
  
  this.added = postObj.getAddedTimestamp();
  this.userId = ~~(postObj.getUserId());
  this.userName = userNamesObj.getName(this.userId);
  this.videoInfo = new videoInfo(vObj);
  this.url = vObj.getUrl(); //TODO TEMP
  this.thumbUrl = vObj.getThumbUrl(); //TODO TEMP
  this.rate = ~~(postRateObj.getRate(this.postId));
  this.views = ~~(postViewsObj.getViews(this.postId));
  this.tags = postTagsObj.getTags(postObj.getId());

};

exports.postLink = postLink;

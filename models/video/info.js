var Video_Info = function() {
  this.id = '';
  this.url = '';
  this.title = '';
  this.description = '';
  this.thumbUrl = '';
  this.explicit = false;
};

Video_Info.prototype.loadByYoutube = function (data) {
  this.id = data.id;
  this.url = data.content[1];
  this.title = data.title;
  this.description = data.description;
  this.thumbUrl = data.thumbnail.hqDefault;
//  this.explicit = false;
};

Video_Info.prototype.loadByVimeo = function (data) {
  this.id = data.id;
  this.url = data.url;
  this.title = data.title;
  this.description = data.description;
  this.thumbUrl = data.thumbnail_medium;
//  this.explicit = false;
};

Video_Info.prototype.loadByDailymotion = function (data) {
  this.id = data.id;
  this.url = data.url;
  this.title = data.title;
  this.description = data.description;
  this.thumbUrl = data.thumbnail_medium_url;
  this.explicit = data.explicit;
};

Video_Info.prototype.getId = function() {
  return this.id;
};

Video_Info.prototype.getThumbUrl = function() {
  return this.thumbUrl;
};

exports.Video_Info = Video_Info;
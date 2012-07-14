var
  Video = require(process.env.APP_PATH + "/models/video").Video,
  videoObj = new Video(),
  secure = require("node-secure");

var Post_Decorator_VideoInfo = function(idsObj) {

  this.videoInfos = {};

  var
    ids = Object.keys(idsObj),
    idsLen = ids.length,
    fields = [],
    fieldsLen = 0;
  
  for (var k in videoObj) {
    if (videoObj.hasOwnProperty(k) && typeof(videoObj[k]) !== "function") {
      fields.push(k);
      ++fieldsLen;
    }
  }

  this.prepareKeys = function () {
    var
      classname = videoObj.getClassName(),
      keyFields = [];

    if (idsLen && fieldsLen) {
      for (var i = 0; i < idsLen; ++i) {
        for (var j = 0; j < fieldsLen; ++j) {
          keyFields.push([classname, ids[i], fields[j]]);
        }
      }
    }

    return {'get' : keyFields};
  };

  this.load = function (data) {
    if (idsLen && fieldsLen) {
      data.reverse(); //reverse order beacuse we use pop() array method
      
      for (var i = 0; i < idsLen; ++i) {
        var
          vObj = new Video();
        
        for (var j = 0; j < fieldsLen; ++j) {
          vObj[fields[j]] = data.pop();
        }
        
        this.videoInfos[ids[i]] = vObj;
      }
    }
  };

  this.getVideoInfo = function (id) {
    if (this.videoInfos.hasOwnProperty(id) && this.videoInfos[id]) {
      return this.videoInfos[id];
    }

    return new Video();
  };
};

exports.Post_Decorator_VideoInfo = Post_Decorator_VideoInfo;
secure.secureMethods(exports);

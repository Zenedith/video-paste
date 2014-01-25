//var
//  log = require(process.env.APP_PATH + "/lib/log");

var postRate = function (postId, rateValue) {
//  log.debug('postRate.construct()');

    this.postId = ~~(postId);
    this.rate = ~~(rateValue);
};

exports.postRate = postRate;

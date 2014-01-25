//var
//  log = require(process.env.APP_PATH + "/lib/log");

var getSession = function (sessObj) {
//  log.debug('getSession.construct()');

    var
        current_timestamp = Math.round(+new Date()),
        creationDate = new Date(current_timestamp),
        expiresDate = new Date(current_timestamp);

//  creationDate.setMilliseconds(current_timestamp * 1000);
//  expiresDate.setUTCMilliseconds(current_timestamp);

    this.id = sessObj.getId();
    this.creationDate = creationDate.toGMTString();
    this.expires = expiresDate.toUTCString();
    this.expiress = expiresDate.toString('dddd, MMMM ,yyyy');
    this.ss = expiresDate.toTimeString('dddd, MMMM ,yyyy');
    this.userId = ~~(sessObj.getUserId());
};

exports.getSession = getSession;

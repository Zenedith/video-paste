var
    Base = require(process.env.APP_PATH + "/models/base").Base,
    log = require(process.env.APP_PATH + "/lib/logger").logger,
//  util = require("util"),
    secure = require("node-secure");

var Session = function () {
    log.debug('Session.construct()');

    var SESSION_LIFETIME = 3600;

    this.__className = "Session";
    this.__device = '';
    this.__locale = '';
    this.__lifetime = 0;
    this.__key = '';
    this.__client_ip = '';
    this.__client_forwarder_for = '';
    this.__userId = 0;

    this.generateSession = function (key, ip, forwardedFor, userId) {
        log.debug('Session.generateSession()');
        var
            Session_Generator = require(process.env.APP_PATH + "/models/session/generator").Session_Generator,
            sgen = new Session_Generator(),
            current_timestamp = Math.round(+new Date() / 1000);

        this.setId(sgen.generateSession());
        this.__key = key;
        this.__lifetime = current_timestamp + SESSION_LIFETIME;
        this.__client_ip = ip;
        this.__client_forwarder_for = forwardedFor;
        this.__userId = ~~(userId) || 0;
    };

    this.isValidSession = function (id, callback) {
        var
            sanitize = require('sanitizer'),
            validator = require('validator'),
            _this = this;

        id = sanitize.escape(id);

        try {
            validator.isLength(id, 40, 40);
        }
        catch (e) {
            return callback(error(603, 'invalid api sessionId: (' + id + '), ' + e.message), null);
        }

        this.load(id, function (err, obj) {

            if (err) {
                return callback(error(603, err), null);
            }

            if (obj === null) {
                return callback(error(603, 'invalid api sessionId: (' + id + ')'), null);
            }

            var
                current_timestamp = Math.round(+new Date() / 1000);

            //check expiration time
            if (obj.getLifeTime() < current_timestamp) {
                //TODO remove sess
                return callback(error(603, 'sessionId has expired'), null);
            }

            var
                Key = require(process.env.APP_PATH + "/models/key").Key,
                key_obj = new Key(),
                apiKey = _this.getApiKey();

            //validate key
            key_obj.isValidKey(apiKey, function (err2, obj2) {

                //if something wrong
                if (err2) {
                    return callback(err2, null);
                }

                //async: update last used (renew session)
                _this.setObjectValueToDB(id, '__lifetime', (current_timestamp + SESSION_LIFETIME), function (err3, obj3) {
                    if (err3) {
                        log.critical(err3);
                    }
                });

                //don't wait to update last used time
                return callback(err, obj);
            });
        });
    };


    this.getCreationTime = function () {
        return ~~(this.__lifetime - SESSION_LIFETIME);
    };
};

Session.prototype.getLifeTime = function () {
    return ~~this.__lifetime;
};


Session.prototype.getUserId = function () {
    return ~~this.__userId;
};

Session.prototype.getApiKey = function () {
    return this.__key;
};

//extending base class
//util.inherits(Session, Base);
Session.prototype.__proto__ = Base.prototype;


exports.Session = Session;
secure.secureMethods(exports);

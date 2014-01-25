//winston don't supports printf format!
var
    config = require('config'),
    loggly_client = null;

if (config.app.use_loggly) {
    var
        loggly = require('loggly'),
        loggly_config = { subdomain: "zenedith" };

    loggly_client = loggly.createClient(loggly_config);
}

var
    currentTime = new Date(),
    month = currentTime.getMonth() + 1,
    day = currentTime.getDate(),
    year = currentTime.getFullYear(),
    log_filename = __dirname + '/../logs/' + year + '_' + month + '_' + day + '.log';

if (config.app.use_winston) {
    var winston = require('winston');

    var log = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)(),
            new (winston.transports.File)({ filename: log_filename, handleExceptions: true })
        ]
    });

    winston.handleExceptions();
    module.exports = log;
}
else {

    var
        Log = require('log'),
        util = require('util'),
        stream = '';

    if (config.app.log2file) {
        var fs = require('fs');
        stream = fs.createWriteStream(log_filename, { flags: 'a' });
    }

    Log.prototype.log = function (levelStr, args) {
        var i = 1;

        if (args.length > 1) {

            var formatRegExp = /%[sdj%]/g,
                len = args.length,
                str = String(args[0]).replace(formatRegExp, function (x) {
                    if (i >= len) {
                        return x;
                    }
                    switch (x) {
                        case '%s':
                            return String(args[i++]);
                        case '%d':
                            return Number(args[i++]);
                        case '%j':
                            return JSON.stringify(args[i++]);
                        case '%%':
                            return '%';
                        default:
                            return x;
                    }
                });
            for (var x = args[i]; i < len; x = args[++i]) {
                if (x === null || typeof x !== 'object') {
                    str += ' ' + x;
                } else {
                    str += ' ' + util.inspect(x);
                }
            }

            //clear and set new value
            args = {};
            args[0] = str;
        }

//      if (!process.env.TESTER) {
        console.log(args[0]);  //write also to stdout
//      }

        if (typeof args[0] !== 'string') {
            args[0] = 'error:' + JSON.stringify(args[0]);  //Converting circular structure to JSON
        }

        i = 1;

        if (Log[levelStr] <= this.level) {
            if (loggly_client) {
                loggly_client.log('b24d575e-842b-4b4d-ac91-6c0a12b60476', args[0]);
            }

            var msg = args[0].replace(/%s/g, function () {
                return args[i++];
            });
            this.stream.write(
                '[' + new Date().toUTCString() + ']' +
                    ' ' + levelStr +
                    ' ' + msg +
                    '\n');
        }
    };

    module.exports = new Log(config.app.log_level, stream);
}

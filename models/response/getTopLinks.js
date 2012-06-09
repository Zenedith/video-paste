//var
//  log = require(process.env.APP_PATH + "/lib/log");

var getTopLinks = function (listObj, callback)
{
//  log.debug('getTopLinks.construct()');

  this.count = parseInt(listObj.getCount());
  this.pages = parseInt(listObj.getPages());
  this.currentPage = parseInt(listObj.getCurrentPage());
  this.isNextPage = (this.currentPage < this.pages);
  this.isPrevPage = this.currentPage > 1;
  this.result = [];

  var
    _this = this,
    resList = listObj.getResults(),
    usersIds = {},
    postLink = require(process.env.APP_PATH + "/models/response/postLink").postLink,
    User_Names = require(process.env.APP_PATH + "/models/user/names").User_Names;

  //get all users ids
    for (var lp in resList) {
      var
        post = resList[lp],
        userId = post.getUserId();

      usersIds[userId] = '';
    }

    new User_Names(usersIds, function (err, userNamesObj) {

      if (err) {
        return callback(err, null);
      }

      for (var lp in resList) {
        var
          post = resList[lp];

        _this.result.push(new postLink(post, userNamesObj));
      }

      return callback(null, _this);
    });
};

exports.getTopLinks = getTopLinks;

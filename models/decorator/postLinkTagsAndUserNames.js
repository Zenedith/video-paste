var decorator_PostLinkTagsAndUserNames = function (resList, callback)
{
  var
    data = [],
    postLink = require(process.env.APP_PATH + "/models/response/postLink").postLink,
    Post_Decorator_Names = require(process.env.APP_PATH + "/models/post/decorator/names").Post_Decorator_Names,
    Post_Decorator_Tags = require(process.env.APP_PATH + "/models/post/decorator/tags").Post_Decorator_Tags,
    Post_Decorator_Rate = require(process.env.APP_PATH + "/models/post/decorator/rate").Post_Decorator_Rate,
    usersIds = {},
    postsIds = {};

  //get all users ids
    for (var lp in resList) {
      var
        post = resList[lp],
        userId = post.getUserId();

      usersIds[userId] = '';
      postsIds[post.getId()] = '';
    }

    new Post_Decorator_Names(usersIds, function (err, userNamesObj) {

      if (err) {
        return callback(err, null);
      }

      new Post_Decorator_Tags(postsIds, function (err2, postTagsObj) {

        if (err2) {
          return callback(err2, null);
        }

        new Post_Decorator_Rate(postsIds, function (err3, postRateObj) {

          if (err3) {
            return callback(err3, null);
          }

          for (var lp in resList) {
            var
              post = resList[lp];

            data.push(new postLink(post, userNamesObj, postTagsObj, postRateObj));
          }

          return callback(null, data);
        });
      });
    });
};

exports.decorator_PostLinkTagsAndUserNames = decorator_PostLinkTagsAndUserNames;

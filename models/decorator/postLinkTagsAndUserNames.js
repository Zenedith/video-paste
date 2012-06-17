var decorator_PostLinkTagsAndUserNames = function (resList, callback)
{
  var
    data = [],
    postLink = require(process.env.APP_PATH + "/models/response/postLink").postLink,
    User_Names = require(process.env.APP_PATH + "/models/user/names").User_Names,
    Post_Tags = require(process.env.APP_PATH + "/models/post/tags").Post_Tags,
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

    new User_Names(usersIds, function (err, userNamesObj) {

      if (err) {
        return callback(err, null);
      }

      new Post_Tags(postsIds, function (err2, postTagsObj) {

        if (err2) {
          return callback(err2, null);
        }

        for (var lp in resList) {
          var
            post = resList[lp];

          data.push(new postLink(post, userNamesObj, postTagsObj));
        }

        return callback(null, data);
      });
    });
};

exports.decorator_PostLinkTagsAndUserNames = decorator_PostLinkTagsAndUserNames;

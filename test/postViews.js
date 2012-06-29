if (!process.env.APP_PATH) {
  process.env.APP_PATH = __dirname + '/..';
}

var
  app = require(process.env.APP_PATH + '/server').api,
//  show_response = false,
  show_response = true,
  postId = 17,
  authorizedSessId = '08f13082c06e1010e360bdc07edd9641a1581dfa';  //expired by one hour

exports.testPostViewsValid = function (beforeExit, assert) {

  var post_data = '';

  assert.response(app, {
    url: '/api/postViews/' + authorizedSessId + '/' + postId,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': post_data.length
    },
    data: post_data
  }, {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testPostViewsValid result: ');
      console.log(json);
    }

    assert.equal(json.postId, postId);
    assert.ok(json.views > 0);
  }
  );
};

exports.testPostViewsInvalidPostId = function (beforeExit, assert) {

  var post_data = '';

  assert.response(app, {
    url: '/api/postViews/' + authorizedSessId + '/-1',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': post_data.length
    },
    data: post_data
    }, {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
    },
    function(res) {
      var json = JSON.parse(res.body);

      if (show_response) {
        console.log('testPostViewsInvalidPostId result: ');
        console.log(json);
      }

      assert.equal(json.error, 'ERR_BAD_REQUEST');
      assert.equal(json.code, 400);
    });
};

exports.testPostViewsInvalidPostIdNotExists = function (beforeExit, assert) {

  var post_data = '';

  assert.response(app, {
    url: '/api/postViews/' + authorizedSessId + '/1000000000001',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': post_data.length
    },
    data: post_data
  }, {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testPostViewsInvalidPostIdNotExists result: ');
      console.log(json);
    }

    assert.equal(json.error, 'ERR_BAD_REQUEST');
    assert.equal(json.code, 400);
  });
};

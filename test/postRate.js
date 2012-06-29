if (!process.env.APP_PATH) {
  process.env.APP_PATH = __dirname + '/..';
}

var
  app = require(process.env.APP_PATH + '/server').api,
  postId = 9,
  ratePostId = 9,
//  show_response = false,
  show_response = true,
  sessId = '1a02aff0f3c15c5e387d9674461f382e47db493b',  //expired by one hour
  authorizedSessId = 'ba626efb1118b3eb77e9804952822d5a6a5bf57d';  //expired by one hour

exports.testPostRateValid = function (beforeExit, assert) {

  var
    obj = {rate: -1},
    post_data = 'data=' + JSON.stringify(obj);

  assert.response(app, {
    url: '/api/postRate/' + authorizedSessId + '/' + ratePostId,
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
        console.log('testPostRateValid result: ');
        console.log(json);
      }

      assert.equal(json.postId, ratePostId);
      assert.isDefined(json.rate);
    });
};

exports.testPostRateInvalidSess = function (beforeExit, assert) {

  var
    obj = {rate: 1},
    post_data = 'data=' + JSON.stringify(obj);

  assert.response(app, {
    url: '/api/postRate/' + sessId + '/' + postId,
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
      console.log('testPostRateInvalidSess result: ');
      console.log(json);
    }

    assert.equal(json.error, 'ERR_UNAUTHORIZED');
    assert.equal(json.code, 401);
  }
  );
};

exports.testPostRateInvalidRate = function (beforeExit, assert) {

  var
    obj = {rate: 0},
    post_data = 'data=' + JSON.stringify(obj);

  assert.response(app, {
    url: '/api/postRate/' + authorizedSessId + '/' + postId,
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
      console.log('testPostRateInvalidRate result: ');
      console.log(json);
    }

    assert.equal(json.error, 'ERR_BAD_REQUEST');
    assert.equal(json.code, 400);
  }
);
};

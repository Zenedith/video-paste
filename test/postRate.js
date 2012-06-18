var
  app = require(__dirname + '/../app'),
  postId = 9,
  ratePostId = 9,
//  show_response = false,
  show_response = true,
  sessId = '5ba879b538a6e43cdc92cb07c3dbac13f42902bc',  //expired by one hour
  authorizedSessId = '1767953c0856664dca6292412e9d79a944dea2f9';  //expired by one hour

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
  }
  );
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

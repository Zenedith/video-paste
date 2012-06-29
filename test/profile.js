if (!process.env.APP_PATH) {
  process.env.APP_PATH = __dirname + '/..';
}

var
  app = require(process.env.APP_PATH + '/server').api,
//  show_response = false,
  show_response = true,
  userId = 1,
  authorizedSessId = 'ba626efb1118b3eb77e9804952822d5a6a5bf57d';  //expired by one hour

exports.testMyProfileValid = function (beforeExit, assert) {

  assert.response(app, {
    url: '/api/profile/' + authorizedSessId,
    method: 'GET',
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  },
  {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testMyProfileValid result: ');
      console.log(json);
    }

    assert.isDefined(json.userId);
    assert.isDefined(json.fistName);
    assert.isDefined(json.lastName);
    assert.isDefined(json.accountType);
    assert.isDefined(json.posts);
  }
  );
};

exports.testGivenProfileValid = function (beforeExit, assert) {

  assert.response(app, {
    url: '/api/profile/' + authorizedSessId + '/' + userId,
    method: 'GET',
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  },
  {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testGivenProfileValid result: ');
      console.log(json);
    }

    assert.equal(json.userId, userId);
    assert.isDefined(json.fistName);
    assert.isDefined(json.lastName);
    assert.isDefined(json.accountType);
    assert.isDefined(json.posts);
  }
  );
};

exports.testGivenProfileInvalidUserId = function (beforeExit, assert) {

  assert.response(app, {
    url: '/api/profile/' + authorizedSessId + '/-1',
    method: 'GET',
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  },
  {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testGivenProfileValid result: ');
      console.log(json);
    }

    assert.equal(json.error, 'ERR_INVALID_USER_ID');
    assert.equal(json.code, 607);
  }
  );
};

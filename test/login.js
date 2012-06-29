if (!process.env.APP_PATH) {
  process.env.APP_PATH = __dirname + '/..';
}

var
  app = require(process.env.APP_PATH + '/server').api,
  config = require('config'),
//  show_response = false,
  show_response = true,
  apikey = '6254b715bcc5d680';

exports.testLoginByFbValid = function (beforeExit, assert) {

  var
    obj = config.tests.login.facebook,
    post_data = 'data=' + JSON.stringify(obj);

  console.log(post_data);

  assert.response(app, {
    url: '/api/loginByFb/' + apikey,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': post_data.length
    },
    data: post_data
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testLoginByFbValid result: ');
      console.log(json);
    }

    assert.isDefined(json.sess);
    assert.isDefined(json.userId);
  }
  );
};

exports.testLoginByGoogleValid = function (beforeExit, assert) {
  var
    obj = config.tests.login.google,
    post_data = 'data=' + JSON.stringify(obj);

  assert.response(app, {
    url: '/api/loginByGoogle/' + apikey,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': post_data.length
    },
    data: post_data
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testLoginByGoogleValid result: ');
      console.log(json);
    }

    assert.isDefined(json.sess);
    assert.isDefined(json.userId);
  }
  );
};
exports.testLoginByTwitterValid = function (beforeExit, assert) {
  var
    obj = config.tests.login.twitter,
    post_data = 'data=' + JSON.stringify(obj);

  assert.response(app, {
    url: '/api/loginByTwitter/' + apikey,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': post_data.length
    },
    data: post_data
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testLoginByTwitterValid result: ');
      console.log(json);
    }

    assert.isDefined(json.sess);
    assert.isDefined(json.userId);
  }
  );
};
exports.testLoginByWindowsLiveValid = function (beforeExit, assert) {
  var
    obj = config.tests.login.live,
    post_data = 'data=' + JSON.stringify(obj);

  console.log(post_data);

  assert.response(app, {
    url: '/api/loginByWindowsLive/' + apikey,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': post_data.length
    },
    data: post_data
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testLoginByWindowsLiveValid result: ');
      console.log(json);
    }

    assert.isDefined(json.sess);
    assert.isDefined(json.userId);
  }
  );
};

exports.testLoginByFbInvalidKey = function (beforeExit, assert) {

  assert.response(app, {
    url: '/api/loginByFb/nokey',
    method: 'POST',
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  }, {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testLoginByFbInvalidKey result: ');
      console.log(json);
    }

    assert.equal(json.error, 'ERR_INVALID_KEY');
    assert.equal(json.code, 602);
  }
  );
};

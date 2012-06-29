if (!process.env.APP_PATH) {
  process.env.APP_PATH = __dirname + '/..';
}

var
  app = require(process.env.APP_PATH + '/server').api,
//  show_response = false,
  show_response = true,
  apikey = '6254b715bcc5d680';


exports.testGetSessionValid = function (beforeExit, assert) {

  assert.response(app, {
    url: '/api/getSession/' + apikey,
    method: 'GET',
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  }, {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testGetSessionValid result: ');
      console.log(json);
    }

    assert.isDefined(json.sess);
    assert.equal(json.userId, 0);
  }
  );
};

exports.testGetSessionNoKey = function (beforeExit, assert) {

  assert.response(app, {
    url: '/api/getSession/nokey',
    method: 'GET',
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  }, {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testGetSessionNoKey result: ');
      console.log(json);
    }

    assert.equal(json.error, 'ERR_INVALID_KEY');
    assert.equal(json.code, 602);
  }
  );
};

exports.testGetSessionInvalidKey = function (beforeExit, assert) {

  assert.response(app, {
    url: '/api/getSession/a3ca844f14fbb400',
    method: 'GET',
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  }, {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testGetSessionNoKey result: ');
      console.log(json);
    }

    assert.equal(json.error, 'ERR_INVALID_KEY');
    assert.equal(json.code, 602);
  }
  );
};

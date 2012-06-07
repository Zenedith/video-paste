var
  app = require(__dirname + '/../app'),
  qs = require('qs'),
  secure = require("node-secure");


exports.testSecureGlobals = function (beforeExit, assert) {
  console.log('testSecureGlobals');
  assert.ok(secure.isSecure());

};

exports.testIndexController = function (beforeExit, assert) {
  assert.response(app, {
    url: '/',
    method: 'GET',
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  }, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: /html/
  },
  function(res) {
//    var document = res.body;
    //TODO check documentation
//    assert.includes(document, '<title>Home</title>');
  }
  );
};

exports.testPostLinkMissingParams = function (beforeExit, assert) {
  assert.response(app, {
    url: '/api/postLink/8bb7ccb5aee1803bdcb482fe48a6997e7dfb9a27',
    method: 'POST',
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  }, {
    status: 400,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },
  function(res) {
    var json = JSON.parse(res.body);
    assert.equal(json.error, 'ERR_BAD_REQUEST');
    assert.equal(json.code, 400);
  }
  );
};
//TODO
//exports.testPostLink = function (beforeExit, assert) {
//
//  assert.response(app, {
//    url: '/api/postLink/8bb7ccb5aee1803bdcb482fe48a6997e7dfb9a27',
//    method: 'POST',
////    headers: { 'Content-Type': 'text/html; charset=utf-8' },
//    data: qs.stringify({
//      url: 'http://sss'
//    })
//
//  }, {
//    status: 201,
//    headers: { 'Content-Type': 'application/json; charset=utf-8' }
//  },
//  function(res) {
//    var json = JSON.parse(res.body);
//    console.log(json);
//    assert.equal(json.status, 'ok');
//  }
//);
//};

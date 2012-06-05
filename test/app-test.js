var
  app = require(__dirname + '/../app'),
  assert = require('assert'),
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
  }
//      ,
//
//      function(res) {
//        var document = res.body;
//        assert.includes(document, '<title>Home</title>');
//      }
);
};

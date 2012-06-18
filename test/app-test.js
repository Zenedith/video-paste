var
  app = require(__dirname + '/../app'),
//  show_response = false,
  show_response = true,
  secure = require("node-secure");


exports.testSecureGlobals = function (beforeExit, assert) {
  console.log('testSecureGlobals');
  assert.ok(secure.isSecure());
};

exports.testTaskCleanNewList = function (beforeExit, assert) {
  assert.response(app, {
    url: '/task/checkNewList',
    method: 'GET',
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  }, {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testTaskCleanNewList result: ');
      console.log(json);
    }

    assert.isDefined(json.removedCount);
  }
  );
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

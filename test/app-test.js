var
  app = require(__dirname + '/../app'),
  qs = require('qs'),
  postId = 1,
  apikey = 'a3ca844f14fbb45b',
  sessId = '03f3a43d42a61d6dafdda18210dd538fbee024db',  //expired by one hour
  secure = require("node-secure");


//exports.testSecureGlobals = function (beforeExit, assert) {
//  console.log('testSecureGlobals');
//  assert.ok(secure.isSecure());
//
//};
//
//exports.testIndexController = function (beforeExit, assert) {
//  assert.response(app, {
//    url: '/',
//    method: 'GET',
//    headers: { 'Content-Type': 'text/html; charset=utf-8' }
//  }, {
//    status: 200,
//    headers: { 'Content-Type': 'text/html; charset=utf-8' },
//    body: /html/
//  },
//  function(res) {
////    var document = res.body;
//    //TODO check documentation
////    assert.includes(document, '<title>Home</title>');
//  }
//  );
//};
//
//exports.testPostLinkMissingParams = function (beforeExit, assert) {
//  assert.response(app, {
//    url: '/api/postLink/' + sessId + '',
//    method: 'POST',
//    headers: { 'Content-Type': 'text/html; charset=utf-8' }
//  }, {
//    status: 400,
//    headers: { 'Content-Type': 'application/json; charset=utf-8' }
//  },
//  function(res) {
//    var json = JSON.parse(res.body);
//    assert.equal(json.error, 'ERR_BAD_REQUEST');
//    assert.equal(json.code, 400);
//  }
//  );
//};
//TODO
//exports.testPostLink = function (beforeExit, assert) {
//
//  assert.response(app, {
//    url: '/api/postLink/' + sessId + '',
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
//exports.testGetPostLinkInvalidSess = function (beforeExit, assert) {
//
//  assert.response(app, {
//    url: '/api/postLink/nosess/' + postId,
//    method: 'GET',
//    headers: { 'Content-Type': 'text/html; charset=utf-8' }
//  }, {
//    status: 603,
//    headers: { 'Content-Type': 'application/json; charset=utf-8' }
//  },
//  function(res) {
//    var json = JSON.parse(res.body);
//    assert.equal(json.error, 'ERR_INVALID_SESSION');
//    assert.equal(json.code, 603);
//  }
//  );
//};
//exports.testGetPostLinkValidSess = function (beforeExit, assert) {
//
//  assert.response(app, {
//    url: '/api/postLink/' + sessId + '/' + postId,
//    method: 'GET',
//    headers: { 'Content-Type': 'text/html; charset=utf-8' }
//  }, {
//    status: 200,
//    headers: { 'Content-Type': 'application/json; charset=utf-8' }
//  },
//  function(res) {
//    var json = JSON.parse(res.body);
//
//  }
//);
//};
//
//exports.testPostRate = function (beforeExit, assert) {
//
//  assert.response(app, {
//    url: '/api/postRate/' + sessId + '/' + postId,
//    method: 'POST',
////    headers: { 'Content-Type': 'text/html; charset=utf-8' },
//    data: qs.stringify({
//      rate: 1
//    })
//
//  }, {
////    status: 200,
//    headers: { 'Content-Type': 'application/json; charset=utf-8' }
//  },
//  function(res) {
//    var json = JSON.parse(res.body);
//    console.log(json);
//    assert.equal(json.postId, postId);
//    assert.ok(json.rate > 0);
//  }
//  );
//};
//
//exports.testPostRateInvalid = function (beforeExit, assert) {
//
//  assert.response(app, {
//    url: '/api/postRate/' + sessId + '/' + postId,
//    method: 'POST',
////    headers: { 'Content-Type': 'text/html; charset=utf-8' },
//    data: qs.stringify({
//      rate: -2
//    })
//
//  }, {
//    status: 400,
//    headers: { 'Content-Type': 'application/json; charset=utf-8' }
//  },
//  function(res) {
//    var json = JSON.parse(res.body);
////    console.log(json);
//    assert.equal(json.error, 'ERR_BAD_REQUEST');
//    assert.equal(json.code, 400);
//  }
//);
//};
//
//exports.testLoginByFb = function (beforeExit, assert) {
//
//  assert.response(app, {
//    url: '/api/loginByFb/' + apikey + '/666/zenedith/mat/ste/pl_PL',
//    method: 'GET',
//    headers: { 'Content-Type': 'text/html; charset=utf-8' }
//  }, {
//    status: 200,
//    headers: { 'Content-Type': 'application/json; charset=utf-8' }
//  },
//  function(res) {
//    var json = JSON.parse(res.body);
//    console.log(json);
//    assert.isNotNull(json.sess);
//    assert.isNotNull(json.userId);
//  }
//  );
//};
//
//exports.testLoginByFbNoKey = function (beforeExit, assert) {
//
//  assert.response(app, {
//    url: '/api/loginByFb/nokey/666/zenedith/mat/ste/pl_PL',
//    method: 'GET',
//    headers: { 'Content-Type': 'text/html; charset=utf-8' }
//  }, {
//    status: 602,
//    headers: { 'Content-Type': 'application/json; charset=utf-8' }
//  },
//  function(res) {
//    var json = JSON.parse(res.body);
//    console.log(json);
//  assert.equal(json.error, 'ERR_INVALID_KEY');
//  assert.equal(json.code, 602);
//  }
//  );
//};
//
//exports.testGetSessionValid = function (beforeExit, assert) {
//
//  assert.response(app, {
//    url: '/api/getSession/' + apikey,
//    method: 'GET',
//    headers: { 'Content-Type': 'text/html; charset=utf-8' }
//  }, {
//    status: 200,
//    headers: { 'Content-Type': 'application/json; charset=utf-8' }
//  },
//  function(res) {
//    var json = JSON.parse(res.body);
//    console.log(json);
//    assert.isNotNull(json.sess);
//    assert.equal(json.userId, 0);
//  }
//  );
//};

//exports.testGetSessionNoKey = function (beforeExit, assert) {
//
//  assert.response(app, {
//    url: '/api/getSession/nokey',
//    method: 'GET',
//    headers: { 'Content-Type': 'text/html; charset=utf-8' }
//  }, {
//    status: 602,
//    headers: { 'Content-Type': 'application/json; charset=utf-8' }
//  },
//  function(res) {
//    var json = JSON.parse(res.body);
//    console.log(json);
//    assert.equal(json.error, 'ERR_INVALID_KEY');
//    assert.equal(json.code, 602);
//  }
//  );
//};
//
//exports.testPostValid = function (beforeExit, assert) {
//
//  assert.response(app, {
//    url: '/api/postViews/' + sessId + '/' + postId,
//    method: 'POST',
////    headers: { 'Content-Type': 'text/html; charset=utf-8' }
//  }, {
//    status: 200,
//    headers: { 'Content-Type': 'application/json; charset=utf-8' }
//  },
//  function(res) {
//    var json = JSON.parse(res.body);
////    console.log(json);
//    assert.equal(json.postId, postId);
////    assert.equal(json.views, 1);
//  }
//  );
//};
//
//exports.testPostValidInvalidPostId = function (beforeExit, assert) {
//
//  assert.response(app, {
//    url: '/api/postViews/' + sessId + '/-1',
//    method: 'POST',
////    headers: { 'Content-Type': 'text/html; charset=utf-8' }
//  }, {
//    status: 400,
//    headers: { 'Content-Type': 'application/json; charset=utf-8' }
//  },
//  function(res) {
//    var json = JSON.parse(res.body);
//    assert.equal(json.error, 'ERR_BAD_REQUEST');
//    assert.equal(json.code, 400);
//  }
//  );
//};
//
exports.testGetTopLinksValid = function (beforeExit, assert) {

  assert.response(app, {
    url: '/api/getTopLinks/' + sessId + '/0/1/1',
    method: 'GET',
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  }, {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },
  function(res) {
    var json = JSON.parse(res.body);
    console.log(json);
    assert.isNotNull(json.count);
    assert.isNotNull(json.pages);
    assert.isNotNull(json.currentPage);
    assert.isNotNull(json.isNextPage);
    assert.isNotNull(json.isPrevPage);
    assert.isNotNull(json.result);
  }
  );
};
var
  app = require(__dirname + '/../app'),
//  show_response = false,
  show_response = true,
  postId = 4,
  apikey = '6254b715bcc5d680',
  sessId = '5ba879b538a6e43cdc92cb07c3dbac13f42902bc',  //expired by one hour
  authorizedSessId = 'ae9af879cbd68baae3be01d745a813fb697f85ad';  //expired by one hour;

exports.testPostLinkCreateValid = function (beforeExit, assert) {
  var
    obj = {url: 'https://www.youtube.com/watch?v=hFmPRt_B3Tk', tags: ['fun', 'kot']},
    post_data = 'data=' + JSON.stringify(obj);

  assert.response(app, {
    url: '/api/postLink/' + authorizedSessId,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': post_data.length
    },
    data: post_data
  }, {
    status: 201,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testPostLinkCreateValid result: ');
      console.log(json);
    }

    assert.isDefined(json.postId);
    assert.ok(json.postId > 0, 'Empty postId');
    assert.isDefined(json.added);
    assert.ok(json.added > 0, 'Empty added time');
    assert.isDefined(json.userId);
    assert.ok(json.userId > 0, 'Empty userId');
    assert.isDefined(json.userName);
    assert.isDefined(json.url);
    assert.isDefined(json.rate);
    assert.isDefined(json.views);
    assert.isDefined(json.tags);
  }
  );
};

exports.testPostLinkMissingParams = function (beforeExit, assert) {

  var post_data = '';

  assert.response(app, {
    url: '/api/postLink/' + authorizedSessId + '',
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
      console.log('testPostLinkMissingParams result: ');
      console.log(json);
    }

    assert.equal(json.error, 'ERR_BAD_REQUEST');
    assert.equal(json.code, 400);
  }
  );
};

exports.testPostLinkCreateTestConverter = function (beforeExit, assert) {
  var
    obj = {url: 'http://m.youtube.com/watch?v=BrBQvJ-anB8'},
    post_data = 'data=' + JSON.stringify(obj);

  assert.response(app, {
    url: '/api/postLink/' + authorizedSessId + '',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': post_data.length
    },
    data: post_data
  }, {
    status: 201,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testPostLinkCreateTestConverter result: ');
      console.log(json);
    }

    assert.isDefined(json.postId);
    assert.ok(json.postId > 0, 'Empty postId');
    assert.isDefined(json.added);
    assert.ok(json.added > 0, 'Empty added time');
    assert.isDefined(json.userId);
    assert.ok(json.userId > 0, 'Empty userId');
    assert.isDefined(json.userName);
    assert.isDefined(json.url);
    assert.isDefined(json.rate);
    assert.isDefined(json.views);
    assert.isDefined(json.tags);
  }
  );
};
exports.testPostLinkCreateInvalidUrl = function (beforeExit, assert) {

  var
    obj = {url: 'http://sss.wp.pl'},
    post_data = 'data=' + JSON.stringify(obj);

  assert.response(app, {
    url: '/api/postLink/' + authorizedSessId,
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
      console.log('testPostLinkCreateInvalidUrl result: ');
      console.log(json);
    }

    assert.equal(json.error, 'ERR_BAD_REQUEST');
    assert.equal(json.code, 400);
  }
  );
};


exports.testGetPostLinkCreateInvalidSess = function (beforeExit, assert) {

  var
    obj = {url: 'https://www.youtube.com/watch?v=hFmPRt_B3Tk'},
    post_data = 'data=' + JSON.stringify(obj);

  assert.response(app, {
    url: '/api/postLink/' + sessId + '',
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
      console.log('testGetPostLinkCreateInvalidSess result: ');
      console.log(json);
    }

    assert.equal(json.error, 'ERR_UNAUTHORIZED');
    assert.equal(json.code, 401);
  }
);
};

exports.testGetPostLinkValid = function (beforeExit, assert) {

  assert.response(app, {
    url: '/api/postLink/' + sessId + '/' + postId,
    method: 'GET',
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  }, {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testGetPostLinkValid result: ');
      console.log(json);
    }

    assert.isDefined(json.postId);
    assert.ok(json.postId > 0, 'Empty postId');
    assert.isDefined(json.added);
    assert.ok(json.added > 0, 'Empty added time');
    assert.isDefined(json.userId);
    assert.ok(json.userId > 0, 'Empty userId');
    assert.isDefined(json.userName);
    assert.isDefined(json.url);
    assert.isDefined(json.rate);
    assert.isDefined(json.views);
    assert.isDefined(json.tags);
  }
);
};

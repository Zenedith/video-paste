var
  app = require(__dirname + '/../app'),
  qs = require('qs'),
//  postId = 21,
  postId = 48,
  apikey = 'a3ca844f14fbb45b',
  sessId = 'b0dd24ca1614aa6387d777d525be4a9b5f72e845',  //expired by one hour
  authorizedSessId = '16f436bd7be7186dc7b0b4ad4f10b3a9205abf6b',  //expired by one hour
//  show_response = false,
  show_response = true,
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

  var post_data = qs.stringify({'url': 'http://m.youtube.com/index?desktop_uri=%2F&gl=PL#/watch?feature=m-feedf&v=BrBQvJ-anB8'});
//  var post_data = qs.stringify({'url': 'http://touch.dailymotion.com/video/xef0k9_fists-of-bruce-lee_shortfilms'});

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
  }
  );
};
exports.testPostLinkCreateInvalidUrl = function (beforeExit, assert) {

  var post_data = qs.stringify({'url': 'http://sss.wp.pl'});

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
exports.testPostLinkCreate = function (beforeExit, assert) {

  var post_data = qs.stringify({'url': 'https://www.youtube.com/watch?v=hFmPRt_B3Tk'});

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
      console.log('testPostLinkCreate result: ');
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
  }
  );
};
exports.testGetPostLinkCreateInvalidSess = function (beforeExit, assert) {

  var post_data = qs.stringify({'url': 'http://sss.wp.pl'});

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
  }
);
};

exports.testPostRateValid = function (beforeExit, assert) {

  var post_data = qs.stringify({rate: 1});

  assert.response(app, {
    url: '/api/postRate/' + authorizedSessId + '/' + 11,
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

    assert.equal(json.postId, 11);
    assert.ok(json.rate > 0);
  }
  );
};

exports.testPostRateInvalidSess = function (beforeExit, assert) {

  var post_data = qs.stringify({rate: 1});

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

  var post_data = qs.stringify({rate: 0});

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

exports.testLoginByFbValid = function (beforeExit, assert) {

  assert.response(app, {
    url: '/api/loginByFb/' + apikey + '/6661/zenedith/mat/ste/pl_PL',
    method: 'GET',
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  }, {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testLoginByFbValid result: ');
      console.log(json);
    }

    assert.isNotNull(json.sess);
    assert.isNotNull(json.userId);
  }
  );
};

exports.testLoginByFbInvalidKey = function (beforeExit, assert) {

  assert.response(app, {
    url: '/api/loginByFb/nokey/666/zenedith/mat/ste/pl_PL',
    method: 'GET',
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

    assert.isNotNull(json.sess);
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

exports.testPostViewsValid = function (beforeExit, assert) {

  var post_data = '';

  assert.response(app, {
    url: '/api/postViews/' + authorizedSessId + '/' + postId,
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
      console.log('testPostViewsValid result: ');
      console.log(json);
    }

    assert.equal(json.postId, postId);
    assert.ok(json.views > 0);
  }
  );
};
exports.testPostViewsInvalidPostId = function (beforeExit, assert) {

  var post_data = '';

  assert.response(app, {
    url: '/api/postViews/' + sessId + '/-1',
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
        console.log('testPostViewsInvalidPostId result: ');
        console.log(json);
      }

      assert.equal(json.error, 'ERR_BAD_REQUEST');
      assert.equal(json.code, 400);
    }
  );
};
exports.testPostViewsInvalidPostId = function (beforeExit, assert) {

  var post_data = '';

  assert.response(app, {
    url: '/api/postViews/' + authorizedSessId + '/-1',
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
      console.log('testPostViewsInvalidPostId result: ');
      console.log(json);
    }

    assert.equal(json.error, 'ERR_BAD_REQUEST');
    assert.equal(json.code, 400);
  }
  );
};
exports.testGetTopLinksValid = function (beforeExit, assert) {

  assert.response(app, {
    url: '/api/getTopLinks/' + sessId + '/0/2/1',
    method: 'GET',
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  }, {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testGetTopLinksValid result: ');
      console.log(json);
    }

    assert.isNotNull(json.count);
    assert.isNotNull(json.pages);
    assert.isNotNull(json.currentPage);
    assert.isNotNull(json.isNextPage);
    assert.isNotNull(json.isPrevPage);
    assert.isNotNull(json.result);
  }
  );
};
var
  app = require(__dirname + '/../app'),
  config = require('config'),
  postId = 101,
  ratePostId = 99,
  apikey = 'a3ca844f14fbb45b',
  sessId = 'e86d4903fec7a6acd46df456a5ae1535b5225cd5',  //expired by one hour
  authorizedSessId = 'e020154a0af6cf2b8ddfc15a7bd19a42efafce1f',  //expired by one hour
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
exports.testPostLinkCreateValid = function (beforeExit, assert) {
  var
    obj = {url: 'https://www.youtube.com/watch?v=hFmPRt_B3Tk', tags: ['funy', 'test']},
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
  }
);
};

exports.testPostRateValid = function (beforeExit, assert) {

  var
    obj = {rate: 1},
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
    assert.ok(json.rate > 0);
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

exports.testLoginByFbValid = function (beforeExit, assert) {

  var
    obj = config.tests.login.facebook,
    post_data = 'data=' + JSON.stringify(obj);

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

    assert.isDefined(json.count);
    assert.isDefined(json.pages);
    assert.isDefined(json.currentPage);
    assert.isDefined(json.isNextPage);
    assert.isDefined(json.isPrevPage);
    assert.isDefined(json.result);
  }
  );
};
exports.testGetTopLinksInvalidLimit = function (beforeExit, assert) {

  assert.response(app, {
    url: '/api/getTopLinks/' + sessId + '/0/211/1',
    method: 'GET',
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  }, {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testGetTopLinksInvalidLimit result: ');
      console.log(json);
    }

    assert.equal(json.error, 'ERR_BAD_REQUEST');
    assert.equal(json.code, 400);
  }
  );
};
exports.testGetNewLinksValid = function (beforeExit, assert) {

  assert.response(app, {
    url: '/api/getNewLinks/' + sessId + '/0/2/1',
    method: 'GET',
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  }, {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testGetNewLinksValid result: ');
      console.log(json);
    }

    assert.isDefined(json.count);
    assert.isDefined(json.pages);
    assert.isDefined(json.currentPage);
    assert.isDefined(json.isNextPage);
    assert.isDefined(json.isPrevPage);
    assert.isDefined(json.result);
  }
  );
};
exports.testGetNewLinksInvalidLimit = function (beforeExit, assert) {

  assert.response(app, {
    url: '/api/getNewLinks/' + sessId + '/0/211/1',
    method: 'GET',
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  }, {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testGetNewLinksInvalidLimit result: ');
      console.log(json);
    }

    assert.equal(json.error, 'ERR_BAD_REQUEST');
    assert.equal(json.code, 400);
  }
  );
};
exports.testGetTagsValid = function (beforeExit, assert) {

  assert.response(app, {
    url: '/api/getTags/' + apikey + '/1/1',
    method: 'GET',
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  }, {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testGetTagsValid result: ');
      console.log(json);
    }

    assert.isDefined(json.count);
    assert.isDefined(json.pages);
    assert.isDefined(json.currentPage);
    assert.isDefined(json.isNextPage);
    assert.isDefined(json.isPrevPage);
    assert.isDefined(json.result);
  }
  );
};
exports.testGetTagsInvalidKey = function (beforeExit, assert) {

  assert.response(app, {
    url: '/api/getTags/nokey/1/1',
    method: 'GET',
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  }, {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testGetTagsValid result: ');
      console.log(json);
    }

    assert.equal(json.error, 'ERR_INVALID_KEY');
    assert.equal(json.code, 602);
  }
  );
};
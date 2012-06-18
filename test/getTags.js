var
  app = require(__dirname + '/../app'),
//  show_response = false,
  show_response = true,
  apikey = '6254b715bcc5d680';

exports.testGetTagsValid = function (beforeExit, assert) {

  assert.response(app, {
    url: '/api/getTags/' + apikey + '/3/1/fun',
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

exports.testGetTagsValidNoSearchKey = function (beforeExit, assert) {

  assert.response(app, {
    url: '/api/getTags/' + apikey + '/3/1',
    method: 'GET',
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  }, {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testGetTagsValidNoSearchKey result: ');
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

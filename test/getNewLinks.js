var
  app = require(__dirname + '/../app'),
//  show_response = false,
  show_response = true,
  sessId = 'e0c2154c9a5bc1bf5fab42108bf0881ff0172028';  //expired by one hour

exports.testGetNewLinksValid = function (beforeExit, assert) {

  assert.response(app, {
    url: '/api/getNewLinks/' + sessId + '/0/10/1',
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

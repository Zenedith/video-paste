var
  app = require(__dirname + '/../app'),
//  show_response = false,
  show_response = true,
  sessId = 'ae9af879cbd68baae3be01d745a813fb697f85ad';  //expired by one hour

exports.testGetTopLinksValid = function (beforeExit, assert) {

  assert.response(app, {
    url: '/api/getTopLinks/' + sessId + '/0/20/1',
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

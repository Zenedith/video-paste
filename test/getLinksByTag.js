if (!process.env.APP_PATH) {
  process.env.APP_PATH = __dirname + '/..';
}

var
  app = require(process.env.APP_PATH + '/server').api,
  searchByTag = 'alfa',
//  show_response = false,
  show_response = true,
  sessId = '1a02aff0f3c15c5e387d9674461f382e47db493b';  //expired by one hour

exports.testGetLinksByTagValid = function (beforeExit, assert) {

  assert.response(app, {
    url: '/api/getLinksByTag/' + sessId + '/' + searchByTag +'/10/1',
    method: 'GET',
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  }, {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testGetLinksByTagValid result: ');
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

exports.testGetLinksByTagInvalidNoResults = function (beforeExit, assert) {

  assert.response(app, {
    url: '/api/getLinksByTag/' + sessId + '/hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhsssssssss/10/1',
    method: 'GET',
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  }, {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  },
  function(res) {
    var json = JSON.parse(res.body);

    if (show_response) {
      console.log('testGetLinksByTagValid result: ');
      console.log(json);
    }

    assert.equal(json.error, 'ERR_EMPTY_RESULTS');
    assert.equal(json.code, 601);
  }
  );
};

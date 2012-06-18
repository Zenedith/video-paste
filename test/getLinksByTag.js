var
  app = require(__dirname + '/../app'),
  searchByTag = 'alfa',
//  show_response = false,
  show_response = true,
  sessId = 'ae9af879cbd68baae3be01d745a813fb697f85ad';  //expired by one hour


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

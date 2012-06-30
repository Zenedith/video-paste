var
  supertest = require('supertest'),
  should = require('should'),
  Tester = require(__dirname + '/../models/tester').Tester,
  page = 1,
  limit = 10,
  searchKey = 'alfa',
  invalidSearchKey = 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhsssssssss';

exports.testGetLinksByTagValid = {
  'GET /api/getLinksByTag/:sessionId/:tagName/:limit/:page': {
    'should return valid json response with posts matched to tag': function (done){
      supertest(Tester.getApiVhost())
      .get('/api/getLinksByTag/' + Tester.getSession() + '/' + searchKey + '/' + limit + '/' + page)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function (err, res) {

        if (err) {
          done(err);
        }

        try {
          res.body.should.have.property('count');
          res.body.should.have.property('pages');
          res.body.should.have.property('currentPage');
          res.body.should.have.property('isNextPage');
          res.body.should.have.property('isPrevPage');
          res.body.should.have.property('result');
          done();
        }
        catch (e) {
          done(e);
        }
      });
    }
  }
};

exports.testGetLinksByTagInvalidNoResults = {
  'GET /api/getLinksByTag/:sessionId/:tagName/:limit/:page': {
    'should return error json response (ERR_EMPTY_RESULTS)': function (done){
      supertest(Tester.getApiVhost())
      .get('/api/getLinksByTag/' + Tester.getSession() + '/' + invalidSearchKey + '/' + limit + '/' + page)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function (err, res) {

        if (err) {
          done(err);
        }

        try {
          res.body.should.have.property('error');
          res.body.error.should.equal('ERR_EMPTY_RESULTS');
          res.body.should.have.property('code');
          res.body.code.should.equal(601);
          done();
        }
        catch (e) {
          done(e);
        }
      });
    }
  }
};
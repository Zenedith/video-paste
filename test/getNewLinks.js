var
  supertest = require('supertest'),
  should = require('should'),
  Tester = require(__dirname + '/../models/tester').Tester,
  page = 1,
  limit = 10,
  invalidLimit = 110,
  searchKey = 'fun';

exports.testGetNewLinksValid = {
  'GET /api/getNewLinks/:sessionId/:limit/:page': {
    'should return valid json response with new posts listing': function (done){
      supertest(Tester.getApiVhost())
      .get('/api/getNewLinks/' + Tester.getSession() + '/' + limit + '/' + page)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function (err, res) {

        if (err) {
          return done(err);
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

exports.testGetNewLinksInvalidLimit = {
  'GET /api/getNewLinks/:sessionId/:limit/:page': {
    'should return error json response (ERR_BAD_REQUEST)': function (done){
      supertest(Tester.getApiVhost())
      .get('/api/getNewLinks/' + Tester.getSession() + '/' + invalidLimit + '/' + page)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function (err, res) {

        if (err) {
          return done(err);
        }

        try {
          res.body.should.have.property('error');
          res.body.error.should.equal('ERR_BAD_REQUEST');
          res.body.should.have.property('code');
          res.body.code.should.equal(400);
          done();
        }
        catch (e) {
          done(e);
        }
      });
    }
  }
};
var
  supertest = require('supertest'),
  should = require('should'),
  Tester = require(__dirname + '/../models/tester').Tester,
  page = 1,
  limit = 20,
  invalidLimit = 111;

exports.testGetTopLinksValid = {
  'GET /api/getTopLinks/:sessionId/:categoryId/:limit/:page': {
    'should return valid json response with listing data': function (done){
      supertest(Tester.getApiVhost())
      .get('/api/getTopLinks/' + Tester.getSession() + '/0/'+ limit + '/' + page)
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

exports.testGetTopLinksInvalidLimit = {
  'GET /api/getTopLinks/:sessionId/:categoryId/:limit/:page': {
    'should return error json response (ERR_BAD_REQUEST)': function (done){
      supertest(Tester.getApiVhost())
      .get('/api/getTopLinks/' + Tester.getSession() + '/0/'+ invalidLimit + '/' + page)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function (err, res) {

        if (err) {
          done(err);
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
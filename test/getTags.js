var
  supertest = require('supertest'),
  should = require('should'),
  Tester = require(__dirname + '/../models/tester').Tester,
  page = 1,
  limit = 10,
  searchKey = 'fun';

exports.testGetTagsValidSearchKey = {
  'GET /api/getTags/:apiKey/:limit/:page/:searchKey': {
    'should return valid json response with listing tags matched to search key': function (done){
      supertest(Tester.getApiVhost())
      .get('/api/getTags/' + Tester.getApiKey() + '/' + limit + '/' + page + '/' + searchKey)
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

exports.testGetTagsValidNoSearchKey = {
  'GET /api/getTags/:apiKey/:limit/:page': {
    'should return valid json response with listing all tags': function (done){
      supertest(Tester.getApiVhost())
      .get('/api/getTags/' + Tester.getApiKey() + '/' + limit + '/' + page)
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


exports.testGetTagsInvalidKey = {
  'GET /api/getTags/nokey': {
    'should return error json response (ERR_INVALID_KEY)': function (done){
      supertest(Tester.getApiVhost())
      .get('/api/getTags/nokey')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function (err, res) {

        if (err) {
          done(err);
        }

        try {
          res.body.should.have.property('error');
          res.body.error.should.equal('ERR_INVALID_KEY');
          res.body.should.have.property('code');
          res.body.code.should.equal(602);
          done();
        }
        catch (e) {
          done(e);
        }
      });
    }
  }
};

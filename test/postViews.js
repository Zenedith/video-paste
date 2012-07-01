var
  supertest = require('supertest'),
  should = require('should'),
  Tester = require(__dirname + '/../models/tester').Tester,
  invalidPostId = -1;
  invalidPostIdNotExists = 1000000000001;

exports.testPostViewsValid = {
  'POST /api/postViews/:sessionId/:postId': {
    'should return incresed post views value': function (done){
      supertest(Tester.getApiVhost())
      .post('/api/postViews/' + Tester.getSession() + '/' + Tester.getPostViewsId())
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function (err, res) {

        if (err) {
          return done(err);
        }

        try {
          res.body.should.have.property('postId');
          res.body.should.have.property('views');
          res.body.views.should.above(Tester.getPostViewsCount());

          done();
        }
        catch (e) {
          done(e);
        }
      });
    }
  }
};

exports.testPostViewsInvalidPostId = {
  'POST /api/postViews/:sessionId/:postId': {
    'should return error json response (ERR_BAD_REQUEST)': function (done){
      supertest(Tester.getApiVhost())
      .post('/api/postViews/' + Tester.getSession() + '/' + invalidPostId)
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

exports.testPostViewsInvalidPostIdNotExists = {
  'POST /api/postViews/:sessionId/:postId': {
    'should return error json response (ERR_BAD_REQUEST)': function (done){
      supertest(Tester.getApiVhost())
      .post('/api/postViews/' + Tester.getSession() + '/' + invalidPostIdNotExists)
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

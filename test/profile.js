var
  supertest = require('supertest'),
  should = require('should'),
  Tester = require(__dirname + '/../models/tester').Tester,
  invalidUserId = -1,
  userId = 3;

exports.testMyProfileValid = {
  'GET /api/profile/:sessionId': {
    'should return valid json response with my profile info': function (done){
      supertest(Tester.getApiVhost())
      .get('/api/profile/' + Tester.getAuthSession())
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function (err, res) {

        if (err) {
          return done(err);
        }

        try {
          res.body.should.have.property('userId');
          res.body.should.have.property('fistName');
          res.body.should.have.property('lastName');
          res.body.should.have.property('accountType');
          res.body.should.have.property('topPosts');
          done();
        }
        catch (e) {
          done(e);
        }
      });
    }
  }
};

exports.testGivenProfileValid = {
    'GET /api/profile/:sessionId/:userId': {
      'should return valid json response with given userId profile info': function (done){
        supertest(Tester.getApiVhost())
        .get('/api/profile/' + Tester.getAuthSession() + '/' + userId)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end(function (err, res) {

          if (err) {
            return done(err);
          }

          try {
            res.body.should.have.property('userId');
            res.body.should.have.property('fistName');
            res.body.should.have.property('lastName');
            res.body.should.have.property('accountType');
            res.body.should.have.property('topPosts');
            done();
          }
          catch (e) {
            done(e);
          }
        });
      }
    }
};

exports.testGivenProfileInvalidUserId = {
  'GET /api/profile/:sessionId/:userId': {
    'should return error json response (ERR_INVALID_USER_ID)': function (done){
      supertest(Tester.getApiVhost())
      .get('/api/profile/' + Tester.getAuthSession() + '/' + invalidUserId)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function (err, res) {

        if (err) {
          return done(err);
        }

        try {
          res.body.should.have.property('error');
          res.body.error.should.equal('ERR_INVALID_USER_ID');
          res.body.should.have.property('code');
          res.body.code.should.equal(607);
          done();
        }
        catch (e) {
          done(e);
        }
      });
    }
  }
};
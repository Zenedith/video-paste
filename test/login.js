var
  supertest = require('supertest'),
  should = require('should'),
  config = require('config'),
  Tester = require(__dirname + '/../models/tester').Tester;

exports.testLoginByFbValid = {
  'POST /api/loginByFb/:apikey': {
    'should return valid auth json response with sess and userId property': function (done){
      supertest(Tester.getApiVhost())
      .post('/api/loginByFb/' + Tester.getApiKey())
      .send({data: JSON.stringify(config.tests.login.facebook)})
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function (err, res) {

        if (err) {
          done(err);
        }

        try {
          res.body.should.have.property('sess');
          res.body.should.have.property('userId');
          res.body.userId.should.above(0);

          Tester.setAuthUser(res.body.sess, res.body.userId);
          done();
        }
        catch (e) {
          done(e);
        }
      });
    }
  }
};

exports.testLoginByGoogleValid = {
  'POST /api/loginByGoogle/:apikey': {
    'should return valid auth json response with sess and userId property': function (done){
      supertest(Tester.getApiVhost())
      .post('/api/loginByGoogle/' + Tester.getApiKey())
      .send({data: JSON.stringify(config.tests.login.google)})
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function (err, res) {

        if (err) {
          done(err);
        }

        try {
          res.body.should.have.property('sess');
          res.body.should.have.property('userId');
          res.body.userId.should.above(0);

          Tester.setAuthUser(res.body.sess, res.body.userId);
          done();
        }
        catch (e) {
          done(e);
        }
      });
    }
  }
};

exports.testLoginByTwitterValid = {
  'POST /api/loginByTwitter/:apikey': {
    'should return valid auth json response with sess and userId property': function (done){
      supertest(Tester.getApiVhost())
      .post('/api/loginByTwitter/' + Tester.getApiKey())
      .send({data: JSON.stringify(config.tests.login.twitter)})
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function (err, res) {

        if (err) {
          done(err);
        }

        try {
          res.body.should.have.property('sess');
          res.body.should.have.property('userId');
          res.body.userId.should.above(0);

          Tester.setAuthUser(res.body.sess, res.body.userId);
          done();
        }
        catch (e) {
          done(e);
        }
      });
    }
  }
};

exports.testLoginByWindowsLiveValid = {
  'POST /api/loginByWindowsLive/:apikey': {
    'should return valid auth json response with sess and userId property': function (done){
      supertest(Tester.getApiVhost())
      .post('/api/loginByWindowsLive/' + Tester.getApiKey())
      .send({data: JSON.stringify(config.tests.login.live)})
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function (err, res) {

        if (err) {
          done(err);
        }

        try {
          res.body.should.have.property('sess');
          res.body.should.have.property('userId');
          res.body.userId.should.above(0);

          Tester.setAuthUser(res.body.sess, res.body.userId);
          done();
        }
        catch (e) {
          done(e);
        }
      });
    }
  }
};
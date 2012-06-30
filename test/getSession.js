var
  supertest = require('supertest'),
  should = require('should'),
  Tester = require(__dirname + '/../models/tester').Tester;

exports.testGetSessionValid = {
  'GET /api/getSession/:apikey': {
    'should return valid json response with sess and userId property': function (done){
      supertest(Tester.getApiVhost())
      .get('/api/getSession/' + Tester.getApiKey())
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function (err, res) {

        if (err) {
          done(err);
        }

        try {
          res.body.should.have.property('sess');
          res.body.should.have.property('userId');
          res.body.userId.should.equal(0);

          Tester.setSession(res.body.sess);
          done();
        }
        catch (e) {
          done(e);
        }
      });
    }
  }
};

exports.testGetSessionNoKey = {
  'GET /api/getSession/nokey': {
    'should return error json response (ERR_INVALID_KEY)': function (done){
      supertest(Tester.getApiVhost())
      .get('/api/getSession/nokey')
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


exports.testGetSessionInvalidKey = {
  'GET /api/getSession/invalidKey': {
    'should return error json response (ERR_INVALID_KEY)': function (done){
        supertest(Tester.getApiVhost())
        .get('/api/getSession/a3ca844f14fbb400')
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
var
  supertest = require('supertest'),
  should = require('should'),
  Tester = require(__dirname + '/../models/tester').Tester,
  secure = require("node-secure");

exports.testTaskCleanNewList = {
  'GET /task/checkNewList': {
      'should return json response with removedCount property': function (done){
        supertest(Tester.getAppVhost())
        .get('/task/checkNewList')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end(function (err, res) {

          if (err) {
            return done(err);
          }

          try {
            res.body.should.have.property('removedCount');
            done();
          }
          catch (e) {
            done(e);
          }
        });
      }
  }
};

exports.testIndexController = {
  'GET /': {
    'should return html documentation page': function (done){
      supertest(Tester.getAppVhost())
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/Available api helpers/)
      .expect(200, done);
    }
  }
};

exports.testIndexController = {
  'GET /debug/requests': {
    'should return html page': function (done){
      supertest(Tester.getAppVhost())
      .get('/debug/requests')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/Data/)
      .expect(/url/)
      .expect(/Response/)
      .expect(200, done);
    }
  }
};

exports.testSecureGlobals = {
  'GET /': {
    'should return html documentation page': function (done) {
      secure.isSecure().should.be.ok;
      done();
    }
  }
};

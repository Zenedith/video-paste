var
    supertest = require('supertest'),
    should = require('should'),
    config = require('config'),
    Tester = require(__dirname + '/../models/tester').Tester;

exports.testLoginByFbValid = {
    'POST /api/auth/fb': {
        'should return valid auth json response with sess and userId property': function (done) {
            supertest(Tester.getApiVhost())
                .post('/api/auth/fb?apiKey=' + Tester.getApiKey())
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(JSON.stringify(config.tests.login.facebook))
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200)
                .end(function (err, res) {

                    if (err) {
                        return done(err);
                    }

                    try {
                        res.body.should.have.property('id');
                        res.body.should.have.property('userId');
                        res.body.userId.should.above(0);

                        Tester.setPostOwnerSessId(res.body.id);
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
    'POST /api/auth/google': {
        'should return valid auth json response with sess and userId property': function (done) {
            supertest(Tester.getApiVhost())
                .post('/api/auth/google?apiKey=' + Tester.getApiKey())
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(JSON.stringify(config.tests.login.google))
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200)
                .end(function (err, res) {

                    if (err) {
                        return done(err);
                    }

                    try {
                        res.body.should.have.property('id');
                        res.body.should.have.property('userId');
                        res.body.userId.should.above(0);

                        Tester.setAuthUser(res.body.id, res.body.userId);
                        done();
                    }
                    catch (e) {
                        done(e);
                    }
                });
        }
    }
};

//exports.testLoginByTwitterValid = {
//  'POST /api/auth/twitter': {
//    'should return valid auth json response with sess and userId property': function (done){
//      supertest(Tester.getApiVhost())
//      .post('/api/auth/twitter?apiKey=' + Tester.getApiKey())
//      .send(JSON.stringify(config.tests.login.twitter))
//      .expect('Content-Type', 'application/json; charset=utf-8')
//      .expect(200)
//      .end(function (err, res) {
//
//        if (err) {
//          return done(err);
//        }
//
//        try {
//          res.body.should.have.property('id');
//          res.body.should.have.property('userId');
//          res.body.userId.should.above(0);
//
//          Tester.setAuthUser(res.body.id, res.body.userId);
//          done();
//        }
//        catch (e) {
//          done(e);
//        }
//      });
//    }
//  }
//};
//
//exports.testLoginByWindowsLiveValid = {
//  'POST /api/auth/live': {
//    'should return valid auth json response with sess and userId property': function (done){
//      supertest(Tester.getApiVhost())
//      .post('/api/auth/live?apiKey=' + Tester.getApiKey())
//      .send(JSON.stringify(config.tests.login.live))
//      .expect('Content-Type', 'application/json; charset=utf-8')
//      .expect(200)
//      .end(function (err, res) {
//
//        if (err) {
//          return done(err);
//        }
//
//        try {
//          res.body.should.have.property('id');
//          res.body.should.have.property('userId');
//          res.body.userId.should.above(0);
//
//          Tester.setAuthUser(res.body.id, res.body.userId);
//          done();
//        }
//        catch (e) {
//          done(e);
//        }
//      });
//    }
//  }
//};
var
    supertest = require('supertest'),
    should = require('should'),
    Tester = require(__dirname + '/../models/tester').Tester;

exports.testGetSessionValid = {
    'POST /api/auth': {
        'should return valid json response with sess and userId property': function (done) {
            supertest(Tester.getApiVhost())
                .post('/api/auth?apiKey=' + Tester.getApiKey())
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200)
                .end(function (err, res) {

                    if (err) {
                        return done(err);
                    }

                    try {
                        res.body.should.have.property('id');
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
    'POST /api/auth': {
        'should return error json response (ERR_INVALID_KEY)': function (done) {
            supertest(Tester.getApiVhost())
                .post('/api/auth')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200)
                .end(function (err, res) {

                    if (err) {
                        return done(err);
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
    'POST /api/auth?apiKey=invalidKey': {
        'should return error json response (ERR_INVALID_KEY)': function (done) {
            supertest(Tester.getApiVhost())
                .post('/api/auth?apiKey=invalidKey')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200)
                .end(function (err, res) {

                    if (err) {
                        return done(err);
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
var
    supertest = require('supertest'),
    should = require('should'),
    Tester = require(__dirname + '/../models/tester').Tester;

exports.testGeneratekey = {
    'POST /api/keys?generateKey=true': {
        'should return valid json response with key': function (done) {
            supertest(Tester.getApiVhost())
                .post('/api/keys?generateKey=true')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200)
                .end(function (err, res) {

                    if (err) {
                        return done(err);
                    }

                    try {
                        res.body.should.have.property('key');

                        Tester.setApiKey(res.body.key, true);
                        done();
                    }
                    catch (e) {
                        done(e);
                    }
                });
        }
    }
};

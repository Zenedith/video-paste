var
    supertest = require('supertest'),
    should = require('should'),
    config = require('config'),
    Tester = require(__dirname + '/../models/tester').Tester;

exports.testPostRateInvalidSess = {
    'POST /api/tap4video/posts/:postId/rate': {
        'should return error json response (ERR_UNAUTHORIZED)': function (done) {
            supertest(Tester.getApiVhost())
                .post('/api/tap4video/posts/' + Tester.getRatePostId() + '/rate?sessionId=' + Tester.getSession())
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(JSON.stringify({rate: -1}))
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200)
                .end(function (err, res) {

                    if (err) {
                        return done(err);
                    }

                    try {
                        res.body.should.have.property('error');
                        res.body.error.should.equal('ERR_UNAUTHORIZED');
                        res.body.should.have.property('code');
                        res.body.code.should.equal(401);
                        done();
                    }
                    catch (e) {
                        done(e);
                    }
                });
        }
    }
};

exports.testPostRateInvalidRate = {
    'POST /api/tap4video/posts/:postId/rate': {
        'should return error json response for rate:0 (ERR_BAD_REQUEST)': function (done) {
            supertest(Tester.getApiVhost())
                .post('/api/tap4video/posts/' + Tester.getRatePostId() + '/rate?sessionId=' + Tester.getSession())
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(JSON.stringify({rate: 0}))
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

exports.testPostRateValidDecrease = {
    'POST /api/tap4video/posts/:postId/rate': {
        'should return valid json response with decresed post rate': function (done) {
            supertest(Tester.getApiVhost())
                .post('/api/tap4video/posts/' + Tester.getRatePostId() + '/rate?sessionId=' + Tester.getAuthSession())
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(JSON.stringify({rate: -1}))
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200)
                .end(function (err, res) {

                    if (err) {
                        return done(err);
                    }

                    try {
                        res.body.should.have.property('postId');
                        res.body.should.have.property('rate');
                        res.body.rate.should.equal(Tester.getRatePostValue() - 1);

                        Tester.setPostToRate(res.body.postId, res.body.rate, true); //update current value
                        done();
                    }
                    catch (e) {
                        done(e);
                    }
                });
        }
    }
};
//
//exports.testPostRateValidIncrease = {
//    'POST /api/tap4video/posts/:postId/rate': {
//        'should return valid json response with incresed post rate': function (done) {
//            supertest(Tester.getApiVhost())
//                .post('/api/tap4video/posts/' + Tester.getRatePostId() + '/rate?sessionId=' + Tester.getAuthSession())
//                .set('Content-Type', 'application/json')
//                .set('Accept', 'application/json')
//                .send(JSON.stringify({rate: 1}))
//                .expect('Content-Type', 'application/json; charset=utf-8')
//                .expect(200)
//                .end(function (err, res) {
//
//                    if (err) {
//                        return done(err);
//                    }
//
//                    try {
//                        res.body.should.have.property('postId');
//                        res.body.should.have.property('rate');
//                        res.body.rate.should.equal(Tester.getRatePostValue() + 1);
//
//                        Tester.setPostToRate(res.body.postId, res.body.rate, true); //update current value
//                        done();
//                    }
//                    catch (e) {
//                        done(e);
//                    }
//                });
//        }
//    }
//};

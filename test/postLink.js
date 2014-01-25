var
    supertest = require('supertest'),
    should = require('should'),
    Tester = require(__dirname + '/../models/tester').Tester,
    invalidPostId = -1,
    invalidPostIdNotExists = 1000000000001,
    url = 'http://www.youtube.com/watch?v=BrBQvJ-anB8',
    vimeoUrl = 'http://vimeo.com/6271487',
    dailyUrl = 'http://www.dailymotion.com/video/ximfb0_i-love-lastarya_sexy',
    createPost = {url: url, tags: ['fun', 'kot'], sessionId: ""},
    createPostVimeo = {url: vimeoUrl, tags: ['spehere'], sessionId: ""},
    createPostDailymotion = {url: dailyUrl, tags: ['spehere'], sessionId: ""},
    createPostConvertYoutube = {url: 'http://m.youtube.com/watch?v=BrBQvJ-anB8', tags: ['alfa'], sessionId: ""},
    createPostConvertVimeo = {url: 'http://vimeo.com/m/6271487', tags: ['example'], sessionId: ""},
    createPostConvertDailymotion = {url: 'https://touch.dailymotion.com/video/ximfb0_i-love-lastarya_sexy', tags: ['sexy'], sessionId: ""},
    createPostInvalidUrl = {url: 'http://m.sss.pl/?v=BrBQvJ-anB8', tags: ['alfa'], sessionId: ""},
    createPostMissingUrlParam = {tags: ['fun', 'kot'], sessionId: ""};

exports.testPostLinkCreateValid = {
    'POST /api/tap4video/posts': {
        'should return new post object info': function (done) {

            //update sessionId
            createPost.sessionId = Tester.getAuthSession();

            supertest(Tester.getApiVhost())
                .post('/api/tap4video/posts')
                .send({data: JSON.stringify(createPost)})
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(201)
                .end(function (err, res) {

                    if (err) {
                        return done(err);
                    }

                    try {
                        res.body.should.have.property('postId');
                        res.body.postId.should.above(0);
                        res.body.should.have.property('added');
                        res.body.added.should.above(0);
                        res.body.should.have.property('userId');
                        res.body.userId.should.above(0);
                        res.body.should.have.property('userName');
                        res.body.userName.should.match(/^.+$/);  //not empty
                        res.body.should.have.property('url');
                        res.body.url.should.equal(url);
                        res.body.should.have.property('thumbUrl');
                        res.body.thumbUrl.should.match(/^.+$/);  //not empty
                        res.body.should.have.property('rate');
                        res.body.rate.should.equal(1);
                        res.body.should.have.property('views');
                        res.body.views.should.equal(0);
                        res.body.should.have.property('tags');
//          res.body.tags.should.have.length(2);  //TODO

                        Tester.setCreatedPostId(res.body.postId);
                        done();
                    }
                    catch (e) {
                        done(e);
                    }
                });
        }
    }
};

//exports.testPostLinkCreateTestConverterYoutube = {
//  'POST /api/tap4video/posts':{
//    'should return new post object info with converted youtube url':function (done) {
//
//      //update sessionId
//      createPostConvertYoutube.sessionId = Tester.getAuthSession();
//
//      supertest(Tester.getApiVhost())
//        .post('/api/tap4video/posts')
//        .send({data:JSON.stringify(createPostConvertYoutube)})
//        .expect('Content-Type', 'application/json; charset=utf-8')
//        .expect(201)
//        .end(function (err, res) {
//
//          if (err) {
//            return done(err);
//          }
//
//          try {
//            res.body.should.have.property('postId');
//            res.body.postId.should.above(0);
//            res.body.should.have.property('added');
//            res.body.added.should.above(0);
//            res.body.should.have.property('userId');
//            res.body.userId.should.above(0);
//            res.body.should.have.property('userName');
//            res.body.userName.should.match(/^.+$/);  //not empty
//            res.body.should.have.property('url');
//            res.body.url.should.equal(url);
//            res.body.should.have.property('thumbUrl');
//            res.body.thumbUrl.should.match(/^.+$/);  //not empty
//            res.body.should.have.property('rate');
//            res.body.rate.should.equal(1);
//            res.body.should.have.property('views');
//            res.body.views.should.equal(0);
//            res.body.should.have.property('tags');
////          res.body.tags.should.have.length(1);  //TODO
//
//            Tester.setCreatedPostId(res.body.postId);
//            done();
//          }
//          catch (e) {
//            done(e);
//          }
//        });
//    }
//  }
//};
//
//exports.testPostLinkCreateTestVimeo = {
//  'POST /api/tap4video/posts':{
//    'should return new post object info with vimeo url':function (done) {
//
//      //update sessionId
//      createPostVimeo.sessionId = Tester.getAuthSession();
//
//      supertest(Tester.getApiVhost())
//        .post('/api/tap4video/posts')
//        .send({data:JSON.stringify(createPostVimeo)})
//        .expect('Content-Type', 'application/json; charset=utf-8')
//        .expect(201)
//        .end(function (err, res) {
//
//          if (err) {
//            return done(err);
//          }
//
//          try {
//            res.body.should.have.property('postId');
//            res.body.postId.should.above(0);
//            res.body.should.have.property('added');
//            res.body.added.should.above(0);
//            res.body.should.have.property('userId');
//            res.body.userId.should.above(0);
//            res.body.should.have.property('userName');
//            res.body.userName.should.match(/^.+$/);  //not empty
//            res.body.should.have.property('url');
//            res.body.url.should.equal(vimeoUrl);
//            res.body.should.have.property('thumbUrl');
//            res.body.thumbUrl.should.match(/^.+$/);  //not empty
//            res.body.should.have.property('rate');
//            res.body.rate.should.equal(1);
//            res.body.should.have.property('views');
//            res.body.views.should.equal(0);
//            res.body.should.have.property('tags');
////          res.body.tags.should.have.length(1);  //TODO
//
//            Tester.setCreatedPostId(res.body.postId);
//            done();
//          }
//          catch (e) {
//            done(e);
//          }
//        });
//    }
//  }
//};
//
//exports.testPostLinkCreateTestConverterVimeo = {
//  'POST /api/tap4video/posts':{
//    'should return new post object info with converted vimeo url':function (done) {
//
//      //update sessionId
//      createPostConvertVimeo.sessionId = Tester.getAuthSession();
//
//      supertest(Tester.getApiVhost())
//        .post('/api/tap4video/posts')
//        .send({data:JSON.stringify(createPostConvertVimeo)})
//        .expect('Content-Type', 'application/json; charset=utf-8')
//        .expect(201)
//        .end(function (err, res) {
//
//          if (err) {
//            return done(err);
//          }
//
//          try {
//            res.body.should.have.property('postId');
//            res.body.postId.should.above(0);
//            res.body.should.have.property('added');
//            res.body.added.should.above(0);
//            res.body.should.have.property('userId');
//            res.body.userId.should.above(0);
//            res.body.should.have.property('userName');
//            res.body.userName.should.match(/^.+$/);  //not empty
//            res.body.should.have.property('url');
//            res.body.url.should.equal(vimeoUrl);
//            res.body.should.have.property('thumbUrl');
//            res.body.thumbUrl.should.match(/^.+$/);  //not empty
//            res.body.should.have.property('rate');
//            res.body.rate.should.equal(1);
//            res.body.should.have.property('views');
//            res.body.views.should.equal(0);
//            res.body.should.have.property('tags');
////          res.body.tags.should.have.length(1);  //TODO
//
//            Tester.setCreatedPostId(res.body.postId);
//            done();
//          }
//          catch (e) {
//            done(e);
//          }
//        });
//    }
//  }
//};
//
//exports.testPostLinkCreateTestDailymotion = {
//  'POST /api/tap4video/posts':{
//    'should return new post object info with dailymotion url':function (done) {
//
//      //update sessionId
//      createPostDailymotion.sessionId = Tester.getAuthSession();
//
//      supertest(Tester.getApiVhost())
//        .post('/api/tap4video/posts')
//        .send({data:JSON.stringify(createPostDailymotion)})
//        .expect('Content-Type', 'application/json; charset=utf-8')
//        .expect(201)
//        .end(function (err, res) {
//
//          if (err) {
//            return done(err);
//          }
//
//          try {
//            res.body.should.have.property('postId');
//            res.body.postId.should.above(0);
//            res.body.should.have.property('added');
//            res.body.added.should.above(0);
//            res.body.should.have.property('userId');
//            res.body.userId.should.above(0);
//            res.body.should.have.property('userName');
//            res.body.userName.should.match(/^.+$/);  //not empty
//            res.body.should.have.property('url');
//            res.body.url.should.equal(dailyUrl);
//            res.body.should.have.property('thumbUrl');
//            res.body.thumbUrl.should.match(/^.+$/);  //not empty
//            res.body.should.have.property('rate');
//            res.body.rate.should.equal(1);
//            res.body.should.have.property('views');
//            res.body.views.should.equal(0);
//            res.body.should.have.property('tags');
////          res.body.tags.should.have.length(1);  //TODO
//
//            Tester.setCreatedPostId(res.body.postId);
//            done();
//          }
//          catch (e) {
//            done(e);
//          }
//        });
//    }
//  }
//};
//exports.testPostLinkCreateTestConverterDailymotion = {
//  'POST /api/tap4video/posts':{
//    'should return new post object info with converted dailymotion url':function (done) {
//
//      //update sessionId
//      createPostConvertDailymotion.sessionId = Tester.getAuthSession();
//
//      supertest(Tester.getApiVhost())
//        .post('/api/tap4video/posts')
//        .send({data:JSON.stringify(createPostConvertDailymotion)})
//        .expect('Content-Type', 'application/json; charset=utf-8')
//        .expect(201)
//        .end(function (err, res) {
//
//          if (err) {
//            return done(err);
//          }
//
//          try {
//            res.body.should.have.property('postId');
//            res.body.postId.should.above(0);
//            res.body.should.have.property('added');
//            res.body.added.should.above(0);
//            res.body.should.have.property('userId');
//            res.body.userId.should.above(0);
//            res.body.should.have.property('userName');
//            res.body.userName.should.match(/^.+$/);  //not empty
//            res.body.should.have.property('url');
//            res.body.url.should.equal(dailyUrl);
//            res.body.should.have.property('thumbUrl');
//            res.body.thumbUrl.should.match(/^.+$/);  //not empty
//            res.body.should.have.property('rate');
//            res.body.rate.should.equal(1);
//            res.body.should.have.property('views');
//            res.body.views.should.equal(0);
//            res.body.should.have.property('tags');
////          res.body.tags.should.have.length(1);  //TODO
//
//            Tester.setCreatedPostId(res.body.postId);
//            done();
//          }
//          catch (e) {
//            done(e);
//          }
//        });
//    }
//  }
//};
//
//exports.testPostLinkCreateInvalidUrl = {
//  'POST /api/tap4video/posts':{
//    'should return error json response (ERR_BAD_REQUEST)':function (done) {
//
//      //update sessionId
//      createPostInvalidUrl.sessionId = Tester.getAuthSession();
//
//      supertest(Tester.getApiVhost())
//        .post('/api/tap4video/posts')
//        .send({data:JSON.stringify(createPostInvalidUrl)})
//        .expect('Content-Type', 'application/json; charset=utf-8')
//        .expect(200)
//        .end(function (err, res) {
//
//          if (err) {
//            return done(err);
//          }
//
//          try {
//            res.body.should.have.property('error');
//            res.body.error.should.equal('ERR_BAD_REQUEST');
//            res.body.should.have.property('code');
//            res.body.code.should.equal(400);
//            done();
//          }
//          catch (e) {
//            done(e);
//          }
//        });
//    }
//  }
//};
//
//exports.testGetPostLinkCreateInvalidSess = {
//  'POST /api/tap4video/posts':{
//    'should return error json response (ERR_BAD_REQUEST)':function (done) {
//
//      //update sessionId
//      createPost.sessionId = Tester.getSession();
//
//      supertest(Tester.getApiVhost())
//        .post('/api/tap4video/posts')
//        .send({data:JSON.stringify(createPost)})
//        .expect('Content-Type', 'application/json; charset=utf-8')
//        .expect(200)
//        .end(function (err, res) {
//
//          if (err) {
//            return done(err);
//          }
//
//          try {
//            res.body.should.have.property('error');
//            res.body.error.should.equal('ERR_UNAUTHORIZED');
//            res.body.should.have.property('code');
//            res.body.code.should.equal(401);
//            done();
//          }
//          catch (e) {
//            done(e);
//          }
//        });
//    }
//  }
//};
//
//exports.testPostLinkMissingParams = {
//  'POST /api/tap4video/posts':{
//    'should return error json response (ERR_BAD_REQUEST)':function (done) {
//
//      //update sessionId
//      createPostMissingUrlParam.sessionId = Tester.getAuthSession();
//
//      supertest(Tester.getApiVhost())
//        .post('/api/tap4video/posts')
//        .send({data:JSON.stringify(createPostMissingUrlParam)})
//        .expect('Content-Type', 'application/json; charset=utf-8')
//        .expect(200)
//        .end(function (err, res) {
//
//          if (err) {
//            return done(err);
//          }
//
//          try {
//            res.body.should.have.property('error');
//            res.body.error.should.equal('ERR_BAD_REQUEST');
//            res.body.should.have.property('code');
//            res.body.code.should.equal(400);
//            done();
//          }
//          catch (e) {
//            done(e);
//          }
//        });
//    }
//  }
//};

exports.testGetPostLinkValid = {
    'GET /api/tap4video/posts/:postId': {
        'should return valid json response with post info': function (done) {

            supertest(Tester.getApiVhost())
                .get('/api/tap4video/posts/' + Tester.getCreatedPostId() + '?sessionId=' + Tester.getSession())
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200)
                .end(function (err, res) {

                    if (err) {
                        return done(err);
                    }

                    try {
                        res.body.should.have.property('postId');
                        res.body.postId.should.above(0);
                        res.body.should.have.property('added');
                        res.body.added.should.above(0);
                        res.body.should.have.property('userId');
                        res.body.userId.should.above(0);
                        res.body.should.have.property('userName');
                        res.body.userName.should.match(/^.+$/);  //not empty
                        res.body.should.have.property('url');
                        res.body.url.should.equal(url);
                        res.body.should.have.property('thumbUrl');
                        res.body.thumbUrl.should.match(/^.+$/);  //not empty
                        res.body.should.have.property('rate');
                        res.body.rate.should.equal(1);
                        res.body.should.have.property('views');
                        res.body.views.should.equal(0);
                        res.body.should.have.property('tags');

                        Tester.setPostToIncreaseViews(res.body.postId, res.body.views);
                        Tester.setPostToRate(res.body.postId, res.body.rate);
                        done();
                    }
                    catch (e) {
                        done(e);
                    }
                });
        }
    }
};
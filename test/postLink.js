var
  supertest = require('supertest'),
  should = require('should'),
  Tester = require(__dirname + '/../models/tester').Tester,
  invalidPostId = -1;
  invalidPostIdNotExists = 1000000000001,
  url = 'http://www.youtube.com/watch?v=BrBQvJ-anB8',
  createPost = {url: url, tags: ['fun', 'kot']},
  createPostConvert = {url: 'http://m.youtube.com/watch?v=BrBQvJ-anB8', tags: ['alfa']},
  createPostInvalidUrl = {url: 'http://m.sss.pl/?v=BrBQvJ-anB8', tags: ['alfa']},
  createPostMissingUrlParam = {tags: ['fun', 'kot']};

exports.testPostLinkCreateValid = {
  'POST /api/postLink/:sessionId': {
    'should return new post object info': function (done){
      supertest(Tester.getApiVhost())
      .post('/api/postLink/' + Tester.getAuthSession())
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
          res.body.should.have.property('categoryId');
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

exports.testPostLinkCreateTestConverter = {
  'POST /api/postLink/:sessionId': {
    'should return new post object info with converted url': function (done){
      supertest(Tester.getApiVhost())
      .post('/api/postLink/' + Tester.getAuthSession())
      .send({data: JSON.stringify(createPostConvert)})
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(201)
      .end(function (err, res) {

        if (err) {
          return done(err);
        }

        try {
          res.body.should.have.property('postId');
          res.body.postId.should.above(0);
          res.body.should.have.property('categoryId');
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
//          res.body.tags.should.have.length(1);  //TODO

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

exports.testPostLinkCreateInvalidUrl = {
    'POST /api/postLink/:sessionId': {
      'should return error json response (ERR_BAD_REQUEST)': function (done){
        supertest(Tester.getApiVhost())
        .post('/api/postLink/' + Tester.getAuthSession())
        .send({data: JSON.stringify(createPostInvalidUrl)})
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

exports.testGetPostLinkCreateInvalidSess = {
  'POST /api/postLink/:sessionId': {
    'should return error json response (ERR_BAD_REQUEST)': function (done){
      supertest(Tester.getApiVhost())
      .post('/api/postLink/' + Tester.getSession())
      .send({data: JSON.stringify(createPost)})
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

exports.testPostLinkMissingParams = {
  'POST /api/postLink/:sessionId': {
    'should return error json response (ERR_BAD_REQUEST)': function (done){
      supertest(Tester.getApiVhost())
      .post('/api/postLink/' + Tester.getAuthSession())
      .send({data: JSON.stringify(createPostMissingUrlParam)})
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

exports.testGetPostLinkValid = {
  'GET /api/postLink/:sessionId/:postId': {
    'should return valid json response with post info': function (done){
      supertest(Tester.getApiVhost())
      .get('/api/postLink/' + Tester.getSession() + '/' + Tester.getCreatedPostId())
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function (err, res) {

        if (err) {
          return done(err);
        }

        try {
          res.body.should.have.property('postId');
          res.body.postId.should.above(0);
          res.body.should.have.property('categoryId');
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
          done();
        }
        catch (e) {
          done(e);
        }
      });
    }
  }
};
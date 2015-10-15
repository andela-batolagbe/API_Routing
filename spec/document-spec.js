var request = require('supertest');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var secret = require('../config/config');

var app = require('../server');
var User = require('../app/models/user-model');
var Document = require('../app/models/document-model');

var data1 = fs.readFileSync(__dirname + '/fixtures/documents.json');
var data2 = fs.readFileSync(__dirname + '/fixtures/users.json');

var docData = JSON.parse(data1);
var userData = JSON.parse(data2);

describe('POST /documents/', function() {

  afterEach(function(done) {

    Document.remove({}, function(err) {
      if (err) {
        console.log(err);
      }
    });
    done();
  });


  it('should post new document', function(done) {


    var id, newUser = new User(userData[0]);

    newUser.save(function(err) {
      if (err) {
        console.log(err);
      }
    });

    id = newUser.id;

    token = jwt.sign(newUser, secret.key, {
      expiresIn: 144000
    });

    request(app)
      .post('/documents')
      .set('x-access-token', token)
      .send({
        title: 'sample document',
        content: 'this is a document for test purpose',
        ownerId: id
      })
      .end(function(err, response) {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(jasmine.objectContaining({
          success: true,
          message: 'Your document has been saved'
        }));
        expect(err).toBeNull();
        if (err) {
          console.log(err);
        }
        done();
      });

  });

});

describe('GET /documents/', function() {

  var id, token;

  beforeEach(function(done) {

    var docDetail = docData[0];
    var newUser = new User(userData[0]);

    newUser.save(function(err) {
      if (err) {
        console.log(err);
      }
    });

    docDetail.ownerId = newUser.id;

    var newDoc = new Document(docDetail);

    newDoc.save(function(err) {
      if (err) {
        console.log(err);
      }
    });

    id = newDoc.id;

    token = jwt.sign(newUser, secret.key, {
      expiresIn: 144000
    });

    done();
  });


  afterEach(function(done) {

    Document.remove({}, function(err) {
      if (err) {
        console.log(err);
      }
    });
    User.remove({}, function(err) {
      if (err) {
        console.log(err);
      }
    });
    done();
  });

  it('should return all documents', function(done) {

    for (var i = 1; i < docData.length; i++) {

      var details = docData[i];
      var newUsers = new User(userData[i]);

      newUsers.save();

      details.ownerId = newUsers._id;

      var newDocument = new Document(details);

      newDocument.save(function(err) {
        if (err) {
          console.log(err);
        }
      });

    }
    request(app)
      .get('/documents')
      .set('x-access-token', token)
      .expect('Content-Type', /json/)
      .end(function(err, response) {
        expect(response.statusCode).toBe(200);
        expect(response.body[0].title).toEqual('Birthday details');
        expect(response.body[0].content)
          .toEqual('Direction and guide for my birthday party happening tommorrow');
        expect(response.body[1].title).toEqual('Event calendar');
        expect(response.body[2].title).toEqual('How to make money');
        expect(response.body[3].content)
          .toEqual('a report on the activities of all users since we launched');
        expect(response.body[4].title).toEqual('User introduction');
        if (err) {
          return err;
        }
        done();
      });
  });

  it('should return a single document', function(done) {

    request(app)
      .get('/documents/' + id)
      .set('x-access-token', token)
      .expect('Content-Type', /json/)
      .end(function(err, response) {
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toEqual('User introduction');
        expect(response.body.content)
          .toEqual('this is to introduce users to how our app work');
        expect(response.body.ownerId.username).toEqual('flyguy');
        expect(err).toBeNull();
        if (err) {
          return err;
        }
        done();
      });
  });

  it('should find all documents accessible to a user', function(done) {

    var docDetail2 = docData[4];

    docDetail2.ownerId = id;

    var newDoc = new Document(docDetail2);

    newDoc.save(function(err) {
      if (err) {
        console.log(err);
      }
    });

    request(app)
      .get('/users/' + id + '/documents')
      .set('x-access-token', token)
      .expect('Content-Type', /json/)
      .end(function(err, response) {
 
        expect(response.statusCode).toBe(200);
        expect(response.body[0].title).toEqual('User introduction');
        expect(response.body[0].content)
          .toEqual('this is to introduce users to how our app work');
        expect(response.body[1].title).toEqual('How to make money');
        expect(response.body[0].content)
          .toEqual('work, work work harder, harder, harder and harder, repeat from the beginning.');
        expect(response.body[0].ownerId.username).toEqual('flyguy');
        expect(response.body[1].ownerId.username).toEqual('flyguy');
        if (err) {
          return err;
        }
        done();
      });
  });

  it('should update document attributes', function(done) {

    request(app)
      .put('/documents/' + id)
      .set('x-access-token', token)
      .send({
        title: 'Updated introduction',
        content: 'this document has just been updated'
      })
      .end(function(err, response) {

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(jasmine.objectContaining({
          success: true,
          message: 'Document updated'
        }));
        expect(err).toBeNull();
        request(app)
          .get('/documents/' + id)
          .set('x-access-token', token)
          .end(function(err, response) {
            expect(response.statusCode).toBe(200);
            expect(response.body.title).toEqual('Updated introduction');
            expect(response.body.content)
              .toEqual('this document has just been updated');
          });
        done();

      });
  });

  it('should delete document', function(done) {

    request(app)
      .delete('/documents/' + id)
      .set('x-access-token', token)
      .end(function(err, response) {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(jasmine.objectContaining({
          success: true,
          message: 'Document deleted from list'
        }));
        expect(err).toBeNull();
        request(app)
          .get('/documents/' + id)
          .set('x-access-token', token)
          .end(function(err, response) {
            expect(response.statusCode).toBe(404);
            expect(response.body).toEqual(jasmine.objectContaining({
              success: false,
              message: 'this document does not exist'
            }));
            done();
          });
      });
  });
});

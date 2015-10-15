var request = require('supertest');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var secret = require('../config/config');

var app = require('../server');
var Document = require('../app/models/document-model');
var User = require('../app/models/user-model');

var data = fs.readFileSync(__dirname + '/fixtures/users.json');

var userData = JSON.parse(data);

describe('Log User', function() {

  beforeEach(function(done) {
    var newUser = new User(userData[0]);

    newUser.save(function(err) {
      if (err) {
        console.log(err);
      }
    });
    done();
  });

  afterEach(function(done) {

    User.remove({}, function(err) {
      if (err) {
        console.log(err);
      }
    });
    done();
  });


  it('should log user in', function(done) {

    request(app)
      .post('/users/login')
      .send({
        username: userData[0].username,
        password: userData[0].password,
      })
      .end(function(err, response) {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(jasmine.objectContaining({
          success: true,
          message: 'you are logged in'
        }));
        expect(err).toBeNull();
        done();
      });
  });

  it('should not login a user with wrong username', function(done) {

    request(app)
      .post('/users/login')
      .send({
        username: userData[1].username,
        password: userData[0].password,
      })
      .end(function(err, response) {
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual(jasmine.objectContaining({
          success: false,
          message: 'Invalid username/password'
        }));
        expect(err).toBeNull();
        done();
      });
  });

  it('should not login a user with wrong password', function(done) {

    request(app)
      .post('/users/login')
      .send({
        username: userData[0].username,
        password: userData[1].password,
      })
      .end(function(err, response) {
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual(jasmine.objectContaining({
          success: false,
          message: 'Invalid username/password'
        }));
        expect(err).toBeNull();
        done();
      });
  });

  it('should log a user out', function(done) {

    request(app)
      .post('/users/logout')
      .send({
        username: userData[0].username,
        password: userData[0].password,
      })
      .end(function(err, response) {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(jasmine.objectContaining({
          success: true,
          message: 'you have successfully logged out'
        }));
        expect(err).toBeNull();
        done();
      });
  });

});

describe('POST /users/', function() {

  afterEach(function(done) {

    User.remove({});
    done();
  });

  it('should not create a user with invalid username', function(done) {

    var newUser = {
      "username": undefined,
      "name": {
        "first": "John",
        "last": "Legend"
      },
      "email": "flyestman@gmail.com",
      "password": "northside2003"
    };

    request(app)
      .post('/users')
      .send(newUser)
      .end(function(err, response) {
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual(jasmine.objectContaining({
          success: false,
          message: 'provide a valid username'
        }));
        if (err) {
          return err;
        }
        done();
      });
  });

  it('should not create a user with invalid first or last name', function(done) {

    var newUser = {
      "username": 'flyguy',
      "name": {
        "first": undefined,
        "last": "Legend"
      },
      "email": "flyestman@gmail.com",
      "password": "northside2003"
    };

    request(app)
      .post('/users')
      .send(newUser)
      .end(function(err, response) {
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual(jasmine.objectContaining({
          success: false,
          message: 'provide valid first and last names'
        }));
        if (err) {
          return err;
        }
        done();
      });
  });

  it('should not create a user with invalid email', function(done) {

    var newUser = {
      "username": 'flyguy',
      "name": {
        "first": "John",
        "last": "Legend"
      },
      "email": undefined,
      "password": "northside2003"
    };

    request(app)
      .post('/users')
      .send(newUser)
      .end(function(err, response) {
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual(jasmine.objectContaining({
          success: false,
          message: 'provide a valid email address'
        }));
        if (err) {
          return err;
        }
        done();
      });
  });

  it('should not create a user with incorrect email', function(done) {

    var newUser = {
      "username": 'flyguy',
      "name": {
        "first": "John",
        "last": "Legend"
      },
      "email": "flyestman",
      "password": "northside2003"
    };

    request(app)
      .post('/users')
      .send(newUser)
      .end(function(err, response) {
        expect(response.body.name).toEqual('ValidationError');
        expect(typeof err).toEqual(typeof {});
        if (err) {
          return err;
        }
        done();
      });
  });

  it('should not create a user with invalid password', function(done) {

    var newUser = {
      "username": 'flyguy',
      "name": {
        "first": "John",
        "last": "Legend"
      },
      "email": "flyestman@gmail.com",
      "password": undefined
    };

    request(app)
      .post('/users')
      .send(newUser)
      .end(function(err, response) {
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual(jasmine.objectContaining({
          success: false,
          message: 'provide a valid password'
        }));
        if (err) {
          return err;
        }
        done();
      });
  });

  it('should not create a user with password less than 6 characters', function(done) {

    var newUser = {
      "username": 'flyguy',
      "name": {
        "first": "John",
        "last": "Legend"
      },
      "email": "flyestman",
      "password": "noth1"
    };

    request(app)
      .post('/users')
      .send(newUser)
      .end(function(err, response) {
        expect(response.body.name).toEqual('ValidationError');
        expect(typeof err).toEqual(typeof {});
        if (err) {
          return err;
        }
        done();
      });
  });

  it('should create a user with correct credentials', function(done) {

    var newUser = {
      "username": 'flyguy',
      "name": {
        "first": "John",
        "last": "Legend"
      },
      "email": "flyestman@gmail.com",
      "password": "northside2003"
    };

    request(app)
      .post('/users')
      .send(newUser)
      .end(function(err, response) {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(jasmine.objectContaining({
          success: true,
          message: 'registration successful'
        }));
        if (err) {
          return err;
        }
        done();
      });
  });
});

describe('GET /users/', function() {

  var id;
  beforeEach(function(done) {

    var newUser = new User(userData[0]);

    newUser.save(function(err) {
      if (err) {
        console.log(err);
      }
    });

    id = newUser.id;

    token = jwt.sign(newUser, secret.key, {
      expiresIn: 144000
    });

    done();
  });


  afterEach(function(done) {

    User.remove({}, function(err) {
      if (err) {
        console.log(err);
      }
    });
    done();
  });

  it('should return all user', function(done) {

    for (var i = 1; i < userData.length; i++) {

      var newUsers = new User(userData[i]);

      newUsers.save(function(err) {
        if (err) {
          console.log(err);
        }
      });
    }

    request(app)
      .get('/users')
      .expect('Content-Type', /json/)
      .end(function(err, response) {
        expect(response.statusCode).toBe(200);
        expect(response.body[0].username).toEqual('flyguy');
        expect(response.body[0].email)
          .toEqual('flyestman@gmail.com');
        expect(response.body[1].username).toEqual('tobiscky');
        expect(response.body[2].username).toEqual('prettydiva');
        expect(response.body[3].name).toEqual({
          "first": "Ifeanyi",
          "last": "Oraelosi"
        });
        expect(response.body[4].password).toEqual('queenada2015');
        if (err) {
          return err;
        }
        done();
      });
  });

  xit('should return a single user', function(done) {

    request(app)
      .get('/users/' + id)
      .set('x-access-token', token)
      .expect('Content-Type', /json/)
      .end(function(err, response) {
        expect(response.statusCode).toBe(200);
        expect(response.body[0].username).toEqual('flyguy');
        expect(response.body[0].email).toEqual('flyestman@gmail.com');
        expect(response.body.name)
          .toEqual({
            first: "John",
            last: "Legend"
          });
        expect(response.body.password).toEqual('northside2003');
        expect(err).toBeNull();
        if (err) {
          return err;
        }
        done();
      });
  });

  it('should update user attributes', function(done) {

    request(app)
      .put('/users/' + id)
      .set('x-access-token', token)
      .send({
        username: 'flyman',
        email: 'sofly2012@yahoo.co.uk',
        password: 'sofly001'
      })
      .end(function(err, response) {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(jasmine.objectContaining({
          success: true,
          message: 'your details updated'
        }));
        expect(err).toBeNull();
        request(app)
          .get('/users/' + id)
          .set('x-access-token', token)
          .end(function(err, response) {
            expect(response.statusCode).toBe(200);
            expect(response.body.name).toEqual({
              first: "John",
              last: "Legend"
            });
            expect(response.body.username).toEqual('flyman');
            expect(response.body.email).toEqual('sofly2012@yahoo.co.uk');
            expect(response.body.password).toEqual('sofly001');
            done();
          });

      });
  });

  it('should delete user', function(done) {

    request(app)
      .delete('/users/' + id)
      .set('x-access-token', token)
      .end(function(err, response) {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(jasmine.objectContaining({
          success: true,
          message: 'User deleted'
        }));
        expect(err).toBeNull();
        request(app)
          .get('/users/' + id)
          .set('x-access-token', token)
          .end(function(err, response) {
            expect(response.statusCode).toBe(404);
            expect(response.body).toEqual(jasmine.objectContaining({
              success: false,
              message: 'this user does not exist'
            }));
            done();
          });

      });
  });
});

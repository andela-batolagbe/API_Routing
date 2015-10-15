var User = require('../models/user-model');
var jwt = require('jsonwebtoken');
var secret = require('../../config/config');
module.exports = {


  createUser: function(req, res) {

    var userData = req.body;

    if (!userData.username) {

      res.status(401).send({
        success: false,
        message: 'provide a valid username'
      });
    } else if (!userData.password) {

      res.status(401).send({
        success: false,
        message: 'provide a valid password'
      });
    } else if (!userData.email) {

      res.status(401).send({
        success: false,
        message: 'provide a valid email address'
      });
    } else if (!userData.name.first || !userData.name.last) {

      res.status(401).send({
        success: false,
        message: 'provide valid first and last names'
      });
    } else {

      var newUser = new User(userData);
      newUser.save(function(err) {
        if (err) {
          res.send(err);
        } else {
          res.send({
            success: true,
            message: 'registration successful'
          });
        }
      });
    }
  },


  logInUser: function(req, res) {
    User.findOne({
        username: req.body.username
      })
      .select('username password')
      .exec(function(err, user) {
        if (err) {
          return err;
        } else if (!user) {
          res.status(401).send({
            success: false,
            message: 'Invalid username/password'
          });
        } else {
          if (user.password === req.body.password) {
            var token = jwt.sign(user, secret.key, {
              expiresIn: 144000
            });
            res.json({
              success: true,
              message: 'you are logged in',
              token: token
            });
          } else {
            return res.status(401).send({
              success: false,
              message: 'Invalid username/password'
            });
          }
        }

      });
  },

  verifyUser: function(req, res, next) {
    var token = req.body.token ||
      req.query.token ||
      req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, secret.key, function(err, verified) {
        if (err) {
          return res.json({
            success: false,
            message: 'Verification failure: Invalid token'
          });
        } else {
          req.verified = verified;
          next();
        }
      });
    } else {
      res.status(403).send({
        success: false,
        message: 'No token provided'
      });
    }
  },

  logOutUser: function(req, res) {
    req.session.destroy(function(err, success) {
      if (err) {
        res.send(err);
      } else {
        res.status(200).send({
          success: true,
          message: 'you have successfully logged out'
        });

      }
    });

  },

  getAllUsers: function(req, res) {

    User
      .find({})
      .exec(function(err, users) {
        if (err) {
          res.send(err);
        } else if (!users) {
          res.status(404).send({
            success: false,
            message: 'No user found'
          });
        } else {
          res.json(users);
        }
      });

  },


  getOneUser: function(req, res) {
    User.findById(req.params.id)
      .exec(function(err, user) {

        if (err) {
          res.send(err);
        } else if (!user) {
          res.status(404).send({
            success: false,
            message: 'this user does not exist'
          });
        } else {
          res.json(user);
        }
      });
  },


  updateUser: function(req, res) {


    User
      .findByIdAndUpdate(req.params.id, req.body, function(err, user) {

        if (err) {
          res.send(err);
        } else {
          res.send({
            success: true,
            message: 'your details updated',
            doc: user
          });
        }
      });
  },

  removeUser: function(req, res) {

    User.findById(req.params.id)
      .remove(function(err, user) {

        if (err) {
          res.send(err);
        } else {
          res.send({
            success: true,
            message: 'User deleted'
          });
        }
      });
  }

};

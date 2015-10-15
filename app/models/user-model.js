var mongoose = require("mongoose");
var validator = require('validator');
var Schema = mongoose.Schema;

var userSchema = new Schema({

  username: {
    type: String,
    validate: [validator.isAlphanumeric, 'provide only characters'],
    unique: true,
    required: 'provide a username'
  },

  name: {
    first: {
      type: String,
      validate: [validator.isAlpha, 'provide only characters'],
      required: 'Provide a first name'
    },

    last: {
      type: String,
      validate: [validator.isAlpha, 'provide only characters'],
      required: 'Provide a first name'
    }
  },

  email: {
    type: String,
    validate: [validator.isEmail, 'provide a valid email'],
    unique: true,
    required: 'Provide an email address'
  },

  password: {
    type: String,
    minlength: 6,
    required: 'Provide a valid password'
  }
});


module.exports = mongoose.model('User', userSchema);

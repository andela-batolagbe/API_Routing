var mongoose = require("mongoose");
var user = require('./user-model.js');
var validator = require('validator');
var Schema = mongoose.Schema;


var documentSchema = new Schema({

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  title: {
    type: String,
  },

  content: {
    type: String,
    require: true,
    required: 'provide contents'
  },

  dateCreated: {
    type: Date,
    default: Date.now
  },

  lastModified: {
    type: Date,
    default: Date.now
  }

});


module.exports = mongoose.model('Document', documentSchema);

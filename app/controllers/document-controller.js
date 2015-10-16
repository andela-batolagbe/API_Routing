var Document = require('../models/document-model');
var User = require('../models/user-model');

module.exports = {


  createDocument: function(req, res) {
    var docData = req.body;
    var userId;
    var findUser = User.find({
      username: docData.user
    });

    if (findUser && findUser !== [] && findUser !== {}) {

      userId = findUser._id;
    } else {
      userId = '';
    }

    docData.ownerId = userId;

    var newDocument = new Document(docData);
    newDocument.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send({
          success: true,
          message: 'Your document has been saved'
        });
      }
    });
  },


  getAllDocuments: function(req, res) {

    Document.find({})
      .populate('ownerId')
      .sort({
        title: 'ascending'
      })
      .exec(function(err, documents) {
        if (err) {
          res.send(err);
        } else if (!documents) {
          res.status(404).send({
            success: false,
            message: 'No document found'
          });
        } else {
          res.json(documents);
        }
      });

  },


  getOneDocument: function(req, res) {
    Document.findById(req.params.id)
      .populate('ownerId')
      .exec(function(err, doc) {

        if (err) {
          res.send(err);
        } else if (!doc) {
          res.status(404).send({
            success: false,
            message: 'this document does not exist'
          });
        } else {
          res.json(doc);
        }
      });
  },

  getUserDocuments: function(req, res) {
    Document.find({})
      .where('ownerId').equals(req.params.id)
      .populate('ownerId')
      .exec(function(err, doc) {

        if (err) {
          res.send(err);
        } else if (!doc) {
          res.status(404).send({
            success: false,
            message: 'cannot find any document for this user'
          });
        } else {
          res.json(doc);
        }
      });
  },

  updateDocument: function(req, res) {


    Document
      .findByIdAndUpdate(req.params.id, req.body, function(err, doc) {

        if (err) {
          res.send(err);
        } else {
          res.send({
            success: true,
            message: 'Document updated'
          });
        }
      });
  },

  removeDocument: function(req, res) {

    Document.findById(req.params.id)
      .remove(function(err, doc) {

        if (err) {
          res.send(err);
        } else {
          res.send({
            success: true,
            message: 'Document deleted from list'
          });
        }
      });
  }

};

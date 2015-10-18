var Document = require('../models/document-model');
var User = require('../models/user-model');

module.exports = {

  /**
   * [createDocument method to create new documents]
   * @param  {JSON} req [request]
   * @param  {JSON} res [response variable]
   * @return {string}     [status message]
   */
  createDocument: function(req, res) {
    var docData = req.body;
    var userId;
    var findUser = User.find({
      username: docData.user
    });

    if (findUser) {

      userId = findUser._id;
    } else {
      return 'cannot post document without user';
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

  /**
   * [getAllDocuments get all documents in database]
   * @param  {JSON} req [request variable]
   * @param  {JSON} res [response variable]
   * @return {JSON}     [document list]
   */
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

    /**
   * [getOneDocuments a single document]
   * @param  {JSON} req [request variable]
   * @param  {JSON} res [response variable]
   * @return {JSON}     [document, if found, 
   *                     message if not foud]
   */
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

    /**
   * [getUserDocuments get all documents owned
   * by a given user]
   * @param  {JSON} req [request variable]
   * @param  {JSON} res [response variable]
   * @return {JSON}     [user document list, response 
   *                          message if not found]
   */
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


    /**
   * [updateDocument update attributes of a document]
   * @param  {JSON} req [request variable]
   * @param  {JSON} res [response variable]
   * @return {JSON}     [success message]
   */
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

    /**
   * [removeDocument delete a document from database]
   * @param  {JSON} req [request variable]
   * @param  {JSON} res [response variable]
   * @return {JSON}     [success message]
   */
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

var express = require('express');
var router = express.Router();

var userController = require('../controllers/user-controller');
var docController = require('../controllers/document-controller');


router.route('/users')
  .post(userController.createUser)
  .get(userController.getAllUsers);

router.route('/users/login')
  .post(userController.logInUser);

router.route('/users/logout')
  .post(userController.logOutUser);

//authenticate user for the following routes
// using the verifyUser middleware

router.route('/users/:id')
  .get(userController.verifyUser, userController.getOneUser)
  .put(userController.verifyUser, userController.updateUser)
  .delete(userController.verifyUser, userController.removeUser);

router.route('/documents')
  .post(userController.verifyUser, docController.createDocument)
  .get(docController.getAllDocuments);

router.route('/documents/:id')
  .get(userController.verifyUser, docController.getOneDocument)
  .put(userController.verifyUser, docController.updateDocument)
  .delete(userController.verifyUser, docController.removeDocument);

router.route('/users/:id/documents')
  .get(userController.verifyUser, docController.getUserDocuments);


module.exports = router;

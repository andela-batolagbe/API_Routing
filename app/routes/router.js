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

//authenticate user
router.use(userController.verifyUser);

router.route('/users/:id')
  .get(userController.getOneUser)
  .put(userController.updateUser)
  .delete(userController.removeUser);

router.route('/documents')
  .post(docController.createDocument)
  .get(docController.getAllDocuments);

router.route('/documents/:id')
  .get(docController.getOneDocument)
  .put(docController.updateDocument)
  .delete(docController.removeDocument);

router.route('/users/:id/documents')
  .get(docController.getUserDocuments);


module.exports = router;

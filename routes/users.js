var express = require('express');
var router = express.Router();

var userController = require('./../controllers/userController')
/* GET users listing. */

router.post('/signup', userController.signup)

router.post('/login', userController.login)

router.get('/logout', userController.logout)

router.get('/is_auth', userController.isAuthenticated)

router.post('/upload_file', userController.createPin)

router.get('/get_own_pins', userController.getOwnPins)

router.delete('/delete_pin/:id', userController.delPinById)

router.post('/signup', userController.signup)
router.post('/login', userController.login)
router.get('/logout', userController.logout)
router.get('/authenication', userController.isAuthenticated)
router.post('/pin', userController.createPin) // createPin
router.get('/pins', userController.getOwnPins)
router.delete('/pin/:id', userController.delPinById)

module.exports = router;

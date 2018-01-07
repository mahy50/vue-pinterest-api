var express = require('express')
var router = express.Router()

const Passport = require('passport')
const pinController = require('./../controllers/pinController')

/* /api/*  GET home data. */

router.get('/pins', pinController.getPins)
router.get('/pin/:id', pinController.getPinById)
router.post('/pin/:id', pinController.updatePin)

module.exports = router

const express = require('express')
const router = express.Router();

const { auth } = require('../middleware/auth')
const { mainHtml } = require('../controllers/main.js')

router.route('/').get(auth, mainHtml)

module.exports = router
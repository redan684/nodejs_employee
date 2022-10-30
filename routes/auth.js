const express = require('express');
const router = express.Router();
const {handleLogin} = require('../controllers/authContoller');

router.post('/', handleLogin);

module.exports = router;
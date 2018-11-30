const { Router } = require('express');

const { getLog, getLogOut } = require('../controllers/log');

const router = Router();

// handle log get request
router.get('/', getLog);

// handle log out get request
router.get('/out', getLogOut)

module.exports = router;

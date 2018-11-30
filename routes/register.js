const { Router } = require('express');

const { getRegister } = require('../controllers/register');

const router = Router();

// handle get request for register page
router.get('/', getRegister);

module.exports = router;
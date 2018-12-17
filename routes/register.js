const { Router } = require('express');

const { getRegister, postRegister } = require('../controllers/register');

const router = Router();

// handle get request for register page
router.get('/', getRegister);

// handle post request for register page
router.post('/', postRegister);

module.exports = router;
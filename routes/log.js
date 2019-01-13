const { Router } = require('express');

const { getLog, getLogOut, getFailedLogIn, postSignIn } = require('../controllers/log');

const router = Router();

// handle log get request
router.get('/', getLog);
// handle log out get request
router.get('/out', getLogOut);
// handle log in fail
router.get('/failed', getFailedLogIn);
// handle log post request
router.post('/', postSignIn);

module.exports = router;

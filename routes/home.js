const { Router } = require('express');

const { getHome } = require('../controllers/home');

const router = Router();

// handle root get request
router.get('/', getHome);

module.exports = router;
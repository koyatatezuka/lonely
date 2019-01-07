const { Router } = require('express');

const { getSuggestions } = require('../controllers/user/suggestions');
const { getUserProfile } = require('../controllers/user/userProfile');
const {
	postPartnerRequest,
	postRequestResponse,
	getRequests
} = require('../controllers/user/request');
const { getPartners } = require('../controllers/user/partner');
const { getSearch, postSearch } = require('../controllers/user/search');

const router = Router();

// handle get request for user suggetion routes
router.get('/suggestions', getSuggestions);
// handle get request for user profile by id
router.get('/byuser/:id', getUserProfile);
// handle get request for partner
router.get('/requests', getRequests);
// handle post request for partner request
router.post('/requests', postPartnerRequest);
// handle post request for response request
router.post('/requests/response', postRequestResponse);
// handle get request for partner request
router.get('/partners', getPartners);
// handle post request user search
router.post('/search', postSearch);

module.exports = router;

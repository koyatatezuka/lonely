const { Router } = require('express');

const { postComment, deleteComment } = require('../controllers/post/comment');
const { postReply, deleteReply } = require('../controllers/post/reply');

const router = Router();

// handle post request for comment
router.post('/comment', postComment);
// handle post request for delete comment
router.post('/comment/delete', deleteComment);
// handle post request for reply
router.post('/reply', postReply);
// handle post request for reply delete
router.post('/reply/delete', deleteReply);

module.exports = router;

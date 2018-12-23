const knex = require('../../knex/knex');

// handle reply post request
exports.postReply = async (req, res) => {
	const reply = await knex('replies').insert({
		commentId: req.body.commentId,
		userId: req.body.userId,
		reply: req.body.reply
	});

	res.redirect('/');
};

//handle reply delete post request
exports.deleteReply = async (req, res) => {
	const deletedReply = await knex('replies')
		.where({ id: req.body.replyId })
		.del();

	res.redirect('/');
};

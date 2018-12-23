const knex = require('../../knex/knex');

// handle comment post request
exports.postComment = async (req, res) => {
	const comment = await knex('comments').insert({
		userId: req.user.id,
		comment: req.body.comment
	});

	res.redirect('/');
};

// handle comment delete post request
exports.deleteComment = async (req, res) => {
	// delete replies associated with comment
	const deletedRelpies = await knex('replies')
		.where({ commentId: req.body.commentId })
		.del();

	const deletedComment = await knex('comments')
		.where({ id: req.body.commentId })
		.del();

	res.redirect('/');
};

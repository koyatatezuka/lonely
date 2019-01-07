const knex = require('../knex/knex');
const {
	getAge,
	getPreferedGender,
	getPreferedSexualPreference,
	getDate
} = require('../util/helper');

// handle root home get request
exports.getHome = async (req, res) => {
	let preferedGender = ['male', 'female'];
	let preferedSexualPreference = ['straight', 'gayLesbian', 'biSexual'];
	const isSignIn = true;

	if (!isSignIn) return res.redirect('/log');

	const user = req.user;

	// get prefered gender and sexual preference
	preferedGender = getPreferedGender(user.gender, user.sexualPreference);
	preferedSexualPreference = getPreferedSexualPreference(user.sexualPreference);

	// find all requested users and partners and concat into single array
	const requested = await knex('requests')
		.select('partnerId')
		.where({ userId: user.id });
	const partner = await knex('partners')
		.select('partnerId')
		.where({ userId: user.id });
	let exclude = [...requested, ...partner];
	exclude = exclude.map(users => users.partnerId);

	// find all other users within -+5 of user lonely level. Account for gender preference and sexual orientation
	const suggestion = await knex('users')
		.whereBetween('lonelyLevel', [user.lonelyLevel - 5, user.lonelyLevel + 5])
		.whereIn('gender', preferedGender)
		.whereIn('sexualPreference', preferedSexualPreference)
		.whereNotIn('id', exclude)
		.whereNot({ id: user.id })
		.limit(10);
	// find user age with helper function
	const age = getAge(user.dob);

	// find all comments
	const comments = await knex('comments')
		.where({ userId: user.id })
		.orderBy('created_at', 'desc');
	// convert created_at Date into usable format
	comments.forEach(obj => (obj.created_at = getDate(obj.created_at)));
	// find all replies
	const replies = await knex('replies')
		.join('users', 'users.id', 'replies.userId')
		.whereIn('commentId', comments.map(el => el.id))
		.select(
			'replies.id',
			'replies.reply',
			'replies.userId',
			'replies.created_at',
			'replies.commentId',
			'users.firstName',
			'users.lastName',
			'users.image'
		)
		.orderBy('replies.created_at', 'desc');
	// convert created_at Date into usable format and convert last name to first letter
	replies.forEach(obj => {
		obj.created_at = getDate(obj.created_at);
		obj.lastName = obj.lastName.charAt(0);
	});

	// add array of replies onto comments
	comments.forEach(com => {
		com.replies = [];

		replies.forEach(rep => {
			if (rep.commentId == com.id) {
				com.replies.push(rep);
			}
		});
	});

	// find all request for partner by id
	const partnerRequest = await knex('requests').where({ partnerId: user.id });

	res.render('home', {
		pageTitle: 'Home',
		homeCss: true,
		user,
		age,
		comments,
		suggestionCount: suggestion.length,
		requestCount: partnerRequest.length
	});
};

const knex = require('../../knex/knex');
const {
	getAge,
	getPreferedGender,
	getPreferedSexualPreference,
	getDate
} = require('../../util/helper');

// handle get request for user profile by id
exports.getUserProfile = async (req, res) => {
	let preferedGender = ['male', 'female'];
	let preferedSexualPreference = ['straight', 'gayLesbian', 'biSexual'];

	if (!req.user) return res.redirect('/log');

	const user = req.user;

	// find user age with helper function
	const age = getAge(user.dob);

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
	// the chosen profile by id
	const userById = await knex('users').where({ id: req.params.id });
	// profile age
	const profileAge = getAge(userById[0].dob);

	// check if request is pending
	const pending = await knex('requests').where({
		userId: user.id,
		partnerId: req.params.id
	});

	// check if is partner
	const isPartner = await knex('partners')
		.where({
			userId: user.id,
			partnerId: req.params.id
		})
		.orWhere({
			userId: req.params.id,
			partnerId: user.id
		});

	// find all comments
	const comments = await knex('comments')
		.where({ userId: req.params.id })
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
		// checks if reply belongs to the user
		obj.isOwnPost = obj.userId === user.id;
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

	// check if its the owners profile
	const isUserProfile = user.id == req.params.id;

	res.render('user', {
		pageTitle: 'userName',
		userCss: true,
		userProfiles: true,
		user,
		age,
		profileAge,
		comments,
		isUserProfile,
		requestCount: partnerRequest.length,
		suggestionCount: suggestion.length,
		userById: userById[0],
		pending: pending.length > 0,
		isPartner: isPartner.length > 0
	});
};

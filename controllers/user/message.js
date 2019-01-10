const knex = require('../../knex/knex');
const {
	getAge,
	getPreferedGender,
	getPreferedSexualPreference
} = require('../../util/helper');

// handle user search get request
exports.getMessage = async (req, res) => {
	let preferedGender = ['male', 'female'];
	let preferedSexualPreference = ['straight', 'gayLesbian', 'biSexual'];

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

	// find all request for partner by id
	const partnerRequest = await knex('requests').where({ partnerId: user.id });

	// info of partner user is messaging
	const messagePartner = await knex
		.select('id', 'firstName')
		.from('users')
		.where({ id: req.params.id });

	const messageList = await knex('messages')
		.join('users', 'users.id', 'messages.user_one')
		.where({
			user_one: user.id,
			user_two: req.params.id
		})
		.orWhere({
			user_one: req.params.id,
			user_two: user.id
		})
    .orderBy('messages.created_at', 'desc')
    .select(
      'messages.message',
      'users.firstName',
      'users.lastName',
      'users.image'
    );

	res.render('user', {
		pageTitle: 'Message',
		userCss: true,
		message: true,
    messagePartner: messagePartner[0],
    messageList,
		user,
		age,
		suggestionCount: suggestion.length,
		requestCount: partnerRequest.length
	});
};

exports.postMessage = async (req, res) => {
	const message = await knex('messages').insert({
		user_one: req.user.id,
		user_two: req.params.id,
		message: req.body.message
	});

	res.redirect(`/user/message/${req.params.id}`);
};
